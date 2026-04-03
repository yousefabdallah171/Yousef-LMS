import { Router } from 'express'

import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const enrollmentsRouter = Router()

enrollmentsRouter.get('/my', requireAuth, async (req, res) => {
  const studentId = req.user!.id
  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId,
    },
    include: {
      course: {
        select: {
          id: true,
          slug: true,
          title: true,
          thumbnailUrl: true,
          price: true,
          sections: {
            orderBy: {
              orderIndex: 'asc',
            },
            select: {
              lessons: {
                orderBy: {
                  orderIndex: 'asc',
                },
                select: {
                  id: true,
                  orderIndex: true,
                  lessonProgress: {
                    where: {
                      studentId,
                    },
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return res.status(200).json({
    enrollments: enrollments.map((enrollment) => {
      const lessons = enrollment.course.sections.flatMap((section) => section.lessons)
      const lessonsWatched = lessons.filter((lesson) => lesson.lessonProgress.length > 0).length
      const continueLesson =
        lessons.find((lesson) => lesson.lessonProgress.length === 0) ?? lessons[0] ?? null

      return {
        id: enrollment.id,
        courseId: enrollment.course.id,
        courseSlug: enrollment.course.slug,
        courseName: enrollment.course.title,
        courseThumbnail: enrollment.course.thumbnailUrl,
        price: Number(enrollment.course.price),
        enrolledAt: enrollment.createdAt.toISOString(),
        lessonsCount: lessons.length,
        lessonsWatched,
        continueLessonId: continueLesson?.id ?? null,
      }
    }),
  })
})

export { enrollmentsRouter }
