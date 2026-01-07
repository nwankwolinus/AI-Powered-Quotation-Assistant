import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/quotes') ||
      req.nextUrl.pathname.startsWith('/database') ||
      req.nextUrl.pathname.startsWith('/clients') ||
      req.nextUrl.pathname.startsWith('/settings')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Redirect authenticated users from auth pages
  if ((req.nextUrl.pathname.startsWith('/login') ||
       req.nextUrl.pathname.startsWith('/register')) &&
      session) {
    return NextResponse.redirect(new URL('/quotes', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/quotes/:path*',
    '/database/:path*',
    '/clients/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
}