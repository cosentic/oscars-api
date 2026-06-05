import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { parseIds } from '@/lib/pagination'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ids = parseIds(searchParams.get('ids'))

  let query = supabase
    .from('categories')
    .select('*')
    .order('category_name', { ascending: true })

  const category_name = searchParams.get('category_name')
  const category_group = searchParams.get('category_group')

  if (ids) query = query.in('id', ids)
  if (category_name) query = query.ilike('category_name', `%${category_name}%`)
  if (category_group) query = query.ilike('category_group', `%${category_group}%`)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count: data.length })
}