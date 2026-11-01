import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isAuthorized, unauthorizedResponse } from '@/lib/auth'
import { rateLimitResponse, CACHE_HEADERS } from '@/lib/ratelimit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = await rateLimitResponse(request, 'read')
  if (limited) return limited

  const { id } = await params

  const { data, error } = await supabase
    .from('nominations')
    .select(`
      *,
      movie:movies(*),
      ceremony:ceremonies(*),
      category:categories(*),
      nominee:nominees(*),
      song:songs(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Nomination not found' }, { status: 404 })
  }

  return NextResponse.json({ data }, { headers: CACHE_HEADERS })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = await rateLimitResponse(request, 'write')
  if (limited) return limited

  if (!isAuthorized(request)) return unauthorizedResponse()

  const { id } = await params
  const body = await request.json()

  const { data, error } = await supabase
    .from('nominations')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}