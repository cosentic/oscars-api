import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimitResponse, CACHE_HEADERS } from '@/lib/ratelimit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = await rateLimitResponse(request, 'read')
  if (limited) return limited

  const { id } = await params

  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      nominations(
        id,
        ceremony_year,
        movie,
        nominee,
        winner
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  return NextResponse.json({ data }, { headers: CACHE_HEADERS })
}