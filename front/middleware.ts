import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const url = req.nextUrl.pathname
  console.log("hello",token);
  
  if (!token) {
    return NextResponse.redirect(new URL('/Home', req.url))
  }
  const role = token.user?.role
  if (url.startsWith('/Admin') && role !== 1) {
    return NextResponse.redirect(new URL('/Home', req.url))
  }

  if (url.startsWith('/profile') && (role !== 0 && role !== 1 )) {
    return NextResponse.redirect(new URL('/Home', req.url))
  }

  if (url.startsWith('/Chat') && (role !== 0 && role !== 1 )) {
    return NextResponse.redirect(new URL('/Home', req.url))
  }
   if (url.startsWith('/Notification') && (role !== 0 && role !== 1 )) {
    return NextResponse.redirect(new URL('/Home', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/Admin/:path*',
    '/Profile/:path*',
    '/Chat/:path*',
    '/profile/:path*',
  ],
}