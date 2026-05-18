import { NextRequest } from 'next/server';
import { db } from '@/db';
import { auditLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
export async function GET(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get('limit') || '100');
      const logs = await db.select().from(auditLogs).where(eq(auditLogs.orgId, user.orgId)).orderBy(auditLogs.createdAt).limit(limit);
      return ok({ logs, total: logs.length });
    } catch(e) { return serverError(String(e)); }
  });
}
