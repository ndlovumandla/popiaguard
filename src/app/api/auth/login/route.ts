import { NextRequest } from 'next/server';
import { db } from '@/db';
import { users, organisations } from '@/db/schema';
import { loginSchema } from '@/lib/validations';
import { badRequest, ok, serverError, unauthorized } from '@/lib/api-response';
import { createSession } from '@/lib/session';
import { logAudit } from '@/lib/audit';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());
    const { email, password } = parsed.data;
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) return unauthorized('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return unauthorized('Invalid credentials');
    if (!user.orgId) return unauthorized('No organisation assigned');
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
    await createSession(user.id, user.orgId, email, user.role);
    await logAudit({ orgId: user.orgId, userId: user.id, action: 'auth.login', resource: 'auth', ipAddress: req.headers.get('x-forwarded-for') ?? undefined });
    return ok({ user: { id: user.id, email, firstName: user.firstName, lastName: user.lastName, role: user.role, orgId: user.orgId } });
  } catch(e) { return serverError(String(e)); }
}
