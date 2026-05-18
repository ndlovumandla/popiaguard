import { NextRequest } from 'next/server';
import { db } from '@/db';
import { breachIncidents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, created, badRequest, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { breachSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';
export async function GET(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const rows = await db.select().from(breachIncidents).where(eq(breachIncidents.orgId, user.orgId)).orderBy(breachIncidents.createdAt);
      return ok({ breaches: rows, total: rows.length });
    } catch(e) { return serverError(String(e)); }
  });
}
export async function POST(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await req.json();
      const parsed = breachSchema.safeParse(body);
      if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());
      const [row] = await db.insert(breachIncidents).values({ orgId: user.orgId, reportedByUserId: user.userId, ...parsed.data, discoveredAt: new Date(parsed.data.discoveredAt), occurredAt: parsed.data.occurredAt ? new Date(parsed.data.occurredAt) : undefined }).returning();
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'breach.create', resource: 'breach', resourceId: row.id });
      return created(row);
    } catch(e) { return serverError(String(e)); }
  });
}
