import { z } from 'zod'

export const courseCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  thumbnailUrl: z.string().url(),
  price: z.number().nonnegative()
})

export const lessonCreateSchema = z.object({
  title: z.string().min(1),
  videoUrl: z.string().url(),
  description: z.string().optional()
})
