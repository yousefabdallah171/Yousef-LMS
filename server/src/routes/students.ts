import { UserRole } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'

const adminStudentsRouter = Router()

const studentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

adminStudentsRouter.get('/', requireAuth, requireAdmin, async (req, res) => {
  const { page, limit } = studentsQuerySchema.parse({
    page: typeof req.query.page === 'string' ? req.query.page : undefined,
    limit: typeof req.query.limit === 'string' ? req.query.limit : undefined,
  })

  const where = {
    role: UserRole.STUDENT,
  } as const

  const [total, students] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ])

  return res.status(200).json({
    students: students.map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      enrollmentCount: student._count.enrollments,
      joinedAt: student.createdAt.toISOString(),
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  })
})

adminStudentsRouter.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  const studentId = typeof req.params.id === 'string' ? req.params.id : ''

  const student = await prisma.user.findFirst({
    where: {
      id: studentId,
      role: UserRole.STUDENT,
    },
    include: {
      enrollments: {
        include: {
          course: {
            select: {
              id: true,
              slug: true,
              title: true,
              thumbnailUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!student) {
    return res.status(404).json({
      code: 'STUDENT_NOT_FOUND',
      message: 'Student not found',
    })
  }

  const courseIds = student.enrollments.map((enrollment) => enrollment.courseId)
  const progressRows =
    courseIds.length > 0
      ? await prisma.lessonProgress.findMany({
          where: {
            studentId: student.id,
            lesson: {
              section: {
                courseId: {
                  in: courseIds,
                },
              },
            },
          },
          include: {
            lesson: {
              select: {
                section: {
                  select: {
                    courseId: true,
                  },
                },
              },
            },
          },
        })
      : []

  const watchedByCourse = progressRows.reduce<Record<string, number>>((accumulator, row) => {
    const courseId = row.lesson.section.courseId
    accumulator[courseId] = (accumulator[courseId] ?? 0) + 1
    return accumulator
  }, {})

  return res.status(200).json({
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      joinedAt: student.createdAt.toISOString(),
      enrollments: student.enrollments.map((enrollment) => ({
        courseId: enrollment.course.id,
        courseSlug: enrollment.course.slug,
        courseName: enrollment.course.title,
        courseThumbnail: enrollment.course.thumbnailUrl,
        enrolledAt: enrollment.createdAt.toISOString(),
        lessonsWatched: watchedByCourse[enrollment.courseId] ?? 0,
      })),
    },
  })
})

export { adminStudentsRouter }
