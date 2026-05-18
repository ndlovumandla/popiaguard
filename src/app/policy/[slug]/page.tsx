import { db } from '@/db';
import { privacyPolicies, organisations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { Shield } from 'lucide-react';
export const revalidate = 3600;
export default async function PublicPolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [policy] = await db.select().from(privacyPolicies).where(eq(privacyPolicies.slug, slug)).limit(1);
  if (!policy || policy.status !== 'published') notFound();
  const [org] = await db.select({ name: organisations.name }).from(organisations).where(eq(organisations.id, policy.orgId)).limit(1);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex items-center gap-2 mb-8 text-primary"><Shield className="w-6 h-6" /><span className="font-semibold">POPIAGuard</span></div>
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{policy.title}</h1>
          <div className="flex gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            <span>{org?.name}</span>
            <span>Version {policy.version}</span>
            {policy.publishedAt&&<span>Published {formatDate(policy.publishedAt.toString())}</span>}
          </div>
          <div className="prose prose-gray max-w-none whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{policy.content}</div>
        </div>
      </div>
    </div>
  );
}
