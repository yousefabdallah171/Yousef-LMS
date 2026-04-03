import { CourseStatus, Prisma } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma.js'
import { requireAdmin, requireAuth, resolveRequestUser } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { logAdminAction } from '../utils/auditLog.js'

const coursesRouter = Router()
const lessonsRouter = Router()
const adminCoursesRouter = Router()
const adminSectionsRouter = Router()
const adminLessonsRouter = Router()

const adminCoursesQuerySchema = z.object({
  status: z.enum(['draft', 'published']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

const courseCreateSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1),
  thumbnailUrl: z.string().url(),
  price: z.number().nonnegative(),
})

const courseUpdateSchema = courseCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: 'At least one field is required',
  },
)

const sectionCreateSchema = z.object({
  title: z.string().trim().min(1).max(255),
  orderIndex: z.number().int().positive(),
})

const lessonCreateSchema = z.object({
  title: z.string().trim().min(1).max(255),
  videoUrl: z.string().url(),
  description: z.string().trim().optional(),
})

const lessonUpdateSchema = lessonCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: 'At least one field is required',
  },
)

type CourseWithSections = Awaited<ReturnType<typeof getCourseBySlug>>
type CourseWithSectionsForAdmin = Awaited<ReturnType<typeof getAdminCourseById>>
type TransactionClient = Prisma.TransactionClient

function serializeCourseStatus(status: CourseStatus) {
  return status.toLowerCase() as 'draft' | 'published'
}

function slugifyTitle(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')

  return slug || 'course'
}

async function generateUniqueCourseSlug(title: string, courseId?: string) {
  const baseSlug = slugifyTitle(title)
  let candidate = baseSlug
  let attempt = 2

  while (true) {
    const existing = await prisma.course.findFirst({
      where: {
        slug: candidate,
        ...(courseId ? { id: { not: courseId } } : {}),
      },
      select: {
        id: true,
      },
    })

    if (!existing) {
      return candidate
    }

    candidate = `${baseSlug}-${attempt}`
    attempt += 1
  }
}

async function getCourseBySlug(slug: string, studentId?: string) {
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

async function getAdminCourseById(id: string) {
  return prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      enrollments: {
        select: {
          id: true,
        },
      },
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
  course: CourseWithSections,
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

function serializeAdminCourseDetail(course: CourseWithSectionsForAdmin) {
  if (!course) {
    return null
  }

  const lessonsCount = course.sections.reduce(
    (count, section) => count + section.lessons.length,
    0,
  )

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    price: Number(course.price),
    status: serializeCourseStatus(course.status),
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    sectionsCount: course.sections.length,
    lessonsCount,
    enrollmentsCount: course.enrollments.length,
    sections: course.sections.map((section) => ({
      id: section.id,
      courseId: section.courseId,
      title: section.title,
      orderIndex: section.orderIndex,
      createdAt: section.createdAt.toISOString(),
      lessons: section.lessons.map((lesson) => ({
        id: lesson.id,
        sectionId: lesson.sectionId,
        title: lesson.title,
        videoUrl: lesson.videoUrl,
        description: lesson.description,
        orderIndex: lesson.orderIndex,
        isFreePreview: lesson.isFreePreview,
        createdAt: lesson.createdAt.toISOString(),
      })),
    })),
  }
}

function serializeLessonDetail(
  lesson: NonNullable<CourseWithSections>['sections'][number]['lessons'][number],
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

async function rebalanceCourseLessons(courseId: string, tx: TransactionClient) {
  const sections = await tx.section.findMany({
    where: {
      courseId,
    },
    orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      lessons: {
        orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
        select: {
          id: true,
        },
      },
    },
  })

  let lessonPosition = 0

  await Promise.all(
    sections.flatMap((section) =>
      section.lessons.map((lesson, lessonIndex) => {
        lessonPosition += 1

        return tx.lesson.update({
          where: {
            id: lesson.id,
          },
          data: {
            orderIndex: lessonIndex + 1,
            isFreePreview: lessonPosition <= 5,
          },
        })
      }),
    ),
  )
}

function extractFieldErrors(error: z.ZodError) {
  return Object.fromEntries(
    error.issues.map((issue) => [issue.path.join('.') || 'root', issue.message]),
  )
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
  const course = await getCourseBySlug(slug, currentUser?.id)

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
  const course = await getCourseBySlug(slug, currentUser?.id)

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

adminCoursesRouter.get('/', requireAuth, requireAdmin, async (req, res) => {
  const parsed = adminCoursesQuerySchema.parse({
    status: typeof req.query.status === 'string' ? req.query.status : undefined,
    page: typeof req.query.page === 'string' ? req.query.page : undefined,
    limit: typeof req.query.limit === 'string' ? req.query.limit : undefined,
  })

  const where = parsed.status
    ? {
        status: parsed.status.toUpperCase() as CourseStatus,
      }
    : {}

  const [courses, total, grouped] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        sections: {
          include: {
            lessons: {
              select: {
                id: true,
              },
            },
          },
        },
        enrollments: {
          select: {
            id: true,
          },
        },
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      skip: (parsed.page - 1) * parsed.limit,
      take: parsed.limit,
    }),
    prisma.course.count({ where }),
    prisma.course.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    }),
  ])

  const summary = grouped.reduce(
    (accumulator, entry) => {
      accumulator.total += entry._count._all

      if (entry.status === 'PUBLISHED') {
        accumulator.published = entry._count._all
      } else {
        accumulator.draft = entry._count._all
      }

      return accumulator
    },
    {
      total: 0,
      published: 0,
      draft: 0,
    },
  )

  return res.status(200).json({
    courses: courses.map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      price: Number(course.price),
      status: serializeCourseStatus(course.status),
      sectionsCount: course.sections.length,
      lessonsCount: course.sections.reduce(
        (count, section) => count + section.lessons.length,
        0,
      ),
      enrollmentsCount: course.enrollments.length,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    })),
    summary,
    pagination: {
      page: parsed.page,
      limit: parsed.limit,
      total,
      pages: Math.max(1, Math.ceil(total / parsed.limit)),
    },
  })
})

