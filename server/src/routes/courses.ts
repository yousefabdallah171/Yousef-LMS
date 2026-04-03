import { Router } from 'express'

import { prisma } from '../lib/prisma.js'
import { requireAuth, resolveRequestUser } from '../middleware/auth.js'

const coursesRouter = Router()
const lessonsRouter = Router()

function serializeCourseStatus(status: 'DRAFT' | 'PUBLISHED') {
  return status.toLowerCase() as 'draft' | 'published'
}

async function getPublishedCourseBySlug(slug: string, studentId?: string) {
  return prisma.course.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      sections: {
        orderBy: {
          orderIndex: 'asc',
        },
        include: {
          lessons: {
            orderBy: {
              orderIndex: 'asc',
            },
            include: {
              lessonProgress: studentId
                ? {
                    where: {
                      studentId,
                    },
                    select: {
                      watchedAt: true,
                    },
                  }
                : false,
            },
          },
        },
      },
    },
  })
}

function serializeCourseDetail(
  course: Awaited<ReturnType<typeof getPublishedCourseBySlug>>,
  options?: {
    includeLockedVideoUrls?: boolean
  },
) {
  if (!course) {
    return null
  }

  const includeLockedVideoUrls = options?.includeLockedVideoUrls ?? false

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    price: Number(course.price),
    status: serializeCourseStatus(course.status),
    sections: course.sections.map((section) => ({
      id: section.id,
      title: section.title,
      orderIndex: section.orderIndex,
      lessons: section.lessons.map((lesson) => ({
        id: lesson.id,
        sectionId: lesson.sectionId,
        title: lesson.title,
        description: lesson.description,
        orderIndex: lesson.orderIndex,
        isFreePreview: lesson.isFreePreview,
        watchedAt: lesson.lessonProgress?.[0]?.watchedAt.toISOString() ?? null,
        videoUrl:
          lesson.isFreePreview || includeLockedVideoUrls ? lesson.videoUrl : undefined,
      })),
    })),
  }
}

function serializeLessonDetail(
  lesson: NonNullable<
    Awaited<ReturnType<typeof getPublishedCourseBySlug>>
  >['sections'][number]['lessons'][number],
) {
  return {
    id: lesson.id,
    sectionId: lesson.sectionId,
    title: lesson.title,
    description: lesson.description,
    orderIndex: lesson.orderIndex,
    isFreePreview: lesson.isFreePreview,
    watchedAt: lesson.lessonProgress?.[0]?.watchedAt.toISOString() ?? null,
    videoUrl: lesson.videoUrl,
  }
}

async function getEnrollment(studentId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
  })
}

coursesRouter.get('/', async (_req, res) => {
  const courses = await prisma.course.findMany({
    where: {
      status: 'PUBLISHED',
    },
    include: {
      sections: {
        include: {
          lessons: {
            select: {
              id: true,
              isFreePreview: true,
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
    courses: courses.map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      price: Number(course.price),
      lessonsCount: course.sections.reduce(
        (count, section) => count + section.lessons.length,
        0,
      ),
      freePreviewLessonsCount: course.sections.reduce(
        (count, section) =>
          count + section.lessons.filter((lesson) => lesson.isFreePreview).length,
        0,
      ),
      createdAt: course.createdAt.toISOString(),
    })),
  })
})

coursesRouter.get('/:slug/lessons/:id', async (req, res) => {
  const { slug, id } = req.params
  const currentUser = resolveRequestUser(req)
  const course = await getPublishedCourseBySlug(slug, currentUser?.id)

  if (!course) {
    return res.status(404).json({
      code: 'COURSE_NOT_FOUND',
      message: 'Course not found or not published',
    })
  }

  const lesson = course.sections
    .flatMap((section) => section.lessons)
    .find((entry) => entry.id === id)

  if (!lesson) {
    return res.status(404).json({
      code: 'LESSON_NOT_FOUND',
      message: 'Lesson not found',
    })
  }

  const enrollment = currentUser ? await getEnrollment(currentUser.id, course.id) : null

  if (!lesson.isFreePreview && !currentUser) {
    return res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    })
  }

  if (!lesson.isFreePreview && !enrollment) {
    return res.status(403).json({
      code: 'ENROLLMENT_REQUIRED',
      message: 'Enrollment required to access this lesson',
    })
  }

  return res.status(200).json({
    course: serializeCourseDetail(course, {
      includeLockedVideoUrls: Boolean(enrollment),
    }),
    lesson: serializeLessonDetail(lesson),
    enrollment: {
      enrolled: Boolean(enrollment),
      enrollmentId: enrollment?.id ?? null,
    },
  })
})

coursesRouter.get('/:slug', async (req, res) => {
  const { slug } = req.params
  const currentUser = resolveRequestUser(req)
  const course = await getPublishedCourseBySlug(slug, currentUser?.id)

  if (!course) {
    return res.status(404).json({
      code: 'COURSE_NOT_FOUND',
      message: 'Course not found or not published',
    })
  }

  const enrollment = currentUser ? await getEnrollment(currentUser.id, course.id) : null

  return res.status(200).json({
    course: serializeCourseDetail(course, {
      includeLockedVideoUrls: Boolean(enrollment),
    }),
    enrollment: {
      enrolled: Boolean(enrollment),
      enrollmentId: enrollment?.id ?? null,
    },
  })
})

lessonsRouter.post('/:id/progress', requireAuth, async (req, res) => {
  const { id } = req.params
  const studentId = req.user!.id

  if (typeof id !== 'string') {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Lesson id is invalid',
    })
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id,
    },
    include: {
      section: {
        select: {
          courseId: true,
        },
      },
    },
  })

  if (!lesson) {
    return res.status(404).json({
      code: 'LESSON_NOT_FOUND',
      message: 'Lesson not found',
    })
  }

  const enrollment = await getEnrollment(studentId, lesson.section.courseId)

  if (!enrollment) {
    return res.status(403).json({
      code: 'ENROLLMENT_REQUIRED',
      message: 'Enrollment required to access this lesson',
    })
  }

  const progress = await prisma.lessonProgress.upsert({
    where: {
      studentId_lessonId: {
        studentId,
        lessonId: id,
      },
    },
    update: {
      watchedAt: new Date(),
    },
    create: {
      studentId,
      lessonId: id,
    },
  })

  return res.status(200).json({
    progress: {
      lessonId: id,
      watchedAt: progress.watchedAt.toISOString(),
    },
  })
})

export { coursesRouter, lessonsRouter }
