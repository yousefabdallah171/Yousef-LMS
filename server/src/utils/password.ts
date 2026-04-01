import bcrypt from 'bcrypt'

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12)
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash)
}
