import { NextRequest } from 'next/server';
import { db } from '@/db';
import { complianceTasks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, created, badRequest, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { taskSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';
export async function GET(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get('limit') || '100');
      const tasks = await db.select().from(complianceTasks).where(eq(complianceTasks.orgId, user.orgId)).orderBy(complianceTasks.createdAt).limit(limit);
      return ok({ tasks, total: tasks.length });
    } catch(e) { return serverError(String(e)); }
  });
}
export async function POST(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await req.json();
      const parsed = taskSchema.safeParse(body);
      if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());
      const [task] = await db.insert(complianceTasks).values({ orgId: user.orgId, createdByUserId: user.userId, ...parsed.data }).returning();
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'task.create', resource: 'task', resourceId: task.id });
      return created(task);
    } catch(e) { return serverError(String(e)); }
  });
}
