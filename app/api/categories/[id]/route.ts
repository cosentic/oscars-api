import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  return NextResponse.json({ data })
}