import { NextRequest } from 'next/server';
import { db } from '@/db';
import { complianceTasks } from '@/db/schema';
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
      if (body.completedAt) updates.completedAt = new Date(body.completedAt);
      const [task] = await db.update(complianceTasks).set(updates as never).where(and(eq(complianceTasks.id, id), eq(complianceTasks.orgId, user.orgId))).returning();
      if (!task) return notFound();
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'task.update', resource: 'task', resourceId: id });
      return ok(task);
    } catch(e) { return serverError(String(e)); }
  });
}
