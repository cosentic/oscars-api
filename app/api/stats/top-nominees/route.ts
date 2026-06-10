import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const category = searchParams.get('category')
  const category_group = searchParams.get('category_group')
  const known_for_department = searchParams.get('known_for_department')
  const yearStart = searchParams.get('yearStart')
  const yearEnd = searchParams.get('yearEnd')
  const sort = searchParams.get('sort') || 'wins'
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '100')))

  const { data, error } = await supabase.rpc('top_nominees', {
    p_category: category ?? null,
    p_category_group: category_group ?? null,
    p_known_for_department: known_for_department ?? null,
    p_year_start: yearStart ? parseInt(yearStart) : null,
    p_year_end: yearEnd ? parseInt(yearEnd) : null,
    p_sort: sort,
    p_limit: limit,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count: data.length })
}