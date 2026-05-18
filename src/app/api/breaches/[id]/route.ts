import { NextRequest } from 'next/server';
import { db } from '@/db';
import { breachIncidents } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { ok, notFound, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { logAudit } from '@/lib/audit';
export async function PUT(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  return withAuth(async (user) => {
    try {
      const body = await req.json();
      const updates: Record<string,unknown> = { ...body, updatedAt: new Date() };
      if (body.reportedAt) updates.reportedAt = new Date(body.reportedAt);
      const [row] = await db.update(breachIncidents).set(updates as never).where(and(eq(breachIncidents.id, id), eq(breachIncidents.orgId, user.orgId))).returning();
      if (!row) return notFound();
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'breach.update', resource: 'breach', resourceId: id });
      return ok(row);
    } catch(e) { return serverError(String(e)); }
  });
}
