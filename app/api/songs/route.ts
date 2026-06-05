import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getPagination, paginatedResponse, parseIds } from '@/lib/pagination'
import { isAuthorized, unauthorizedResponse } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const { page, limit, from, to } = getPagination(searchParams)
  const ids = parseIds(searchParams.get('ids'))

  let query = supabase
    .from('songs')
    .select('*', { count: 'exact' })

  const title = searchParams.get('title')
  const artist = searchParams.get('artist')
  const year = searchParams.get('year')

  if (ids) query = query.in('id', ids)
  if (title) query = query.ilike('original_title', `%${title}%`)
  if (artist) query = query.ilike('artist_names', `%${artist}%`)
  if (year) query = query.eq('spotify_year', parseInt(year))

  query = query.order('original_title', { ascending: true }).range(from, to)

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
    .from('songs')
    .insert(body)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}