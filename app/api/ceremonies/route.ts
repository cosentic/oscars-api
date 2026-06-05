import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { parseIds } from '@/lib/pagination'
import { isAuthorized, unauthorizedResponse } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ids = parseIds(searchParams.get('ids'))

  let query = supabase
    .from('ceremonies')
    .select('*')
    .order('ceremony_year', { ascending: false })

  if (ids) query = query.in('id', ids)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count: data.length })
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorizedResponse()

  const body = await request.json()

  const { data, error } = await supabase
    .from('ceremonies')
    .insert(body)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}