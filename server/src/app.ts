import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173'
    })
  )
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'server' })
  })

  return app
}
