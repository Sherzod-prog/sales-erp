import { NextRequest, NextResponse } from 'next/server'

const protectedPaths = ['/dashboard', '/products', '/customers', '/orders']

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get('session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/products/:path*', '/customers/:path*', '/orders/:path*'],
}