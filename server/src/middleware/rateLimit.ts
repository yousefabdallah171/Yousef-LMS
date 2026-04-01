import rateLimit from 'express-rate-limit'

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
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
