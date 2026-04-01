import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const Redis = require('ioredis') as typeof import('ioredis').default

type RedisClient = import('ioredis').Redis

const globalForRedis = globalThis as typeof globalThis & {
  redis?: RedisClient
}

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis
}
