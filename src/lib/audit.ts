import { db } from '@/db';
import { auditLogs } from '@/db/schema';
export async function logAudit(p: { orgId:string; userId?:string; action:string; resource:string; resourceId?:string; details?:Record<string,unknown>; ipAddress?:string; }) {
  try { await db.insert(auditLogs).values(p); } catch(e) { console.error('[audit]', e); }
}
