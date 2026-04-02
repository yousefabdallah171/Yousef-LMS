import { Router } from 'express'

import { authRouter } from './auth.js'
import { coursesRouter } from './courses.js'
import { adminOrdersRouter, ordersRouter } from './orders.js'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'server' })
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/courses', coursesRouter)
apiRouter.use('/orders', ordersRouter)
apiRouter.use('/admin/orders', adminOrdersRouter)
