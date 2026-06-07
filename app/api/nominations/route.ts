import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getPagination, paginatedResponse, parseIds } from '@/lib/pagination'
import { isAuthorized, unauthorizedResponse } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const { page, limit, from, to } = getPagination(searchParams)
  const ids = parseIds(searchParams.get('ids'))

  let query = supabase
    .from('nominations')
    .select('*', { count: 'exact' })

  const ceremony_year = searchParams.get('year')
  const yearStart = searchParams.get('yearStart')
  const yearEnd = searchParams.get('yearEnd')
  const category = searchParams.get('category')
  const nominee = searchParams.get('nominee')
  const movie = searchParams.get('movie')
  const winner = searchParams.get('winner')
  const is_song = searchParams.get('is_song')
  const ceremony_ids = parseIds(searchParams.get('ceremony_ids'))
  const category_ids = parseIds(searchParams.get('category_ids'))
  const movie_ids = parseIds(searchParams.get('movie_ids'))
  const nominee_ids = parseIds(searchParams.get('nominee_ids'))

  if (ids) query = query.in('id', ids)
  if (ceremony_ids) query = query.in('ceremony_id', ceremony_ids)
  if (category_ids) query = query.in('category_id', category_ids)
  if (movie_ids) query = query.in('movie_id', movie_ids)
  if (nominee_ids) query = query.in('nominee_id', nominee_ids)

  if (ceremony_year) {
    query = query.eq('ceremony_year', parseInt(ceremony_year))
  } else {
    if (yearStart) query = query.gte('ceremony_year', parseInt(yearStart))
    if (yearEnd) query = query.lte('ceremony_year', parseInt(yearEnd))
  }

  if (category) query = query.ilike('category', `%${category}%`)
  if (nominee) query = query.ilike('nominee', `%${nominee}%`)
  if (movie) query = query.ilike('movie', `%${movie}%`)
  if (winner !== null && winner !== undefined) query = query.eq('winner', winner === 'true')
  if (is_song !== null && is_song !== undefined) query = query.eq('is_song', is_song === 'true')

  query = query.order('ceremony_year', { ascending: false }).order('movie', { ascending: true }).range(from, to)

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
    .from('nominations')
    .insert(body)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}