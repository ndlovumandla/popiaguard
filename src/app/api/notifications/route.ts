import { NextRequest } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { ok, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
export async function GET(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const url = new URL(req.url);
      const unreadOnly = url.searchParams.get('unread') === 'true';
      const where = unreadOnly
        ? and(eq(notifications.userId, user.userId), eq(notifications.isRead, false))
        : eq(notifications.userId, user.userId);
      const [rows, total] = await Promise.all([
        db.select().from(notifications).where(where).orderBy(notifications.createdAt).limit(50),
        db.select({n:count()}).from(notifications).where(where).then(r=>Number(r[0]?.n??0)),
      ]);
      return ok({ notifications: rows, total });
    } catch(e) { return serverError(String(e)); }
  });
}
