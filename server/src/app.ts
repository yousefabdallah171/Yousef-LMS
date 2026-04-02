import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import pino from 'pino'

import { authRateLimiter } from './middleware/rateLimit.js'
import { apiRouter } from './routes/index.js'

dotenv.config()

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

export function createApp() {
  const app = express()
  const logger = pino()

  app.use((req, res, next) => {
    logger.info({ method: req.method, url: req.originalUrl }, 'incoming request')
    next()
  })
  app.use(
    cors({
      origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
    })
  )
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  app.use('/api/v1/auth', authRateLimiter)
  app.use('/api/v1', apiRouter)

  app.use((
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(err)
    }

    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    })
  })

  return app
}
