import { randomUUID } from 'node:crypto'
import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'

export type AccessTokenPayload = {
  sub: string
  role: 'admin' | 'student'
  name?: string
  email?: string
}

export type RefreshTokenPayload = {
  sub: string
  type: 'refresh'
}

function getRequiredSecret(key: 'JWT_SECRET' | 'JWT_REFRESH_SECRET') {
  const secret = process.env[key]

  if (!secret) {
    throw new Error(`${key} is not configured`)
  }

  return secret
}

function getJwtSecret() {
  return getRequiredSecret('JWT_SECRET')
}

function getJwtRefreshSecret() {
  return getRequiredSecret('JWT_REFRESH_SECRET')
}

export function signAccessToken(
  userId: string,
  role: 'admin' | 'student',
  name?: string,
  email?: string,
) {
  return jwt.sign({ role, name, email }, getJwtSecret(), {
    subject: userId,
    expiresIn: (process.env.JWT_ACCESS_EXPIRY || '15m') as SignOptions['expiresIn'],
  })
}

export function signRefreshToken(userId: string) {
  return jwt.sign({ type: 'refresh' }, getJwtRefreshSecret(), {
    subject: userId,
    jwtid: randomUUID(),
    expiresIn: (process.env.JWT_REFRESH_EXPIRY || '7d') as SignOptions['expiresIn'],
  })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as jwt.JwtPayload &
    AccessTokenPayload
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, getJwtRefreshSecret()) as jwt.JwtPayload &
    RefreshTokenPayload
}
