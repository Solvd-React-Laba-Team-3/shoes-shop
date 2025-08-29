// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const headers = new Headers(request.headers);
  headers.set('x-pathname', pathname);

  return NextResponse.next({
    request: { headers },
  });
}

export const config = {
  matcher: '/:path*',
};
