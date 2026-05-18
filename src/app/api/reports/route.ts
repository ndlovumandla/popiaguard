import { NextRequest } from 'next/server';
import { db } from '@/db';
import { dataCategories, consentRecords, breachIncidents, paiaRequests, complianceTasks, users } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { ok, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
export async function GET(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const [dc, consent, consentActive, consentWithdrawn, breach, breachOpen, paia, tasks, team,
        breachDraft, breachReview, breachReported, breachClosed] = await Promise.all([
        db.select({n:count()}).from(dataCategories).where(and(eq(dataCategories.orgId, user.orgId), eq(dataCategories.isActive, true))).then(r=>Number(r[0]?.n??0)),
        db.select({n:count()}).from(consentRecords).where(eq(consentRecords.orgId, user.orgId)).then(r=>Number(r[0]?.n??0)),
        db.select({n:count()}).from(consentRecords).where(and(eq(consentRecords.orgId, user.orgId), eq(consentRecords.status, 'active'))).then(r=>Number(r[0]?.n??0)),
        db.select({n:count()}).from(consentRecords).where(and(eq(consentRecords.orgId, user.orgId), eq(consentRecords.status, 'withdrawn'))).then(r=>Number(r[0]?.n??0)),
        db.select({n:count()}).from(breachIncidents).where(eq(breachIncidents.orgId, user.orgId)).then(r=>Number(r[0]?.n??0)),
        db.select({n:count()}).from(breachIncidents).where(and(eq(breachIncidents.orgId, user.orgId), eq(breachIncidents.status, 'draft'))).then(r=>Number(r[0]?.n??0)),
        db.select({n:count()}).from(paiaRequests).where(eq(paiaRequests.orgId, user.orgId)).then(r=>Number(r[0]?.n??0)),
        db.select({n:count()}).from(complianceTasks).where(and(eq(complianceTasks.orgId, user.orgId), eq(complianceTasks.status, 'pending'))).then(r=>Number(r[0]?.n??0)),
        db.select({n:count()}).from(users).where(eq(users.orgId, user.orgId)).then(r=>Number(r[0]?.n??0)),
        db.select({n:count()}).from(breachIncidents).where(and(eq(breachIncidents.orgId, user.orgId), eq(breachIncidents.status, 'draft'))).then(r=>Number(r[0]?.n??0)),
        db.select({n:count()}).from(breachIncidents).where(and(eq(breachIncidents.orgId, user.orgId), eq(breachIncidents.status, 'under_review'))).then(r=>Number(r[0]?.n??0)),
        db.select({n:count()}).from(breachIncidents).where(and(eq(breachIncidents.orgId, user.orgId), eq(breachIncidents.status, 'reported'))).then(r=>Number(r[0]?.n??0)),
        db.select({n:count()}).from(breachIncidents).where(and(eq(breachIncidents.orgId, user.orgId), eq(breachIncidents.status, 'closed'))).then(r=>Number(r[0]?.n??0)),
      ]);
      return ok({ dataCategories:dc, consentRecords:consent, consentActive, consentWithdrawn, openBreaches:breachOpen, totalBreaches:breach, paiaRequests:paia, pendingTasks:tasks, teamMembers:team, breachDraft, breachReview, breachReported, breachClosed });
    } catch(e) { return serverError(String(e)); }
  });
}
