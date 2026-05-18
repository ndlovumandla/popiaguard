import { NextRequest } from 'next/server';
import { db } from '@/db';
import { paiaRequests } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { ok, notFound, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { logAudit } from '@/lib/audit';
export async function PUT(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  return withAuth(async (user) => {
    try {
      const body = await req.json();
      const [row] = await db.update(paiaRequests).set({ ...body, updatedAt: new Date() }).where(and(eq(paiaRequests.id, id), eq(paiaRequests.orgId, user.orgId))).returning();
      if (!row) return notFound();
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'paia.update', resource: 'paia_request', resourceId: id });
      return ok(row);
    } catch(e) { return serverError(String(e)); }
  });
}
