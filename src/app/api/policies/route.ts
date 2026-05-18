import { NextRequest } from 'next/server';
import { db } from '@/db';
import { privacyPolicies } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, created, badRequest, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { policySchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';
import { slugify } from '@/lib/utils';
import { nanoid } from 'nanoid';
export async function GET(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const policies = await db.select().from(privacyPolicies).where(eq(privacyPolicies.orgId, user.orgId)).orderBy(privacyPolicies.createdAt);
      return ok({ policies, total: policies.length });
    } catch(e) { return serverError(String(e)); }
  });
}
export async function POST(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await req.json();
      const parsed = policySchema.safeParse(body);
      if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());
      const slug = slugify(parsed.data.title) + '-' + nanoid(6);
      const [policy] = await db.insert(privacyPolicies).values({ orgId: user.orgId, createdByUserId: user.userId, slug, ...parsed.data }).returning();
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'policy.create', resource: 'privacy_policy', resourceId: policy.id });
      return created(policy);
    } catch(e) { return serverError(String(e)); }
  });
}
