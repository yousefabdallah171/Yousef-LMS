import type { NextFunction, Request, Response } from 'express'

import { verifyAccessToken } from '../utils/jwt.js'

function unauthorized(res: Response) {
  return res.status(401).json({
    code: 'UNAUTHORIZED',
    message: 'Authentication required',
  })
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return unauthorized(res)
  }

  try {
    const token = header.slice('Bearer '.length)
    const payload = verifyAccessToken(token)

    req.user = {
      id: payload.sub,
      role: payload.role,
    }

    return next()
  } catch {
    return unauthorized(res)
  }
}

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
