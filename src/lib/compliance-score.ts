import { db } from '@/db';
import { dataCategories, informationOfficers, privacyPolicies, consentRecords, breachIncidents, paiaRequests, complianceTasks, organisations } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
export interface ScoreBreakdown { total: number; components: { label:string; earned:number; max:number; met:boolean; description:string; }[]; }
export async function calculateComplianceScore(orgId: string): Promise<ScoreBreakdown> {
  const q = (table: Parameters<typeof count>[0], where: Parameters<typeof db.select>[0]) =>
    db.select({ n: count() }).from(table as never).where(where as never).then(r => Number(r[0]?.n ?? 0));

  const [dc, io, policy, consent, breach, paia, critTask] = await Promise.all([
    db.select({ n: count() }).from(dataCategories).where(and(eq(dataCategories.orgId, orgId), eq(dataCategories.isActive, true))).then(r=>Number(r[0]?.n??0)),
    db.select({ n: count() }).from(informationOfficers).where(and(eq(informationOfficers.orgId, orgId), eq(informationOfficers.isActive, true))).then(r=>Number(r[0]?.n??0)),
    db.select({ n: count() }).from(privacyPolicies).where(and(eq(privacyPolicies.orgId, orgId), eq(privacyPolicies.status, 'published'))).then(r=>Number(r[0]?.n??0)),
    db.select({ n: count() }).from(consentRecords).where(eq(consentRecords.orgId, orgId)).then(r=>Number(r[0]?.n??0)),
    db.select({ n: count() }).from(breachIncidents).where(and(eq(breachIncidents.orgId, orgId))).then(r=>Number(r[0]?.n??0)),
    db.select({ n: count() }).from(paiaRequests).where(eq(paiaRequests.orgId, orgId)).then(r=>Number(r[0]?.n??0)),
    db.select({ n: count() }).from(complianceTasks).where(and(eq(complianceTasks.orgId, orgId), eq(complianceTasks.isCritical, true), eq(complianceTasks.status, 'pending'))).then(r=>Number(r[0]?.n??0)),
  ]);

  const components = [
    { label:'Data Inventory',       earned: dc>0 ?15:0,  max:15, met: dc>0,         description:'At least one active data category documented' },
    { label:'Lawful Basis',         earned: dc>0 ?10:0,  max:10, met: dc>0,         description:'Data categories have lawful basis documented' },
    { label:'Information Officer',  earned: io>0 ?15:0,  max:15, met: io>0,         description:'An Information Officer has been designated' },
    { label:'Privacy Policy',       earned: policy>0?15:0,max:15,met: policy>0,     description:'A privacy policy is published' },
    { label:'Consent Records',      earned: consent>0?10:0,max:10,met:consent>0,    description:'Consent records are being maintained' },
    { label:'Breach Management',    earned: breach===0?15:0,max:15,met:breach===0,  description:'No unresolved breach incidents' },
    { label:'PAIA Compliance',      earned: paia===0?10:0, max:10,met:paia===0,     description:'No overdue PAIA requests' },
    { label:'Critical Tasks',       earned: critTask===0?10:0,max:10,met:critTask===0,description:'All critical tasks are completed' },
  ];
  const total = components.reduce((s,c)=>s+c.earned, 0);
  await db.update(organisations).set({ complianceScore: total, lastScoreUpdate: new Date(), updatedAt: new Date() }).where(eq(organisations.id, orgId));
  return { total, components };
}
