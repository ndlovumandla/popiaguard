import { NextRequest } from 'next/server';
import { db } from '@/db';
import { organisations, users } from '@/db/schema';
import { registerSchema } from '@/lib/validations';
import { badRequest, conflict, created, serverError } from '@/lib/api-response';
import { createSession } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());
    const { firstName, lastName, email, orgName, password } = parsed.data;
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length) return conflict('Email already registered');
    const [org] = await db.insert(organisations).values({ name: orgName }).returning();
    const hash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(users).values({ orgId: org.id, email, passwordHash: hash, firstName, lastName, role: 'owner', emailVerified: true }).returning();
    await createSession(user.id, org.id, email, user.role);
    return created({ user: { id: user.id, email, firstName, lastName, role: user.role }, org: { id: org.id, name: org.name } });
  } catch(e) { return serverError(String(e)); }
}
