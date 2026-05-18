import { NextRequest } from 'next/server';
import { db } from '@/db';
import { organisations, informationOfficers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { ioSchema } from '@/lib/validations';
export async function POST(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const { org, informationOfficer } = await req.json();
      if (org) await db.update(organisations).set({ ...org, updatedAt: new Date() }).where(eq(organisations.id, user.orgId));
      if (informationOfficer) {
        const parsed = ioSchema.safeParse(informationOfficer);
        if (parsed.success) await db.insert(informationOfficers).values({ orgId: user.orgId, ...parsed.data });
      }
      await db.update(organisations).set({ onboardingComplete: true, updatedAt: new Date() }).where(eq(organisations.id, user.orgId));
      return ok({ message: 'Onboarding complete' });
    } catch(e) { return serverError(String(e)); }
  });
}
