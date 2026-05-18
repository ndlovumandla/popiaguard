import { NextRequest } from 'next/server';
import { db } from '@/db';
import { consentRecords } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, created, badRequest, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { consentSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';
export async function GET(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const records = await db.select().from(consentRecords).where(eq(consentRecords.orgId, user.orgId)).orderBy(consentRecords.createdAt);
      return ok({ records, total: records.length });
    } catch(e) { return serverError(String(e)); }
  });
}
export async function POST(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await req.json();
      const parsed = consentSchema.safeParse(body);
      if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());
      const [rec] = await db.insert(consentRecords).values({ orgId: user.orgId, ...parsed.data, consentedAt: new Date(parsed.data.consentedAt), expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined }).returning();
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'consent.create', resource: 'consent', resourceId: rec.id });
      return created(rec);
    } catch(e) { return serverError(String(e)); }
  });
}
