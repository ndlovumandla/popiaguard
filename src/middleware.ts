import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwt';
const PUBLIC = ['/login','/register','/forgot-password','/reset-password',
  '/api/auth/login','/api/auth/register','/api/auth/refresh',
  '/api/auth/forgot-password','/api/auth/reset-password','/policy'];
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.some(p => pathname.startsWith(p)) || pathname.startsWith('/_next') || pathname.includes('.')) return NextResponse.next();
  const token = req.cookies.get('access_token')?.value;
  if (!token) {
    if (pathname.startsWith('/api/')) return NextResponse.json({ success:false, message:'Unauthorized' }, { status:401 });
    return NextResponse.redirect(new URL('/login', req.url));
  }
  try {
    const payload = await verifyAccessToken(token);
    const headers = new Headers(req.headers);
    headers.set('x-user-id', payload.userId);
    headers.set('x-org-id', payload.orgId);
    headers.set('x-user-role', payload.role);
    return NextResponse.next({ request: { headers } });
  } catch {
    if (pathname.startsWith('/api/')) return NextResponse.json({ success:false, message:'Unauthorized' }, { status:401 });
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.delete('access_token');
    return res;
  }
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
