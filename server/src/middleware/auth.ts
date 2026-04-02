import type { NextFunction, Request, Response } from 'express'

import { verifyAccessToken } from '../utils/jwt.js'

type RequestUser = {
  id: string
  role: 'admin' | 'student'
}

function unauthorized(res: Response) {
  return res.status(401).json({
    code: 'UNAUTHORIZED',
    message: 'Authentication required',
  })
}

export function resolveRequestUser(req: Request): RequestUser | null {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = header.slice('Bearer '.length)
    const payload = verifyAccessToken(token)

    return {
      id: payload.sub,
      role: payload.role,
    }
  } catch {
    return null
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = resolveRequestUser(req)

  if (!user) {
    return unauthorized(res)
  }

  req.user = user

  return next()
}

// Must be chained after requireAuth because it depends on req.user.
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return unauthorized(res)
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      code: 'FORBIDDEN',
      message: 'Admin role required',
    })
  }

  return next()
}
