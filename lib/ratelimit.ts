import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Per-IP limits. Analytics is off: it costs extra Redis commands on every
// request, and Upstash's free tier caps total commands per month.
// ephemeralCache remembers IPs that are already over the limit in memory, so
// repeat offenders are rejected without another Redis call.
const blocked = new Map<string, number>()

export const readRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '60s'),
  analytics: false,
  ephemeralCache: blocked,
  prefix: 'rl:read',
})

export const writeRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '60s'),
  analytics: false,
  ephemeralCache: blocked,
  prefix: 'rl:write',
})

/** Client IP as set by Vercel (first entry of x-forwarded-for). */
function clientIp(request: Request) {
  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    '127.0.0.1'
  )
}

export async function checkRateLimit(
  request: Request,
  type: 'read' | 'write' = 'read'
) {
  const limiter = type === 'write' ? writeRateLimit : readRateLimit
  try {
    const { success, limit, remaining, reset } = await limiter.limit(clientIp(request))
    return {
      success,
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(reset),
      } as Record<string, string>,
    }
  } catch (e) {
    // Redis unreachable or out of quota: refuse quickly rather than crash,
    // so the API never runs unmetered.
    console.warn('[ratelimit] limiter unavailable:', e instanceof Error ? e.message : e)
    return { success: false, status: 503, headers: { 'Retry-After': '60' } as Record<string, string> }
  }
}

/**
 * Cache successful GET responses at Vercel's CDN. Identical requests within a
 * day are served from cache without running the function or touching Redis.
 * The Oscar data changes rarely, so this is safe.
 */
export const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
}
