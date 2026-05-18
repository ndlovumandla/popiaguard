import { NextRequest } from 'next/server';
import { calculateComplianceScore } from '@/lib/compliance-score';
import { ok, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';
export async function GET(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const breakdown = await calculateComplianceScore(user.orgId);
      return ok(breakdown);
    } catch(e) { return serverError(String(e)); }
  });
}
