export const DEFAULT_PAGE_SIZE = 25
export const MAX_PAGE_SIZE = 100

export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE)))
  )
  const from = (page - 1) * limit
  const to = from + limit - 1

  return { page, limit, from, to }
}

export function paginatedResponse(data: any[], count: number, page: number, limit: number) {
  const totalPages = Math.ceil(count / limit)
  return {
    data,
    pagination: {
      total: count,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}

export function parseIds(param: string | null): number[] | null {
  if (!param) return null
  return param.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
}