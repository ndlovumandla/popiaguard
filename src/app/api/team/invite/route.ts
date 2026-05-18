import { NextRequest } from 'next/server';
import { db } from '@/db';
import { teamInvitations } from '@/db/schema';
import { ok, badRequest, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { logAudit } from '@/lib/audit';
import { createHash, randomBytes } from 'crypto';
import { z } from 'zod';
const schema = z.object({ email: z.string().email(), role: z.enum(['admin','member','viewer']).default('member') });
export async function POST(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await req.json();
      const parsed = schema.safeParse(body);
      if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());
      const token = randomBytes(32).toString('hex');
      const hash = createHash('sha256').update(token).digest('hex');
      const exp = new Date(Date.now() + 7 * 86400000);
      await db.insert(teamInvitations).values({ orgId: user.orgId, email: parsed.data.email, role: parsed.data.role, invitedByUserId: user.userId, tokenHash: hash, expiresAt: exp });
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'team.invite', resource: 'invitation', details: { email: parsed.data.email, role: parsed.data.role } });
      // TODO: send invite email via Resend
      console.log('[invite token]', token, 'for', parsed.data.email);
      return ok({ message: 'Invitation sent', email: parsed.data.email });
    } catch(e) { return serverError(String(e)); }
  });
}
