import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8).max(72)
})

export const loginSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8).max(72)
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1)
})
