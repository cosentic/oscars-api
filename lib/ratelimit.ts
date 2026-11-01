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
    // Redis unreachable or out of quota: fall back to a rough per-instance
    // in-memory limit so real users still get data. (Abusive clients are
    // blocked earlier by the Vercel Firewall.)
    console.warn('[ratelimit] limiter unavailable, using memory fallback:', e instanceof Error ? e.message : e)
    const max = type === 'write' ? 20 : 30
    const ok = memoryLimit(`${type}:${clientIp(request)}`, max)
    return { success: ok, status: 429, headers: { 'Retry-After': '60' } as Record<string, string> }
  }
}

// Fixed 60-second window per key, kept in this function instance's memory.
const windows = new Map<string, { start: number; count: number }>()
function memoryLimit(key: string, max: number) {
  const now = Date.now()
  const w = windows.get(key)
  if (!w || now - w.start > 60_000) {
    if (windows.size > 10_000) windows.clear()
    windows.set(key, { start: now, count: 1 })
    return true
  }
  w.count++
  return w.count <= max
}

/**
 * Cache successful GET responses at Vercel's CDN. Identical requests within a
 * day are served from cache without running the function or touching Redis.
 * The Oscar data changes rarely, so this is safe.
 */
export const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
}
