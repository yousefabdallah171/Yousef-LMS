import { Router } from 'express'

import { prisma } from '../lib/prisma.js'
import { resolveRequestUser } from '../middleware/auth.js'

const coursesRouter = Router()

function serializeCourseStatus(status: 'DRAFT' | 'PUBLISHED') {
  return status.toLowerCase() as 'draft' | 'published'
}

async function getPublishedCourseBySlug(slug: string) {
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
        videoUrl:
          lesson.isFreePreview || includeLockedVideoUrls ? lesson.videoUrl : undefined,
      })),
    })),
  }
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
  const course = await getPublishedCourseBySlug(slug)

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

  const enrollment = currentUser
    ? await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: currentUser.id,
            courseId: course.id,
          },
        },
      })
    : null

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
    lesson: {
      id: lesson.id,
      sectionId: lesson.sectionId,
      title: lesson.title,
      description: lesson.description,
      orderIndex: lesson.orderIndex,
      isFreePreview: lesson.isFreePreview,
      videoUrl: lesson.videoUrl,
    },
    enrollment: {
      enrolled: Boolean(enrollment),
      enrollmentId: enrollment?.id ?? null,
    },
  })
})

coursesRouter.get('/:slug', async (req, res) => {
  const { slug } = req.params
  const currentUser = resolveRequestUser(req)
  const course = await getPublishedCourseBySlug(slug)

  if (!course) {
    return res.status(404).json({
      code: 'COURSE_NOT_FOUND',
      message: 'Course not found or not published',
    })
  }

  const enrollment = currentUser
    ? await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: currentUser.id,
            courseId: course.id,
          },
        },
      })
    : null

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

export { coursesRouter }
