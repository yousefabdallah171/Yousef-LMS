import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import pino from 'pino'

import { authRateLimiter } from './middleware/rateLimit.js'
import { apiRouter } from './routes/index.js'
import { resolveLocalProofPath, verifyLocalProofAccess } from './storage/r2.js'

dotenv.config()

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

export function createApp() {
  const app = express()
  const logger = pino()

  const handleLocalProofRequest: express.RequestHandler = (req, res) => {
    const proofPath = typeof req.query.path === 'string' ? req.query.path : ''
    const expiresAt = typeof req.query.exp === 'string' ? req.query.exp : ''
    const signature = typeof req.query.sig === 'string' ? req.query.sig : ''

    if (!verifyLocalProofAccess(proofPath, expiresAt, signature)) {
      return res.status(403).json({
        code: 'PROOF_ACCESS_DENIED',
        message: 'Proof URL is invalid or expired',
      })
    }

    const resolvedPath = resolveLocalProofPath(proofPath)

    if (!resolvedPath) {
      return res.status(404).json({
        code: 'PROOF_NOT_FOUND',
        message: 'Proof file not found',
      })
    }

    return res.sendFile(resolvedPath, (error) => {
      if (!error) {
        return
      }

      if ('statusCode' in error && error.statusCode === 404) {
        res.status(404).json({
          code: 'PROOF_NOT_FOUND',
          message: 'Proof file not found',
        })
        return
      }

      res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      })
    })
  }

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

  app.get(['/uploads/local', '/uploads/local/:filename'], handleLocalProofRequest)

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
