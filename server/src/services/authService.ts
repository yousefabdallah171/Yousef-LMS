import crypto from 'node:crypto'

import type { User } from '@prisma/client'

import { prisma } from '../lib/prisma.js'
import { redis } from '../utils/redis.js'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js'

type AppRole = 'admin' | 'student'

type AuthUser = Pick<User, 'id' | 'name' | 'email' | 'role'>

type IssuedTokens = {
  accessToken: string
  refreshToken: string
  refreshTokenHash: string
  refreshExpiresAt: Date
}

type AuthPayload = IssuedTokens & {
  user: {
    id: string
    name: string
    email: string
    role: AppRole
  }
}

function toAppRole(role: User['role']): AppRole {
  return role === 'ADMIN' ? 'admin' : 'student'
}

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function getRefreshExpiryDate(token: string) {
  const payload = verifyRefreshToken(token)

  if (payload.type !== 'refresh' || !payload.exp) {
    throw new Error('Failed to calculate refresh token expiry')
  }

  return new Date(payload.exp * 1000)
}

function getRedisKey(tokenHash: string) {
  return `refresh-token:${tokenHash}`
}

async function cacheRefreshTokenMetadata(
  tokenHash: string,
  userId: string,
  expiresAt: Date,
) {
  const ttlSeconds = Math.max(
    1,
    Math.floor((expiresAt.getTime() - Date.now()) / 1000),
  )

  try {
    await redis.set(
      getRedisKey(tokenHash),
      JSON.stringify({ userId, expiresAt: expiresAt.toISOString() }),
      'EX',
      ttlSeconds,
    )
  } catch {
    // Redis is a fast-path metadata cache for refresh tokens, not the source of truth.
  }
}

async function deleteRefreshTokenMetadata(tokenHash: string) {
  try {
    await redis.del(getRedisKey(tokenHash))
  } catch {
    // Ignore cache eviction failures and keep Prisma as the source of truth.
  }
}

function issueTokenPair(
  userId: string,
  role: AppRole,
  name?: string,
  email?: string,
): IssuedTokens {
  const refreshToken = signRefreshToken(userId)

  return {
    accessToken: signAccessToken(userId, role, name, email),
    refreshToken,
    refreshTokenHash: hashToken(refreshToken),
    refreshExpiresAt: getRefreshExpiryDate(refreshToken),
  }
}

export async function issueTokens(user: AuthUser): Promise<AuthPayload> {
  const issuedTokens = issueTokenPair(
    user.id,
    toAppRole(user.role),
    user.name,
    user.email,
  )

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: issuedTokens.refreshTokenHash,
      expiresAt: issuedTokens.refreshExpiresAt,
    },
  })

  await cacheRefreshTokenMetadata(
    issuedTokens.refreshTokenHash,
    user.id,
    issuedTokens.refreshExpiresAt,
  )

  return {
    ...issuedTokens,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: toAppRole(user.role),
    },
  }
}

export async function revokeRefreshToken(tokenHash: string) {
  await prisma.refreshToken.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  })

  await deleteRefreshTokenMetadata(tokenHash)
}

export async function rotateRefreshToken(
  oldTokenHash: string,
  user: AuthUser,
): Promise<IssuedTokens> {
  const nextTokens = issueTokenPair(
    user.id,
    toAppRole(user.role),
    user.name,
    user.email,
  )

  await prisma.$transaction(async (tx) => {
    const revokedTokens = await tx.refreshToken.updateMany({
      where: {
        tokenHash: oldTokenHash,
        userId: user.id,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    })

    if (revokedTokens.count !== 1) {
      throw new Error('Refresh token rotation failed')
    }

    await tx.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: nextTokens.refreshTokenHash,
        expiresAt: nextTokens.refreshExpiresAt,
      },
    })
  })

  await Promise.all([
    deleteRefreshTokenMetadata(oldTokenHash),
    cacheRefreshTokenMetadata(
      nextTokens.refreshTokenHash,
      user.id,
      nextTokens.refreshExpiresAt,
    ),
  ])

  return nextTokens
}

export function getRefreshTokenHash(token: string) {
  return hashToken(token)
}

export async function cleanupExpiredTokens() {
  const now = new Date()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const staleTokens = await prisma.refreshToken.findMany({
    where: {
      OR: [
        {
          expiresAt: {
            lt: now,
          },
        },
        {
          revokedAt: {
            lt: thirtyDaysAgo,
          },
        },
      ],
    },
    select: {
      tokenHash: true,
    },
  })

  await Promise.all(
    staleTokens.map(({ tokenHash }) => deleteRefreshTokenMetadata(tokenHash)),
  )

  await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        {
          expiresAt: {
            lt: now,
          },
        },
        {
          revokedAt: {
            lt: thirtyDaysAgo,
          },
        },
      ],
    },
  })
}
