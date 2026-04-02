import { Router } from 'express'

import { authRouter } from './auth.js'
import { coursesRouter } from './courses.js'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'server' })
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/courses', coursesRouter)
