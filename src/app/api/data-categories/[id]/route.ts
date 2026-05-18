import { NextRequest } from 'next/server';
import { db } from '@/db';
import { dataCategories } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { ok, noContent, notFound, badRequest, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
import { dataCategorySchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';
export async function GET(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  return withAuth(async (user) => {
    try {
      const [cat] = await db.select().from(dataCategories).where(and(eq(dataCategories.id, id), eq(dataCategories.orgId, user.orgId))).limit(1);
      if (!cat) return notFound();
      return ok(cat);
    } catch(e) { return serverError(String(e)); }
  });
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  return withAuth(async (user) => {
    try {
      const body = await req.json();
      const parsed = dataCategorySchema.partial().safeParse(body);
      if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());
      const [cat] = await db.update(dataCategories).set({ ...parsed.data, updatedAt: new Date() }).where(and(eq(dataCategories.id, id), eq(dataCategories.orgId, user.orgId))).returning();
      if (!cat) return notFound();
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'data_category.update', resource: 'data_category', resourceId: id });
      return ok(cat);
    } catch(e) { return serverError(String(e)); }
  });
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  return withAuth(async (user) => {
    try {
      await db.update(dataCategories).set({ isActive: false, updatedAt: new Date() }).where(and(eq(dataCategories.id, id), eq(dataCategories.orgId, user.orgId)));
      await logAudit({ orgId: user.orgId, userId: user.userId, action: 'data_category.delete', resource: 'data_category', resourceId: id });
      return noContent();
    } catch(e) { return serverError(String(e)); }
  });
}
