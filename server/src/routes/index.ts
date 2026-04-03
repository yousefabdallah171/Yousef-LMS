import { Router } from 'express'

import { authRouter } from './auth.js'
import { coursesRouter, lessonsRouter } from './courses.js'
import { enrollmentsRouter } from './enrollments.js'
import { adminOrdersRouter, ordersRouter } from './orders.js'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'server' })
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/courses', coursesRouter)
apiRouter.use('/lessons', lessonsRouter)
apiRouter.use('/enrollments', enrollmentsRouter)
apiRouter.use('/orders', ordersRouter)
apiRouter.use('/admin/orders', adminOrdersRouter)
