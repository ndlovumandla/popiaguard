import { NextRequest } from 'next/server';
import { db } from '@/db';
import { consentRecords } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { ok, notFound, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { logAudit } from '@/lib/audit';
export async function POST(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  return withAuth(async (user) => {
    try {
      const [rec] = await db.update(consentRecords).set({ status: 'withdrawn', withdrawnAt: new Date(), updatedAt: new Date() }).where(and(eq(consentRecords.id, id), eq(consentRecords.orgId, user.orgId))).returning();
      if (!rec) return notFound();
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'consent.withdraw', resource: 'consent', resourceId: id });
      return ok(rec);
    } catch(e) { return serverError(String(e)); }
  });
}
