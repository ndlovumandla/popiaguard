import { cookies } from 'next/headers';
import { signAccessToken, signRefreshToken } from './jwt';
import { db } from '@/db';
import { refreshTokens } from '@/db/schema';
import { createHash } from 'crypto';
export async function createSession(userId: string, orgId: string, email: string, role: string) {
  const payload = { userId, orgId, email, role };
  const [access, refresh] = await Promise.all([signAccessToken(payload), signRefreshToken(payload)]);
  const hash = createHash('sha256').update(refresh).digest('hex');
  const exp = new Date(Date.now() + 7 * 86400 * 1000);
  await db.insert(refreshTokens).values({ userId, tokenHash: hash, expiresAt: exp });
  const store = await cookies();
  store.set('access_token', access, { httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax', maxAge:900, path:'/' });
  store.set('refresh_token', refresh, { httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax', maxAge:604800, path:'/' });
  return { access, refresh };
}
export async function clearSession() {
  const store = await cookies();
  store.delete('access_token');
  store.delete('refresh_token');
}
