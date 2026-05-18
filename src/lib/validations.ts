import { z } from 'zod';
export const registerSchema = z.object({
  firstName: z.string().min(1).max(100), lastName: z.string().min(1).max(100),
  email: z.string().email(), orgName: z.string().min(2).max(255),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export const dataCategorySchema = z.object({
  name: z.string().min(1).max(255), description: z.string().optional(),
  sensitivity: z.enum(['general','special','children']),
  lawfulBasis: z.enum(['consent','contract','legal_obligation','vital_interests','public_task','legitimate_interests']).optional(),
  retentionPeriodDays: z.number().int().positive().optional(),
  thirdPartySharing: z.boolean().default(false),
  thirdParties: z.array(z.string()).default([]), dataSubjects: z.array(z.string()).default([]),
  purposeOfProcessing: z.string().optional(),
});
export const consentSchema = z.object({
  dataSubjectName: z.string().min(1).max(255), dataSubjectEmail: z.string().email(),
  purpose: z.string().min(1), categoryId: z.string().uuid().optional(),
  consentedAt: z.string().datetime(), expiresAt: z.string().datetime().optional(),
  evidence: z.string().optional(),
});
export const breachSchema = z.object({
  title: z.string().min(1).max(500), description: z.string().min(1),
  discoveredAt: z.string().datetime(), occurredAt: z.string().datetime().optional(),
  severity: z.enum(['low','medium','high','critical']),
  affectedDataSubjects: z.number().int().min(0).default(0),
  affectedCategories: z.array(z.string()).default([]),
});
export const paiaSchema = z.object({
  requestorName: z.string().min(1).max(255), requestorEmail: z.string().email(),
  requestorPhone: z.string().optional(), requestType: z.string().min(1),
  description: z.string().min(1), receivedAt: z.string().datetime(),
});
export const policySchema = z.object({
  title: z.string().min(1).max(255), content: z.string().min(1), version: z.string().default('1.0'),
});
export const taskSchema = z.object({
  title: z.string().min(1).max(500), description: z.string().optional(),
  category: z.string().min(1), priority: z.enum(['low','medium','high','critical']),
  dueDate: z.string().optional(), assignedToUserId: z.string().uuid().optional(),
  isCritical: z.boolean().default(false),
});
export const ioSchema = z.object({
  name: z.string().min(1).max(255), email: z.string().email(),
  phone: z.string().optional(), department: z.string().optional(),
});
