import { NextRequest } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
export async function GET(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const members = await db.select({ id:users.id, email:users.email, firstName:users.firstName, lastName:users.lastName, role:users.role, emailVerified:users.emailVerified, createdAt:users.createdAt }).from(users).where(eq(users.orgId, user.orgId)).orderBy(users.createdAt);
      return ok({ members, total: members.length });
    } catch(e) { return serverError(String(e)); }
  });
}
