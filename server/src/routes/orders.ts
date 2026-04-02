import { OrderStatus, Prisma } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { sendApprovalEmail, sendRejectionEmail } from '../email/emailService.js'
import { getSignedProofUrl } from '../storage/proofStorage.js'

const ordersRouter = Router()
const adminOrdersRouter = Router()
const reviewSchema = z.object({
  reason: z.string().trim().max(500).optional(),
})

const querySchema = z.object({
  status: z.enum(['pending_review', 'approved', 'rejected']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

function toApiStatus(status: OrderStatus) {
  return status.toLowerCase() as 'pending_review' | 'approved' | 'rejected'
}

async function serializeOrder(order: {
  id: string
  studentId: string
  courseId: string
  proofUrl: string
  rejectionReason: string | null
  createdAt: Date
  reviewedAt: Date | null
  reviewedBy: string | null
  status: OrderStatus
  student: { name: string; email: string }
  course: { title: string }
}) {
  return {
    id: order.id,
    studentId: order.studentId,
    studentName: order.student.name,
    studentEmail: order.student.email,
    courseId: order.courseId,
    courseName: order.course.title,
    status: toApiStatus(order.status),
    proofUrl: await getSignedProofUrl(order.proofUrl),
    rejectionReason: order.rejectionReason,
    createdAt: order.createdAt.toISOString(),
    reviewedAt: order.reviewedAt?.toISOString() ?? null,
    reviewedBy: order.reviewedBy,
  }
}

type AdminOrderRecord = Prisma.OrderGetPayload<{
  include: {
    student: {
      select: {
        name: true
        email: true
      }
    }
    course: {
      select: {
        title: true
        slug: true
      }
    }
  }
}>

type AdminOrderSummary = {
  total: number
  pending: number
  approved: number
  rejected: number
}

async function getAdminOrderSummary() {
  const groupedCounts = await prisma.order.groupBy({
    by: ['status'],
    _count: {
      _all: true,
    },
  })

  return groupedCounts.reduce<AdminOrderSummary>(
    (summary, entry) => {
      const count = entry._count._all

      if (entry.status === 'PENDING_REVIEW') {
        summary.pending = count
      } else if (entry.status === 'APPROVED') {
        summary.approved = count
      } else if (entry.status === 'REJECTED') {
        summary.rejected = count
      }

      summary.total += count
      return summary
    },
    {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
  )
}

ordersRouter.get('/my', requireAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: {
      studentId: req.user!.id,
    },
    include: {
      course: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return res.status(200).json({
    orders: orders.map((order) => ({
      id: order.id,
      courseId: order.courseId,
      courseName: order.course.title,
      status: toApiStatus(order.status),
      createdAt: order.createdAt.toISOString(),
      rejectionReason: order.rejectionReason,
      reviewedAt: order.reviewedAt?.toISOString() ?? null,
    })),
  })
})

adminOrdersRouter.get('/', requireAuth, requireAdmin, async (req, res) => {
  const { status, page, limit } = querySchema.parse({
    status: typeof req.query.status === 'string' ? req.query.status : undefined,
    page: typeof req.query.page === 'string' ? req.query.page : undefined,
    limit: typeof req.query.limit === 'string' ? req.query.limit : undefined,
  })
  const where = status
    ? {
        status: status.toUpperCase() as OrderStatus,
      }
    : {}

  const [total, orders, summary] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    getAdminOrderSummary(),
  ])

  return res.status(200).json({
    orders: await Promise.all((orders as AdminOrderRecord[]).map((order) => serializeOrder(order))),
    summary,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  })
})

adminOrdersRouter.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  const order = await prisma.order.findUnique({
    where: {
      id: typeof req.params.id === 'string' ? req.params.id : '',
    },
    include: {
      student: {
        select: {
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  })

  if (!order) {
    return res.status(404).json({
      code: 'ORDER_NOT_FOUND',
      message: 'Order not found',
    })
  }

  return res.status(200).json({
    order: await serializeOrder(order),
  })
})

adminOrdersRouter.post(
  '/:id/approve',
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const adminId = req.user!.id
    const orderId = typeof req.params.id === 'string' ? req.params.id : ''

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          student: true,
          course: true,
          enrollment: true,
        },
      })

      if (!order) {
        return { type: 'not_found' as const }
      }

      if (order.status === 'APPROVED') {
        return { type: 'already_approved' as const }
      }

      if (order.status !== 'PENDING_REVIEW') {
        return { type: 'already_reviewed' as const }
      }

      const existingEnrollment =
        order.enrollment ??
        (await tx.enrollment.findUnique({
          where: {
            studentId_courseId: {
              studentId: order.studentId,
              courseId: order.courseId,
            },
          },
        }))

      if (existingEnrollment && existingEnrollment.orderId !== order.id) {
        return {
          type: 'already_enrolled' as const,
          enrollment: existingEnrollment,
        }
      }

      const enrollment =
        existingEnrollment ??
        (await tx.enrollment.create({
          data: {
            studentId: order.studentId,
            courseId: order.courseId,
            orderId: order.id,
          },
        }))

      const reviewedAt = new Date()
      const updatedOrder = await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: 'APPROVED',
          rejectionReason: null,
          reviewedAt,
          reviewedBy: adminId,
        },
      })

      await tx.auditLog.create({
        data: {
          adminId,
          actionType: 'APPROVE_ORDER',
          targetEntity: 'order',
          targetId: order.id,
          details: {
            studentId: order.studentId,
            courseId: order.courseId,
          },
        },
      })

      return {
        type: 'approved' as const,
        order,
        updatedOrder,
        enrollment,
      }
    })

    if (result.type === 'not_found') {
      return res.status(404).json({
        code: 'ORDER_NOT_FOUND',
        message: 'Order was not found',
      })
    }

    if (result.type === 'already_approved') {
      return res.status(409).json({
        code: 'ALREADY_APPROVED',
        message: 'Order has already been approved',
      })
    }

    if (result.type === 'already_reviewed') {
      return res.status(409).json({
        code: 'ORDER_ALREADY_REVIEWED',
        message: 'Order has already been reviewed',
      })
    }

    if (result.type === 'already_enrolled') {
      return res.status(409).json({
        code: 'ORDER_ALREADY_ENROLLED',
        message: 'Student is already enrolled in this course',
        enrollment: {
          id: result.enrollment.id,
          courseId: result.enrollment.courseId,
          studentId: result.enrollment.studentId,
        },
      })
    }

    if (result.type !== 'approved') {
      throw new Error('Unexpected order approval state')
    }

    void sendApprovalEmail(
      {
        email: result.order.student.email,
        name: result.order.student.name,
      },
      {
        slug: result.order.course.slug,
        title: result.order.course.title,
      },
    ).catch((error) => {
      console.error('Failed to send approval email', error)
    })

    return res.status(200).json({
      order: {
        id: result.updatedOrder.id,
        status: 'approved',
        reviewedAt: result.updatedOrder.reviewedAt!.toISOString(),
      },
      enrollment: {
        id: result.enrollment.id,
        courseId: result.enrollment.courseId,
        studentId: result.enrollment.studentId,
      },
    })
  },
)

