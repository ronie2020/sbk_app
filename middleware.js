import { createMiddlewareClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { supabase, response } = createMiddlewareClient({
    request,
    response: NextResponse.next(),
  })
  await supabase.auth.getSession()
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}