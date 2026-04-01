import crypto from 'node:crypto'

import { Prisma } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js'
import { hashPassword, verifyPassword } from '../utils/password.js'

const authRouter = Router()

const ERROR_CODES = {
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
} as const

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8).max(72),
})

const loginSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8).max(72),
})

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})

type RegisterInput = z.infer<typeof registerSchema>
type LoginInput = z.infer<typeof loginSchema>
type RefreshInput = z.infer<typeof refreshTokenSchema>

function toAppRole(role: 'ADMIN' | 'STUDENT'): 'admin' | 'student' {
  return role === 'ADMIN' ? 'admin' : 'student'
}

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function buildAccessToken(user: {
  id: string
  role: 'ADMIN' | 'STUDENT'
  name: string
  email: string
}) {
  return signAccessToken(user.id, toAppRole(user.role), user.name, user.email)
}

function buildAuthPayload(user: {
  id: string
  role: 'ADMIN' | 'STUDENT'
  name: string
  email: string
}) {
  const refreshToken = signRefreshToken(user.id)

  return {
    accessToken: buildAccessToken(user),
    refreshToken,
    refreshTokenHash: hashToken(refreshToken),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: toAppRole(user.role),
    },
  }
}

function getRefreshExpiryDate(token: string) {
  const payload = verifyRefreshToken(token)

  if (payload.type !== 'refresh' || !payload.exp) {
    return null
  }

  return new Date(payload.exp * 1000)
}

authRouter.post('/register', validate(registerSchema), async (req, res) => {
  const { email, name, password } = req.body as RegisterInput

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (existingUser) {
    return res.status(409).json({
      code: ERROR_CODES.EMAIL_ALREADY_EXISTS,
      message: 'Email is already registered',
    })
  }

  const passwordHash = await hashPassword(password)
  let createdUser: Awaited<ReturnType<typeof prisma.user.create>>

  try {
    createdUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'STUDENT',
      },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        code: ERROR_CODES.EMAIL_ALREADY_EXISTS,
        message: 'Email is already registered',
      })
    }

    throw error
  }

  const authPayload = buildAuthPayload(createdUser)
  const refreshExpiresAt = getRefreshExpiryDate(authPayload.refreshToken)

  if (!refreshExpiresAt) {
    throw new Error('Failed to calculate refresh token expiry')
  }

  await prisma.refreshToken.create({
    data: {
      userId: createdUser.id,
      tokenHash: authPayload.refreshTokenHash,
      expiresAt: refreshExpiresAt,
    },
  })

  return res.status(201).json({
    accessToken: authPayload.accessToken,
    refreshToken: authPayload.refreshToken,
    user: authPayload.user,
  })
})

authRouter.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body as LoginInput
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return res.status(401).json({
      code: ERROR_CODES.INVALID_CREDENTIALS,
      message: 'Email or password is incorrect',
    })
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)

  if (!isValidPassword) {
    return res.status(401).json({
      code: ERROR_CODES.INVALID_CREDENTIALS,
      message: 'Email or password is incorrect',
    })
  }

  const authPayload = buildAuthPayload(user)
  const refreshExpiresAt = getRefreshExpiryDate(authPayload.refreshToken)

  if (!refreshExpiresAt) {
    throw new Error('Failed to calculate refresh token expiry')
  }

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: authPayload.refreshTokenHash,
      expiresAt: refreshExpiresAt,
    },
  })

  return res.status(200).json({
    accessToken: authPayload.accessToken,
    refreshToken: authPayload.refreshToken,
    user: authPayload.user,
  })
})

authRouter.post('/refresh', validate(refreshTokenSchema), async (req, res) => {
  const { refreshToken } = req.body as RefreshInput

  let payload: ReturnType<typeof verifyRefreshToken>

  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    return res.status(401).json({
      code: ERROR_CODES.INVALID_REFRESH_TOKEN,
      message: 'Refresh token is invalid or expired',
    })
  }

  if (payload.type !== 'refresh') {
    return res.status(401).json({
      code: ERROR_CODES.INVALID_REFRESH_TOKEN,
      message: 'Refresh token is invalid or expired',
    })
  }

  const currentTokenHash = hashToken(refreshToken)
  const currentTokenRecord = await prisma.refreshToken.findUnique({
    where: {
      tokenHash: currentTokenHash,
    },
    include: {
      user: true,
    },
  })

  if (
    !currentTokenRecord ||
    currentTokenRecord.userId !== payload.sub ||
    currentTokenRecord.revokedAt ||
    currentTokenRecord.expiresAt <= new Date()
  ) {
    return res.status(401).json({
      code: ERROR_CODES.INVALID_REFRESH_TOKEN,
      message: 'Refresh token is invalid or expired',
    })
  }

  const authPayload = buildAuthPayload(currentTokenRecord.user)
  const refreshExpiresAt = getRefreshExpiryDate(authPayload.refreshToken)

  if (!refreshExpiresAt) {
    throw new Error('Failed to calculate refresh token expiry')
  }

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: {
        id: currentTokenRecord.id,
      },
      data: {
        revokedAt: new Date(),
      },
    }),
    prisma.refreshToken.create({
      data: {
        userId: currentTokenRecord.userId,
        tokenHash: authPayload.refreshTokenHash,
        expiresAt: refreshExpiresAt,
      },
    }),
  ])

  return res.status(200).json({
    accessToken: authPayload.accessToken,
    refreshToken: authPayload.refreshToken,
  })
})

authRouter.post('/logout', requireAuth, async (req, res) => {
  await prisma.refreshToken.updateMany({
    where: {
      userId: req.user!.id,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  })

  return res.status(200).json({
    message: 'Logged out successfully',
  })
})

export { authRouter }
