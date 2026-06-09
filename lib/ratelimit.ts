import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const readRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '60s'),
  analytics: true,
})

export const writeRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '60s'),
  analytics: true,
})

export async function checkRateLimit(
  request: Request,
  type: 'read' | 'write' = 'read'
) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const limiter = type === 'write' ? writeRateLimit : readRateLimit
  const { success, limit, remaining, reset } = await limiter.limit(ip)

  return {
    success,
    headers: {
      'X-RateLimit-Limit': String(limit),
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(reset),
    }
  }
}