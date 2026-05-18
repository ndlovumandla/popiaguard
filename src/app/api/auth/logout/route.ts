import { clearSession } from '@/lib/session';
import { ok } from '@/lib/api-response';
export async function POST() {
  await clearSession();
  return ok({ message: 'Logged out' });
}
