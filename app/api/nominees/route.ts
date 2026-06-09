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
    .from('nominees')
    .select('*', { count: 'exact' })

  const name = searchParams.get('name')
  const tmdb_person_id = searchParams.get('tmdb_person_id')
  const imdb_id = searchParams.get('imdb_id')
  const known_for_department = searchParams.get('known_for_department')

  if (ids) query = query.in('id', ids)
  if (name) query = query.ilike('name', `%${name}%`)
  if (tmdb_person_id) query = query.eq('tmdb_person_id', parseInt(tmdb_person_id))
  if (imdb_id) query = query.eq('imdb_id', imdb_id)
  if (known_for_department) query = query.ilike('known_for_department', `%${known_for_department}%`)

  query = query.order('name', { ascending: true }).range(from, to)

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
    .from('nominees')
    .insert(body)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}