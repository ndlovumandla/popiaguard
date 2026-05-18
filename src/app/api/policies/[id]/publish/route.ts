import { NextRequest } from 'next/server';
import { db } from '@/db';
import { privacyPolicies } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { ok, notFound, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { logAudit } from '@/lib/audit';
export async function POST(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  return withAuth(async (user) => {
    try {
      const [policy] = await db.update(privacyPolicies).set({ status: 'published', publishedAt: new Date(), updatedAt: new Date() }).where(and(eq(privacyPolicies.id, id), eq(privacyPolicies.orgId, user.orgId))).returning();
      if (!policy) return notFound();
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'policy.publish', resource: 'privacy_policy', resourceId: id });
      return ok(policy);
    } catch(e) { return serverError(String(e)); }
  });
}
