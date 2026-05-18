import { NextRequest } from 'next/server';
import { db } from '@/db';
import { informationOfficers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, created, badRequest, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { ioSchema } from '@/lib/validations';
export async function GET(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const [io] = await db.select().from(informationOfficers).where(eq(informationOfficers.orgId, user.orgId)).limit(1);
      return ok(io || null);
    } catch(e) { return serverError(String(e)); }
  });
}
export async function POST(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await req.json();
      const parsed = ioSchema.safeParse(body);
      if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());
      const [io] = await db.insert(informationOfficers).values({ orgId: user.orgId, ...parsed.data }).returning();
      return created(io);
    } catch(e) { return serverError(String(e)); }
  });
}
