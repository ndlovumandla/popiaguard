import { NextRequest } from 'next/server';
import { db } from '@/db';
import { users, passwordResetTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, serverError } from '@/lib/api-response';
import { createHash, randomBytes } from 'crypto';
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (user) {
      const token = randomBytes(32).toString('hex');
      const hash = createHash('sha256').update(token).digest('hex');
      await db.insert(passwordResetTokens).values({ userId: user.id, tokenHash: hash, expiresAt: new Date(Date.now() + 3600000) });
      // TODO: send email with token via Resend
      console.log('[reset token]', token);
    }
    return ok({ message: 'If that email exists, a reset link has been sent.' });
  } catch(e) { return serverError(String(e)); }
}
