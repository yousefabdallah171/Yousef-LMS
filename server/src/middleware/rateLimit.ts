import rateLimit from 'express-rate-limit'

export const authRateLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS ?? 60_000),
  max: Number(process.env.AUTH_RATE_LIMIT_MAX ?? 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 'RATE_LIMITED',
    message: 'Too many authentication attempts. Please try again later.',
    details: {
      retryAfterSeconds: 60,
    },
  },
})
