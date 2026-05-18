import { NextRequest } from 'next/server';
import { db } from '@/db';
import { organisations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { logAudit } from '@/lib/audit';
export async function GET(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const [org] = await db.select().from(organisations).where(eq(organisations.id, user.orgId)).limit(1);
      return ok(org);
    } catch(e) { return serverError(String(e)); }
  });
}
export async function PUT(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await req.json();
      const [org] = await db.update(organisations).set({ ...body, updatedAt: new Date() }).where(eq(organisations.id, user.orgId)).returning();
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'org.update', resource: 'organisation', resourceId: user.orgId });
      return ok(org);
    } catch(e) { return serverError(String(e)); }
  });
}
