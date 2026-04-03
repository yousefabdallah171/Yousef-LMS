import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'

const commentsRouter = Router()
const adminCommentsRouter = Router()
const adminCommentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Comment content cannot be empty')
    .max(1000, 'Comment content must be 1000 characters or fewer'),
})

async function getPublishedLesson(lessonId: string) {
  return prisma.lesson.findFirst({
    where: {
      id: lessonId,
      section: {
        course: {
          status: 'PUBLISHED',
        },
      },
    },
    include: {
      section: {
        select: {
          courseId: true,
        },
      },
    },
  })
}

function serializeComment(comment: {
  id: string
  content: string
  createdAt: Date
  student: {
    name: string
  }
}) {
  return {
    id: comment.id,
    authorName: comment.student.name,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
  }
}

commentsRouter.get('/:id/comments', async (req, res) => {
  const lessonId = typeof req.params.id === 'string' ? req.params.id : ''

  const lesson = await getPublishedLesson(lessonId)

  if (!lesson) {
    return res.status(404).json({
      code: 'LESSON_NOT_FOUND',
      message: 'Lesson not found',
    })
  }

  const comments = await prisma.comment.findMany({
    where: {
      lessonId,
      deletedAt: null,
    },
    include: {
      student: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return res.status(200).json({
    comments: comments.map(serializeComment),
  })
})

commentsRouter.post('/:id/comments', requireAuth, async (req, res) => {
  const lessonId = typeof req.params.id === 'string' ? req.params.id : ''
  const studentId = req.user!.id
  const parsed = createCommentSchema.safeParse(req.body)

  if (!parsed.success) {
    const isEmptyComment = parsed.error.issues.some(
      (issue) => issue.code === 'too_small' && issue.path[0] === 'content',
    )

    return res.status(422).json({
      code: isEmptyComment ? 'EMPTY_CONTENT' : 'VALIDATION_ERROR',
      message: isEmptyComment
        ? 'Comment content cannot be empty'
        : 'Request validation failed',
      details: isEmptyComment
        ? undefined
        : {
            fields: Object.fromEntries(
              parsed.error.issues.map((issue) => [issue.path.join('.') || 'root', issue.message]),
            ),
          },
    })
  }

  const lesson = await getPublishedLesson(lessonId)

  if (!lesson) {
    return res.status(404).json({
      code: 'LESSON_NOT_FOUND',
      message: 'Lesson not found',
    })
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: lesson.section.courseId,
      },
    },
  })

  if (!enrollment) {
    return res.status(403).json({
      code: 'ENROLLMENT_REQUIRED',
      message: 'Enrollment is required to comment on this lesson',
    })
  }

  const comment = await prisma.comment.create({
    data: {
      lessonId,
      studentId,
      content: parsed.data.content.trim(),
    },
    include: {
      student: {
        select: {
          name: true,
        },
      },
    },
  })

  return res.status(201).json({
    comment: serializeComment(comment),
  })
})

adminCommentsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const commentId = typeof req.params.id === 'string' ? req.params.id : ''
  const adminId = req.user!.id

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      deletedAt: null,
    },
  })

  if (!comment) {
    return res.status(404).json({
      code: 'COMMENT_NOT_FOUND',
      message: 'Comment not found',
    })
  }

  await prisma.$transaction([
    prisma.comment.update({
      where: { id: comment.id },
      data: {
        deletedAt: new Date(),
      },
    }),
    prisma.auditLog.create({
      data: {
        adminId,
        actionType: 'DELETE_COMMENT',
        targetEntity: 'comment',
        targetId: comment.id,
        details: {
          lessonId: comment.lessonId,
          studentId: comment.studentId,
        },
      },
    }),
  ])

  return res.status(200).json({
    message: 'Comment deleted',
  })
})

adminCommentsRouter.get('/', requireAuth, requireAdmin, async (req, res) => {
  const { page, limit } = adminCommentsQuerySchema.parse({
    page: typeof req.query.page === 'string' ? req.query.page : undefined,
    limit: typeof req.query.limit === 'string' ? req.query.limit : undefined,
  })

  const where = {
    deletedAt: null,
  } as const

  const [total, comments] = await Promise.all([
    prisma.comment.count({ where }),
    prisma.comment.findMany({
      where,
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        lesson: {
          select: {
            title: true,
            section: {
              select: {
                course: {
                  select: {
                    title: true,
                    slug: true,
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
      skip: (page - 1) * limit,
      take: limit,
    }),
  ])

  return res.status(200).json({
    comments: comments.map((comment) => ({
      id: comment.id,
      studentName: comment.student.name,
      studentEmail: comment.student.email,
      courseTitle: comment.lesson.section.course.title,
      courseSlug: comment.lesson.section.course.slug,
      lessonTitle: comment.lesson.title,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  })
})

export { commentsRouter, adminCommentsRouter }