adminCoursesRouter.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  const courseId = typeof req.params.id === 'string' ? req.params.id : ''
  const course = await getAdminCourseById(courseId)

  if (!course) {
    return res.status(404).json({
      code: 'COURSE_NOT_FOUND',
      message: 'Course not found',
    })
  }

  return res.status(200).json({
    course: serializeAdminCourseDetail(course),
  })
})

adminCoursesRouter.post(
  '/',
  requireAuth,
  requireAdmin,
  validate(courseCreateSchema),
  async (req, res) => {
    const adminId = req.user!.id
    const data = req.body as z.infer<typeof courseCreateSchema>
    const slug = await generateUniqueCourseSlug(data.title)

    const course = await prisma.course.create({
      data: {
        slug,
        title: data.title.trim(),
        description: data.description.trim(),
        thumbnailUrl: data.thumbnailUrl.trim(),
        price: new Prisma.Decimal(data.price),
        status: 'DRAFT',
      },
      include: {
        enrollments: {
          select: {
            id: true,
          },
        },
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

    await logAdminAction(adminId, 'COURSE_CREATE', 'course', course.id, {
      title: course.title,
      slug: course.slug,
    })

    return res.status(201).json({
      course: serializeAdminCourseDetail(course),
    })
  },
)

adminCoursesRouter.put(
  '/:id',
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const parsed = courseUpdateSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(422).json({
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: {
          fields: extractFieldErrors(parsed.error),
        },
      })
    }

    const existing = await prisma.course.findUnique({
      where: {
        id: typeof req.params.id === 'string' ? req.params.id : '',
      },
    })

    if (!existing) {
      return res.status(404).json({
        code: 'COURSE_NOT_FOUND',
        message: 'Course not found',
      })
    }

    const nextTitle = parsed.data.title?.trim() ?? existing.title
    const slug =
      nextTitle !== existing.title
        ? await generateUniqueCourseSlug(nextTitle, existing.id)
        : existing.slug

    const course = await prisma.course.update({
      where: {
        id: existing.id,
      },
      data: {
        ...(parsed.data.title ? { title: nextTitle, slug } : {}),
        ...(parsed.data.description
          ? { description: parsed.data.description.trim() }
          : {}),
        ...(parsed.data.thumbnailUrl
          ? { thumbnailUrl: parsed.data.thumbnailUrl.trim() }
          : {}),
        ...(typeof parsed.data.price === 'number'
          ? { price: new Prisma.Decimal(parsed.data.price) }
          : {}),
      },
      include: {
        enrollments: {
          select: {
            id: true,
          },
        },
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

    await logAdminAction(req.user!.id, 'COURSE_UPDATE', 'course', course.id, {
      fields: Object.keys(parsed.data),
    })

    return res.status(200).json({
      course: serializeAdminCourseDetail(course),
    })
  },
)

adminCoursesRouter.post('/:id/publish', requireAuth, requireAdmin, async (req, res) => {
  const course = await prisma.course.findUnique({
    where: {
      id: typeof req.params.id === 'string' ? req.params.id : '',
    },
  })

  if (!course) {
    return res.status(404).json({
      code: 'COURSE_NOT_FOUND',
      message: 'Course not found',
    })
  }

  const updatedCourse = await prisma.course.update({
    where: {
      id: course.id,
    },
    data: {
      status: 'PUBLISHED',
    },
  })

  await logAdminAction(req.user!.id, 'COURSE_PUBLISH', 'course', updatedCourse.id)

  return res.status(200).json({
    course: {
      id: updatedCourse.id,
      status: 'published',
    },
  })
})

adminCoursesRouter.post('/:id/unpublish', requireAuth, requireAdmin, async (req, res) => {
  const course = await prisma.course.findUnique({
    where: {
      id: typeof req.params.id === 'string' ? req.params.id : '',
    },
  })

  if (!course) {
    return res.status(404).json({
      code: 'COURSE_NOT_FOUND',
      message: 'Course not found',
    })
  }

  const updatedCourse = await prisma.course.update({
    where: {
      id: course.id,
    },
    data: {
      status: 'DRAFT',
    },
  })

  await logAdminAction(req.user!.id, 'COURSE_UNPUBLISH', 'course', updatedCourse.id)

  return res.status(200).json({
    course: {
      id: updatedCourse.id,
      status: 'draft',
    },
  })
})

adminCoursesRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const course = await prisma.course.findUnique({
    where: {
      id: typeof req.params.id === 'string' ? req.params.id : '',
    },
    include: {
      enrollments: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!course) {
    return res.status(404).json({
      code: 'COURSE_NOT_FOUND',
      message: 'Course not found',
    })
  }

  const enrollmentCount = course.enrollments.length

  if (enrollmentCount > 0) {
    return res.status(409).json({
      code: 'COURSE_HAS_ENROLLMENTS',
      message: `Course has ${enrollmentCount} active enrollments. Unpublish instead?`,
      details: {
        enrollmentCount,
      },
    })
  }

  await prisma.course.delete({
    where: {
      id: course.id,
    },
  })

  await logAdminAction(req.user!.id, 'COURSE_DELETE', 'course', course.id, {
    title: course.title,
  })

  return res.status(200).json({
    message: 'Course deleted',
  })
})

adminCoursesRouter.post(
  '/:courseId/sections',
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const parsed = sectionCreateSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(422).json({
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: {
          fields: extractFieldErrors(parsed.error),
        },
      })
    }

    const course = await prisma.course.findUnique({
      where: {
        id: typeof req.params.courseId === 'string' ? req.params.courseId : '',
      },
    })

    if (!course) {
      return res.status(404).json({
        code: 'COURSE_NOT_FOUND',
        message: 'Course not found',
      })
    }

    try {
      const section = await prisma.section.create({
        data: {
          courseId: course.id,
          title: parsed.data.title.trim(),
          orderIndex: parsed.data.orderIndex,
        },
      })

      await logAdminAction(req.user!.id, 'SECTION_CREATE', 'section', section.id, {
        courseId: course.id,
        orderIndex: section.orderIndex,
      })

      return res.status(201).json({
        section: {
          id: section.id,
          courseId: section.courseId,
          title: section.title,
          orderIndex: section.orderIndex,
          createdAt: section.createdAt.toISOString(),
        },
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return res.status(409).json({
          code: 'VALIDATION_ERROR',
          message: 'Section order already exists for this course',
          details: {
            fields: {
              orderIndex: 'Section order must be unique within the course',
            },
          },
        })
      }

      throw error
    }
  },
)

adminSectionsRouter.post(
  '/:sectionId/lessons',
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const parsed = lessonCreateSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(422).json({
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: {
          fields: extractFieldErrors(parsed.error),
        },
      })
    }

    const section = await prisma.section.findUnique({
      where: {
        id: typeof req.params.sectionId === 'string' ? req.params.sectionId : '',
      },
      include: {
        course: true,
      },
    })

    if (!section) {
      return res.status(404).json({
        code: 'COURSE_NOT_FOUND',
        message: 'Section not found',
      })
    }

    const lesson = await prisma.$transaction(async (tx) => {
      const lastLesson = await tx.lesson.findFirst({
        where: {
          sectionId: section.id,
        },
        orderBy: {
          orderIndex: 'desc',
        },
      })

      const nextOrderIndex = (lastLesson?.orderIndex ?? 0) + 1

      const createdLesson = await tx.lesson.create({
        data: {
          sectionId: section.id,
          title: parsed.data.title.trim(),
          videoUrl: parsed.data.videoUrl.trim(),
          description: parsed.data.description?.trim() || null,
          orderIndex: nextOrderIndex,
          isFreePreview: false,
        },
      })

      await rebalanceCourseLessons(section.courseId, tx)

      return tx.lesson.findUniqueOrThrow({
        where: {
          id: createdLesson.id,
        },
      })
    })

    await logAdminAction(req.user!.id, 'LESSON_CREATE', 'lesson', lesson.id, {
      courseId: section.courseId,
      sectionId: section.id,
      orderIndex: lesson.orderIndex,
    })

    return res.status(201).json({
      lesson: {
        id: lesson.id,
        sectionId: lesson.sectionId,
        title: lesson.title,
        videoUrl: lesson.videoUrl,
        description: lesson.description,
        orderIndex: lesson.orderIndex,
        isFreePreview: lesson.isFreePreview,
        createdAt: lesson.createdAt.toISOString(),
      },
    })
  },
)

adminLessonsRouter.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const parsed = lessonUpdateSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(422).json({
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: {
        fields: extractFieldErrors(parsed.error),
      },
    })
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: typeof req.params.id === 'string' ? req.params.id : '',
    },
  })

  if (!lesson) {
    return res.status(404).json({
      code: 'LESSON_NOT_FOUND',
      message: 'Lesson not found',
    })
  }

  const updatedLesson = await prisma.lesson.update({
    where: {
      id: lesson.id,
    },
    data: {
      ...(parsed.data.title ? { title: parsed.data.title.trim() } : {}),
      ...(parsed.data.videoUrl ? { videoUrl: parsed.data.videoUrl.trim() } : {}),
      ...(parsed.data.description !== undefined
        ? { description: parsed.data.description?.trim() || null }
        : {}),
    },
  })

  await logAdminAction(req.user!.id, 'LESSON_UPDATE', 'lesson', updatedLesson.id, {
    fields: Object.keys(parsed.data),
  })

  return res.status(200).json({
    lesson: {
      id: updatedLesson.id,
      sectionId: updatedLesson.sectionId,
      title: updatedLesson.title,
      videoUrl: updatedLesson.videoUrl,
      description: updatedLesson.description,
      orderIndex: updatedLesson.orderIndex,
      isFreePreview: updatedLesson.isFreePreview,
      createdAt: updatedLesson.createdAt.toISOString(),
    },
  })
})

adminLessonsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: typeof req.params.id === 'string' ? req.params.id : '',
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

  const lessonCount = await prisma.lesson.count({
    where: {
      section: {
        courseId: lesson.section.courseId,
      },
    },
  })

  if (lessonCount <= 1) {
    return res.status(409).json({
      code: 'CANNOT_DELETE_ONLY_LESSON',
      message: 'A course must keep at least one lesson',
    })
  }

  await prisma.$transaction(async (tx) => {
    await tx.lesson.delete({
      where: {
        id: lesson.id,
      },
    })

    await rebalanceCourseLessons(lesson.section.courseId, tx)
  })

  await logAdminAction(req.user!.id, 'LESSON_DELETE', 'lesson', lesson.id, {
    courseId: lesson.section.courseId,
  })

  return res.status(200).json({
    message: 'Lesson deleted',
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

export {
  adminCoursesRouter,
  adminLessonsRouter,
  adminSectionsRouter,
  coursesRouter,
  lessonsRouter,
}
