import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Get the path
  const path = request.nextUrl.pathname

  // Check if it's a dashboard route
  const isDashboardRoute = path.startsWith('/dashboard')

  // Get the token from cookies
  const token = request.cookies.get('jwt')

  // If trying to access dashboard without token, redirect to sign-in
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // If trying to access auth pages with token, redirect to dashboard
  if ((path === '/sign-in' || path === '/sign-up') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sign-in',
    '/sign-up'
  ]
}
