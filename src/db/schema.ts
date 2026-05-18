import { pgTable, pgEnum, text, varchar, integer, boolean, timestamp, json, uuid, date, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const planEnum = pgEnum('plan', ['free','starter','professional','enterprise']);
export const roleEnum = pgEnum('role', ['owner','admin','member','viewer']);
export const lawfulBasisEnum = pgEnum('lawful_basis', ['consent','contract','legal_obligation','vital_interests','public_task','legitimate_interests']);
export const dataSensitivityEnum = pgEnum('data_sensitivity', ['general','special','children']);
export const consentStatusEnum = pgEnum('consent_status', ['active','withdrawn','expired','pending']);
export const breachSeverityEnum = pgEnum('breach_severity', ['low','medium','high','critical']);
export const breachStatusEnum = pgEnum('breach_status', ['draft','under_review','reported','closed']);
export const paiaStatusEnum = pgEnum('paia_status', ['received','acknowledged','in_progress','granted','refused','appealed']);
export const policyStatusEnum = pgEnum('policy_status', ['draft','published','archived']);
export const taskPriorityEnum = pgEnum('task_priority', ['low','medium','high','critical']);
export const taskStatusEnum = pgEnum('task_status', ['pending','in_progress','completed','overdue','waived']);
export const notifTypeEnum = pgEnum('notif_type', ['breach','paia_deadline','consent_expiry','task_due','policy_review','system']);

export const organisations = pgTable('organisations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name',{length:255}).notNull(),
  registrationNumber: varchar('registration_number',{length:100}),
  industry: varchar('industry',{length:100}),
  size: varchar('size',{length:50}),
  address: text('address'),
  website: varchar('website',{length:255}),
  plan: planEnum('plan').default('free').notNull(),
  onboardingComplete: boolean('onboarding_complete').default(false).notNull(),
  complianceScore: integer('compliance_score').default(0).notNull(),
  lastScoreUpdate: timestamp('last_score_update'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organisations.id,{onDelete:'cascade'}),
  email: varchar('email',{length:255}).notNull().unique(),
  passwordHash: varchar('password_hash',{length:255}).notNull(),
  firstName: varchar('first_name',{length:100}).notNull(),
  lastName: varchar('last_name',{length:100}).notNull(),
  role: roleEnum('role').default('member').notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  avatarUrl: varchar('avatar_url',{length:500}),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
},(t)=>({ emailIdx: uniqueIndex('users_email_idx').on(t.email), orgIdx: index('users_org_idx').on(t.orgId) }));

export const informationOfficers = pgTable('information_officers', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organisations.id,{onDelete:'cascade'}),
  name: varchar('name',{length:255}).notNull(),
  email: varchar('email',{length:255}).notNull(),
  phone: varchar('phone',{length:50}),
  department: varchar('department',{length:100}),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const dataCategories = pgTable('data_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organisations.id,{onDelete:'cascade'}),
  name: varchar('name',{length:255}).notNull(),
  description: text('description'),
  sensitivity: dataSensitivityEnum('sensitivity').default('general').notNull(),
  lawfulBasis: lawfulBasisEnum('lawful_basis'),
  retentionPeriodDays: integer('retention_period_days'),
  thirdPartySharing: boolean('third_party_sharing').default(false).notNull(),
  thirdParties: json('third_parties').$type<string[]>().default([]),
  dataSubjects: json('data_subjects').$type<string[]>().default([]),
  purposeOfProcessing: text('purpose_of_processing'),
  technicalSafeguards: json('technical_safeguards').$type<string[]>().default([]),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
},(t)=>({ orgIdx: index('data_categories_org_idx').on(t.orgId) }));

export const consentRecords = pgTable('consent_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organisations.id,{onDelete:'cascade'}),
  categoryId: uuid('category_id').references(() => dataCategories.id,{onDelete:'set null'}),
  dataSubjectName: varchar('data_subject_name',{length:255}).notNull(),
  dataSubjectEmail: varchar('data_subject_email',{length:255}).notNull(),
  purpose: text('purpose').notNull(),
  status: consentStatusEnum('status').default('active').notNull(),
  consentedAt: timestamp('consented_at').notNull(),
  expiresAt: timestamp('expires_at'),
  withdrawnAt: timestamp('withdrawn_at'),
  ipAddress: varchar('ip_address',{length:45}),
  evidence: text('evidence'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
},(t)=>({ orgIdx: index('consent_org_idx').on(t.orgId) }));

export const breachIncidents = pgTable('breach_incidents', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organisations.id,{onDelete:'cascade'}),
  title: varchar('title',{length:500}).notNull(),
  description: text('description').notNull(),
  discoveredAt: timestamp('discovered_at').notNull(),
  occurredAt: timestamp('occurred_at'),
  severity: breachSeverityEnum('severity').default('medium').notNull(),
  status: breachStatusEnum('status').default('draft').notNull(),
  affectedDataSubjects: integer('affected_data_subjects').default(0).notNull(),
  affectedCategories: json('affected_categories').$type<string[]>().default([]),
  reportedToRegulator: boolean('reported_to_regulator').default(false).notNull(),
  reportedAt: timestamp('reported_at'),
  referenceNumber: varchar('reference_number',{length:100}),
  notifiedSubjects: boolean('notified_subjects').default(false).notNull(),
  rootCause: text('root_cause'),
  remediation: text('remediation'),
  reportedByUserId: uuid('reported_by_user_id').references(() => users.id,{onDelete:'set null'}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
},(t)=>({ orgIdx: index('breach_org_idx').on(t.orgId) }));

