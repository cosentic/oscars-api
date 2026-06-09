import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getPagination, paginatedResponse, parseIds } from '@/lib/pagination'
import { isAuthorized, unauthorizedResponse } from '@/lib/auth'
import { checkRateLimit } from '@/lib/ratelimit'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const { page, limit, from, to } = getPagination(searchParams)
  const ids = parseIds(searchParams.get('ids'))

const rateLimit = await checkRateLimit(request, 'read')
if (!rateLimit.success) {
  return NextResponse.json(
    { error: 'Too many requests. Please slow down.' },
    { status: 429, headers: rateLimit.headers }
  )
}

  let query = supabase
    .from('movies')
    .select('*', { count: 'exact' })

  const title = searchParams.get('title')
  const tmdb_id = searchParams.get('tmdb_id')
  const imdb_id = searchParams.get('imdb_id')
  const genre = searchParams.get('genre')

  if (ids) query = query.in('id', ids)
  if (title) query = query.ilike('title', `%${title}%`)
  if (tmdb_id) query = query.eq('tmdb_id', parseInt(tmdb_id))
  if (imdb_id) query = query.eq('imdb_id', imdb_id)
  if (genre) query = query.contains('genres', [genre])

  query = query.order('title', { ascending: true }).range(from, to)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(paginatedResponse(data, count ?? 0, page, limit))
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorizedResponse()

  const body = await request.json()

  const { data, error } = await supabase
    .from('movies')
    .insert(body)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}