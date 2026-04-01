import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'

export type AccessTokenPayload = {
  sub: string
  role: 'admin' | 'student'
}

export type RefreshTokenPayload = {
  sub: string
  type: 'refresh'
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }

  return secret
}

export function signAccessToken(userId: string, role: 'admin' | 'student') {
  return jwt.sign({ role }, getJwtSecret(), {
    subject: userId,
    expiresIn: (process.env.JWT_ACCESS_EXPIRY || '15m') as SignOptions['expiresIn'],
  })
}

export function signRefreshToken(userId: string) {
  return jwt.sign({ type: 'refresh' }, getJwtSecret(), {
    subject: userId,
    expiresIn: (process.env.JWT_REFRESH_EXPIRY || '7d') as SignOptions['expiresIn'],
  })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as jwt.JwtPayload &
    AccessTokenPayload
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as jwt.JwtPayload &
    RefreshTokenPayload
}
