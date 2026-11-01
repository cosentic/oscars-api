import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimitResponse, CACHE_HEADERS } from '@/lib/ratelimit'

export async function GET(request: NextRequest) {
  const limited = await rateLimitResponse(request, 'read')
  if (limited) return limited

  const searchParams = request.nextUrl.searchParams

  const genre = searchParams.get('genre')
  const yearStart = searchParams.get('yearStart')
  const yearEnd = searchParams.get('yearEnd')
  const sort = searchParams.get('sort') || 'wins'
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '100')))

  const { data, error } = await supabase.rpc('top_movies', {
    p_genre: genre ?? null,
    p_year_start: yearStart ? parseInt(yearStart) : null,
    p_year_end: yearEnd ? parseInt(yearEnd) : null,
    p_sort: sort,
    p_limit: limit,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count: data.length }, { headers: CACHE_HEADERS })
}