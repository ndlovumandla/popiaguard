import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { refreshTokens, users } from '@/db/schema';
import { verifyRefreshToken, signAccessToken } from '@/lib/jwt';
import { unauthorized, ok, serverError } from '@/lib/api-response';
import { eq, and, isNull } from 'drizzle-orm';
import { createHash } from 'crypto';
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('refresh_token')?.value;
    if (!token) return unauthorized();
    const payload = await verifyRefreshToken(token);
    const hash = createHash('sha256').update(token).digest('hex');
    const [stored] = await db.select().from(refreshTokens).where(and(eq(refreshTokens.userId, payload.userId), eq(refreshTokens.tokenHash, hash), isNull(refreshTokens.revokedAt))).limit(1);
    if (!stored || stored.expiresAt < new Date()) return unauthorized('Refresh token expired');
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
    if (!user || !user.orgId) return unauthorized();
    const newAccess = await signAccessToken({ userId: user.id, orgId: user.orgId, email: user.email, role: user.role });
    const res = ok({ accessToken: newAccess });
    (res as NextResponse).cookies.set('access_token', newAccess, { httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax', maxAge:900, path:'/' });
    return res;
  } catch(e) { return serverError(String(e)); }
}
