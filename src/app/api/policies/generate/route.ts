import { NextRequest } from 'next/server';
import { db } from '@/db';
import { dataCategories, organisations, informationOfficers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, serverError } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-helpers';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

export async function POST(req: NextRequest) {
  return withAuth(async (user) => {
    try {
      const [org] = await db.select().from(organisations).where(eq(organisations.id, user.orgId)).limit(1);
      const categories = await db.select().from(dataCategories).where(eq(dataCategories.orgId, user.orgId));
      const [io] = await db.select().from(informationOfficers).where(eq(informationOfficers.orgId, user.orgId)).limit(1);

      const prompt = [
        'Generate a comprehensive POPIA-compliant Privacy Policy for a South African organisation.',
        'Organisation: ' + org.name + (org.industry ? ' (' + org.industry + ')' : ''),
        io ? 'Information Officer: ' + io.name + ' <' + io.email + '>' : '',
        'Data Categories Processed:',
        categories.map(c => '- ' + c.name + ' (' + c.sensitivity + ')' + (c.purposeOfProcessing ? ': ' + c.purposeOfProcessing : '')).join('\n'),
        '',
        'Requirements:',
        '- Reference POPIA (Protection of Personal Information Act 4 of 2013)',
        '- Include: data collected, purposes, lawful basis, retention, subject rights, third-party sharing, security measures, cookies, contact details',
        '- Write in plain English, professional tone',
        '- Output the full policy text only, no JSON wrapper',
      ].filter(Boolean).join('\n');

      const res = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
      });
      if (!res.ok) throw new Error('Ollama request failed: ' + res.statusText);
      const json = await res.json() as { response: string };
      return ok({ title: org.name + ' Privacy Policy', content: json.response });
    } catch(e) { return serverError(String(e)); }
  });
}