adminOrdersRouter.post(
  '/:id/reject',
  requireAuth,
  requireAdmin,
  validate(reviewSchema),
  async (req, res) => {
    const adminId = req.user!.id
    const { reason } = req.body as z.infer<typeof reviewSchema>
    const orderId = typeof req.params.id === 'string' ? req.params.id : ''

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          student: true,
          course: true,
        },
      })

      if (!order) {
        return { type: 'not_found' as const }
      }

      if (order.status === 'APPROVED') {
        return { type: 'already_approved' as const }
      }

      if (order.status === 'REJECTED') {
        return { type: 'already_reviewed' as const }
      }

      const reviewedAt = new Date()
      const updatedOrder = await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: 'REJECTED',
          rejectionReason: reason?.trim() || null,
          reviewedAt,
          reviewedBy: adminId,
        },
      })

      await tx.auditLog.create({
        data: {
          adminId,
          actionType: 'REJECT_ORDER',
          targetEntity: 'order',
          targetId: order.id,
          details: {
            studentId: order.studentId,
            courseId: order.courseId,
            reason: reason?.trim() || null,
          },
        },
      })

      return {
        type: 'rejected' as const,
        order,
        updatedOrder,
      }
    })

    if (result.type === 'not_found') {
      return res.status(404).json({
        code: 'ORDER_NOT_FOUND',
        message: 'Order was not found',
      })
    }

    if (result.type === 'already_approved') {
      return res.status(409).json({
        code: 'ALREADY_APPROVED',
        message: 'Order has already been approved',
      })
    }

    if (result.type === 'already_reviewed') {
      return res.status(409).json({
        code: 'ORDER_ALREADY_REVIEWED',
        message: 'Order has already been reviewed',
      })
    }

    if (result.type !== 'rejected') {
      throw new Error('Unexpected order rejection state')
    }

    void sendRejectionEmail(
      {
        email: result.order.student.email,
        name: result.order.student.name,
      },
      {
        slug: result.order.course.slug,
        title: result.order.course.title,
      },
      result.updatedOrder.rejectionReason,
    ).catch((error) => {
      console.error('Failed to send rejection email', error)
    })

    return res.status(200).json({
      order: {
        id: result.updatedOrder.id,
        status: 'rejected',
        rejectionReason: result.updatedOrder.rejectionReason,
        reviewedAt: result.updatedOrder.reviewedAt!.toISOString(),
      },
    })
  },
)

export { ordersRouter }
export { adminOrdersRouter }
