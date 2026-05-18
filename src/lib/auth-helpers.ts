import { cookies } from 'next/headers';
import { verifyAccessToken, type TokenPayload } from './jwt';
import { unauthorized } from './api-response';
import { NextResponse } from 'next/server';
export async function getSessionUser(): Promise<TokenPayload|null> {
  try {
    const store = await cookies();
    const token = store.get('access_token')?.value;
    if (!token) return null;
    return await verifyAccessToken(token);
  } catch { return null; }
}
export async function requireAuth(): Promise<TokenPayload> {
  const user = await getSessionUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}
export async function withAuth(handler: (user: TokenPayload) => Promise<NextResponse>): Promise<NextResponse> {
  try { return await handler(await requireAuth()); }
  catch (err: unknown) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') return unauthorized();
    console.error('[withAuth]', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
