import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getPagination, paginatedResponse } from '@/lib/pagination'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const { page, limit, from, to } = getPagination(searchParams)

  const q = searchParams.get('q')
  const winner = searchParams.get('winner')
  const year = searchParams.get('year')
  const yearStart = searchParams.get('yearStart')
  const yearEnd = searchParams.get('yearEnd')

  if (!q || q.trim().length < 2) {
    return NextResponse.json(
      { error: 'Search query "q" is required and must be at least 2 characters' },
      { status: 400 }
    )
  }

  let query = supabase
    .from('nominations')
    .select('*', { count: 'exact' })
    .or(`nominee.ilike.%${q}%,movie.ilike.%${q}%,category.ilike.%${q}%`)

  if (winner !== null && winner !== undefined) query = query.eq('winner', winner === 'true')

  if (year) {
    query = query.eq('ceremony_year', parseInt(year))
  } else {
    if (yearStart) query = query.gte('ceremony_year', parseInt(yearStart))
    if (yearEnd) query = query.lte('ceremony_year', parseInt(yearEnd))
  }

  query = query.order('ceremony_year', { ascending: false }).range(from, to)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    query: q,
    ...paginatedResponse(data, count ?? 0, page, limit)
  })
}