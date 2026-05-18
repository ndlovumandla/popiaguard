import { NextRequest } from 'next/server';
import { db } from '@/db';
import { paiaRequests } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, created, badRequest, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { paiaSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';
export async function GET(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const rows = await db.select().from(paiaRequests).where(eq(paiaRequests.orgId, user.orgId)).orderBy(paiaRequests.createdAt);
      return ok({ requests: rows, total: rows.length });
    } catch(e) { return serverError(String(e)); }
  });
}
export async function POST(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await req.json();
      const parsed = paiaSchema.safeParse(body);
      if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());
      const receivedAt = new Date(parsed.data.receivedAt);
      const dueDate = new Date(receivedAt.getTime() + 30 * 86400000);
      const [row] = await db.insert(paiaRequests).values({ orgId: user.orgId, ...parsed.data, receivedAt, dueDate }).returning();
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'paia.create', resource: 'paia_request', resourceId: row.id });
      return created(row);
    } catch(e) { return serverError(String(e)); }
  });
}
