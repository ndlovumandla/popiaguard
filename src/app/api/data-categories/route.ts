import { NextRequest } from 'next/server';
import { db } from '@/db';
import { dataCategories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, created, badRequest, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { dataCategorySchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';
export async function GET(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const cats = await db.select().from(dataCategories).where(eq(dataCategories.orgId, user.orgId)).orderBy(dataCategories.createdAt);
      return ok({ categories: cats, total: cats.length });
    } catch(e) { return serverError(String(e)); }
  });
}
export async function POST(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await req.json();
      const parsed = dataCategorySchema.safeParse(body);
      if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());
      const [cat] = await db.insert(dataCategories).values({ orgId: user.orgId, ...parsed.data }).returning();
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'data_category.create', resource: 'data_category', resourceId: cat.id });
      return created(cat);
    } catch(e) { return serverError(String(e)); }
  });
}