export const paiaRequests = pgTable('paia_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organisations.id,{onDelete:'cascade'}),
  requestorName: varchar('requestor_name',{length:255}).notNull(),
  requestorEmail: varchar('requestor_email',{length:255}).notNull(),
  requestorPhone: varchar('requestor_phone',{length:50}),
  requestType: varchar('request_type',{length:50}).notNull(),
  description: text('description').notNull(),
  status: paiaStatusEnum('status').default('received').notNull(),
  receivedAt: timestamp('received_at').notNull(),
  acknowledgedAt: timestamp('acknowledged_at'),
  dueDate: timestamp('due_date'),
  completedAt: timestamp('completed_at'),
  responseNotes: text('response_notes'),
  assignedToUserId: uuid('assigned_to_user_id').references(() => users.id,{onDelete:'set null'}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
},(t)=>({ orgIdx: index('paia_org_idx').on(t.orgId) }));

export const privacyPolicies = pgTable('privacy_policies', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organisations.id,{onDelete:'cascade'}),
  title: varchar('title',{length:255}).notNull(),
  content: text('content').notNull(),
  version: varchar('version',{length:20}).notNull().default('1.0'),
  status: policyStatusEnum('status').default('draft').notNull(),
  slug: varchar('slug',{length:255}).notNull(),
  aiGenerated: boolean('ai_generated').default(false).notNull(),
  publishedAt: timestamp('published_at'),
  reviewDate: date('review_date'),
  createdByUserId: uuid('created_by_user_id').references(() => users.id,{onDelete:'set null'}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
},(t)=>({ orgIdx: index('policies_org_idx').on(t.orgId), slugIdx: uniqueIndex('policies_slug_idx').on(t.slug) }));

export const complianceTasks = pgTable('compliance_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organisations.id,{onDelete:'cascade'}),
  title: varchar('title',{length:500}).notNull(),
  description: text('description'),
  category: varchar('category',{length:100}).notNull(),
  priority: taskPriorityEnum('priority').default('medium').notNull(),
  status: taskStatusEnum('status').default('pending').notNull(),
  dueDate: date('due_date'),
  completedAt: timestamp('completed_at'),
  assignedToUserId: uuid('assigned_to_user_id').references(() => users.id,{onDelete:'set null'}),
  createdByUserId: uuid('created_by_user_id').references(() => users.id,{onDelete:'set null'}),
  isCritical: boolean('is_critical').default(false).notNull(),
  isSystemGenerated: boolean('is_system_generated').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
},(t)=>({ orgIdx: index('tasks_org_idx').on(t.orgId) }));

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organisations.id,{onDelete:'cascade'}),
  userId: uuid('user_id').references(() => users.id,{onDelete:'set null'}),
  action: varchar('action',{length:255}).notNull(),
  resource: varchar('resource',{length:100}).notNull(),
  resourceId: varchar('resource_id',{length:255}),
  details: json('details').$type<Record<string,unknown>>(),
  ipAddress: varchar('ip_address',{length:45}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
},(t)=>({ orgIdx: index('audit_org_idx').on(t.orgId), createdIdx: index('audit_created_idx').on(t.createdAt) }));

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organisations.id,{onDelete:'cascade'}),
  userId: uuid('user_id').references(() => users.id,{onDelete:'cascade'}),
  type: notifTypeEnum('type').notNull(),
  title: varchar('title',{length:255}).notNull(),
  message: text('message').notNull(),
  link: varchar('link',{length:500}),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
},(t)=>({ userIdx: index('notif_user_idx').on(t.userId) }));

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id,{onDelete:'cascade'}),
  tokenHash: varchar('token_hash',{length:255}).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  revokedAt: timestamp('revoked_at'),
},(t)=>({ userIdx: index('refresh_user_idx').on(t.userId) }));

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id,{onDelete:'cascade'}),
  tokenHash: varchar('token_hash',{length:255}).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const teamInvitations = pgTable('team_invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organisations.id,{onDelete:'cascade'}),
  email: varchar('email',{length:255}).notNull(),
  role: roleEnum('role').default('member').notNull(),
  invitedByUserId: uuid('invited_by_user_id').references(() => users.id,{onDelete:'set null'}),
  tokenHash: varchar('token_hash',{length:255}).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
},(t)=>({ orgEmailIdx: uniqueIndex('invitation_org_email_idx').on(t.orgId, t.email) }));

export const organisationsRelations = relations(organisations, ({ many }) => ({
  users: many(users), dataCategories: many(dataCategories), consentRecords: many(consentRecords),
  breachIncidents: many(breachIncidents), paiaRequests: many(paiaRequests),
  privacyPolicies: many(privacyPolicies), complianceTasks: many(complianceTasks),
  auditLogs: many(auditLogs), notifications: many(notifications), informationOfficers: many(informationOfficers),
}));
export const usersRelations = relations(users, ({ one }) => ({
  organisation: one(organisations, { fields: [users.orgId], references: [organisations.id] }),
}));
