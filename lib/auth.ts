import { NextRequest } from 'next/server'

export function isAuthorized(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key')
  return apiKey === process.env.API_SECRET_KEY
}

export function unauthorizedResponse() {
  return Response.json(
    { error: 'Unauthorized — valid API key required in x-api-key header' },
    { status: 401 }
  )
}