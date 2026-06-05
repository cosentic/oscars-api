import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isAuthorized, unauthorizedResponse } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from('movies')
    .select(`
      *,
      nominations(
        id,
        ceremony_year,
        category,
        nominee,
        winner
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 })
  }

  return NextResponse.json({ data })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) return unauthorizedResponse()

  const { id } = await params
  const body = await request.json()

  const { data, error } = await supabase
    .from('movies')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}