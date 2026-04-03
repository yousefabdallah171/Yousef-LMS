import { Router } from 'express'

import { authRouter } from './auth.js'
import { adminCommentsRouter, commentsRouter } from './comments.js'
import {
  adminCoursesRouter,
  adminLessonsRouter,
  adminSectionsRouter,
  coursesRouter,
  lessonsRouter,
} from './courses.js'
import { enrollmentsRouter } from './enrollments.js'
import { adminOrdersRouter, ordersRouter } from './orders.js'
import { adminStudentsRouter } from './students.js'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'server' })
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/courses', coursesRouter)
apiRouter.use('/lessons', lessonsRouter)
apiRouter.use('/lessons', commentsRouter)
apiRouter.use('/enrollments', enrollmentsRouter)
apiRouter.use('/orders', ordersRouter)
apiRouter.use('/admin/courses', adminCoursesRouter)
apiRouter.use('/admin/sections', adminSectionsRouter)
apiRouter.use('/admin/lessons', adminLessonsRouter)
apiRouter.use('/admin/orders', adminOrdersRouter)
apiRouter.use('/admin/comments', adminCommentsRouter)
apiRouter.use('/admin/students', adminStudentsRouter)
