import { z } from 'zod'

export const courseCreateSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1),
  thumbnailUrl: z.string().url(),
  price: z.number().nonnegative()
})

export const sectionCreateSchema = z.object({
  title: z.string().trim().min(1).max(255),
  orderIndex: z.number().int().positive()
})

export const lessonCreateSchema = z.object({
  title: z.string().trim().min(1).max(255),
  videoUrl: z.string().url(),
  description: z.string().trim().optional()
})
