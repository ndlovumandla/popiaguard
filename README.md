# 🛡️ POPIAGuard

> **POPIA Compliance Management Platform for South African SMEs**

POPIAGuard is a full-stack web application that helps South African businesses comply with the **Protection of Personal Information Act (POPIA)** — South Africa's data protection law. It provides a centralised dashboard to manage data inventories, consent records, breach incidents, access requests, privacy policies, and compliance tasks.

---

## 📋 Table of Contents

1. [What is POPIA?](#what-is-popia)
2. [Why You Need This](#why-you-need-this)
3. [Features Overview](#features-overview)
4. [Tech Stack](#tech-stack)
5. [Pages & How They Help Compliance](#pages--how-they-help-compliance)
   - [Dashboard](#1-dashboard)
   - [Data Inventory](#2-data-inventory)
   - [Consent Manager](#3-consent-manager)
   - [Breach Register](#4-breach-register)
   - [PAIA Requests](#5-paia-requests)
   - [Privacy Policy](#6-privacy-policy)
   - [Compliance Tasks](#7-compliance-tasks)
   - [Reports & Analytics](#8-reports--analytics)
   - [Audit Log](#9-audit-log)
   - [Team Management](#10-team-management)
   - [Settings](#11-settings)
6. [Compliance Score](#compliance-score)
7. [Prerequisites](#prerequisites)
8. [Installation & Setup](#installation--setup)
9. [Environment Variables](#environment-variables)
10. [Database Setup](#database-setup)
11. [Running the App](#running-the-app)
12. [Using Ollama (AI Policy Generator)](#using-ollama-ai-policy-generator)
13. [Project Structure](#project-structure)
14. [Security Features](#security-features)

---

## What is POPIA?

**POPIA** (Protection of Personal Information Act 4 of 2013) is South Africa's comprehensive data privacy law — similar to Europe's GDPR. It came into full effect on **1 July 2021** and applies to **any organisation** that collects, stores, or processes personal information about South African residents.

### Key obligations under POPIA:

| Obligation | What it means for your business |
|---|---|
| **Lawful processing** | You must have a valid legal reason to collect personal data |
| **Purpose specification** | Data may only be collected for a specific, defined purpose |
| **Information Officer** | Every organisation must designate a responsible person |
| **Data subject rights** | People can access, correct, or delete their data |
| **Security safeguards** | You must protect data against loss, theft, or unauthorised access |
| **Breach notification** | You must report breaches to the Information Regulator within 72 hours |
| **Privacy policy** | You must tell people what data you collect and why |

### Penalties for non-compliance:
- Fines up to **R10 million**
- Imprisonment up to **10 years**
- Civil claims from affected individuals

---

## Why You Need This

Managing POPIA compliance manually with spreadsheets is error-prone and time-consuming. POPIAGuard gives you:

- ✅ A **live compliance score** showing exactly where you stand
- ✅ **Automated reminders** for PAIA deadlines and task due dates
- ✅ A **complete audit trail** of every action taken
- ✅ **AI-generated privacy policies** tailored to your business
- ✅ **Multi-user support** with role-based access control
- ✅ Evidence documentation for regulatory audits

---

## Features Overview

- 🔐 **Secure authentication** — JWT-based login with refresh tokens, bcrypt password hashing
- 📊 **Live compliance score** — 0–100 score calculated across 8 compliance dimensions
- 🗃️ **Data inventory** — Document all personal information your organisation processes
- ✅ **Consent management** — Track and withdraw consent records
- 🚨 **Breach register** — Log incidents and track regulatory reporting
- 📬 **PAIA request tracking** — Manage access-to-information requests with auto due dates
- 📄 **Privacy policy builder** — Create or AI-generate POPIA-compliant policies
- ✔️ **Task management** — Assign and track compliance obligations
- 📈 **Reports & charts** — Visual analytics on your compliance posture
- 🔍 **Immutable audit log** — Full history of all actions for regulatory evidence
- 👥 **Team management** — Invite colleagues with role-based permissions
- 🤖 **AI integration** — Generate privacy policies using local Ollama (Llama 3, Mistral, etc.)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v3 + Radix UI primitives |
| Database | PostgreSQL (local or [Neon](https://neon.tech) cloud) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Auth | Custom JWT (jose) + bcryptjs |
| State | TanStack Query v5 |
| Charts | Recharts |
| AI | Ollama (local LLM — Llama 3, Mistral, etc.) |
| Notifications | Sonner toast |

---

## Pages & How They Help Compliance

### 1. Dashboard

**URL:** `/dashboard`

The central hub showing your organisation's overall compliance health at a glance.

**What you'll see:**
- **Compliance Score** — a radial gauge from 0–100 showing how compliant you are right now
- **6 stat cards** — quick counts of data categories, consent records, open breaches, PAIA requests, pending tasks, and team members
- **Upcoming tasks** — the next 5 tasks due, with priority badges

**How it helps compliance:**
The dashboard gives you an instant snapshot of risk areas. A low score highlights exactly which POPIA obligations you haven't met yet. The task widget ensures you never miss a deadline that could lead to a regulatory fine.

---

### 2. Data Inventory

**URL:** `/data-inventory`

A register of all categories of personal information your organisation collects and processes.

**What you can do:**
- Add data categories (e.g. "Customer Email Addresses", "Employee ID Numbers")
- Set **sensitivity level** — General, Special (e.g. health, race, religion), or Children's data
- Document the **lawful basis** for processing (consent, contract, legal obligation, etc.)
- Set **retention periods** — how long you keep the data
- Record **third-party sharing** and data subjects

**How it helps compliance:**

Under POPIA Section 13, you must be able to demonstrate you have a **lawful basis** for every category of personal information you process. This register is your primary evidence document if the Information Regulator audits you. Special categories of data (health, biometrics, racial origin) require extra protections and are flagged with warning badges.

---

### 3. Consent Manager

**URL:** `/consent-manager`

A log of all consent obtained from data subjects (customers, employees, website visitors, etc.).

**What you can do:**
- Record when someone gave consent, what they consented to, and when it expires
- Capture evidence (e.g. a reference to a form submission or signed document)
- **Withdraw consent** with one click — instantly records the withdrawal timestamp
- Filter by active, withdrawn, and expired consent

**How it helps compliance:**

POPIA Section 11 requires that when consent is your lawful basis, it must be **freely given, specific, informed, and unambiguous**. You must also be able to prove consent was given and honour withdrawal requests immediately. This module creates a tamper-evident audit trail of every consent event.

---

### 4. Breach Register

**URL:** `/breach-register`

A log of all data security incidents and breaches.

**What you can do:**
- Log a breach with title, description, severity (Low/Medium/High/Critical), and the number of affected data subjects
- Track the breach through statuses: Draft → Under Review → Reported → Closed
- Mark a breach as **reported to the Information Regulator** with the reference number
- Record root cause and remediation steps

**How it helps compliance:**

POPIA Section 22 requires you to notify the **Information Regulator** and affected data subjects "as soon as reasonably possible" after discovering a breach (widely interpreted as within 72 hours for serious breaches). This register gives you a documented paper trail proving you took appropriate action and reported timeously.

---

### 5. PAIA Requests

**URL:** `/paia-requests`

A tracker for requests received under the **Promotion of Access to Information Act (PAIA)**.

**What you can do:**
- Log requests from data subjects who want to access, correct, or delete their personal information
- Track request type: Access, Correction, Deletion, or Objection
- The system **automatically calculates the 30-day response due date**
- Update status as you work: Received → Acknowledged → In Progress → Granted/Refused
- Due dates turn **red** when overdue

**How it helps compliance:**

Under POPIA and PAIA, data subjects have the right to access their personal information. You are legally required to respond within **30 days**. Missing this deadline is a direct POPIA violation.

---

### 6. Privacy Policy

**URL:** `/privacy-policy`

Create, manage, and publish your organisation's privacy policy. Includes an **AI-powered generator**.

**What you can do:**
- Write a policy manually or use AI to generate one from your data inventory
- Save as draft and publish when ready
- Get a **public URL** (e.g. `/policy/acme-privacy-policy`) to link from your website

**How it helps compliance:**

POPIA Section 18 requires you to inform data subjects about how their data is used. A published privacy policy is the standard way to do this. The AI generator reads your actual data inventory to create a tailored, legally-structured policy.

---

### 7. Compliance Tasks

**URL:** `/tasks`

A task manager for compliance obligations.

**What you can do:**
- Create tasks with title, category, priority (Critical/High/Medium/Low), and due date
- Mark tasks as complete with one click
- Mark tasks as Critical — these affect your compliance score directly

**How it helps compliance:**

POPIA compliance is ongoing — annual policy reviews, staff training, consent renewals. This tracker ensures nothing is forgotten and provides audit evidence of completed obligations.

---

### 8. Reports & Analytics

**URL:** `/reports`

Visual charts and graphs showing your compliance posture across all modules.

- **Compliance score breakdown** — which pillars pass and which need work
- **Consent status pie chart** — active vs withdrawn at a glance
- **Breach status bar chart** — visualise your incident history

---

### 9. Audit Log

**URL:** `/audit-log`

An immutable, chronological record of every action taken in the system.

- Records: who did what, when, from which IP address
- Cannot be edited or deleted
- Essential evidence for regulatory investigations

---

### 10. Team Management

**URL:** `/team`

Invite colleagues with role-based access:

| Role | Access |
|---|---|
| **Owner** | Full access, can delete organisation |
| **Admin** | Full compliance management, can invite members |
| **Member** | Can create and edit records |
| **Viewer** | Read-only (good for auditors) |

---

### 11. Settings

**URL:** `/settings`

Manage your organisation's profile — name, registration number, industry, size, and website. This information is used in generated privacy policies and compliance reports.

---

## Compliance Score

The compliance score (0–100) is calculated automatically:

| Pillar | Points | Condition |
|---|---|---|
| Data Inventory | 15 | At least one active data category documented |
| Lawful Basis | 10 | Data categories have lawful basis documented |
| Information Officer | 15 | An Information Officer has been designated |
| Privacy Policy | 15 | A privacy policy is published |
| Consent Records | 10 | At least one consent record exists |
| Breach Management | 15 | No unresolved breach incidents |
| PAIA Compliance | 10 | No overdue PAIA requests |
| Critical Tasks | 10 | All critical tasks are completed |
| **Total** | **100** | |

**Score interpretation:**
- 🔴 0–49 — High risk, urgent action needed
- 🟡 50–79 — Moderate compliance, gaps to address
- 🟢 80–100 — Strong compliance posture

---

## Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org)
- **PostgreSQL 14+** — [Download](https://www.postgresql.org/download/) OR free [Neon](https://neon.tech) cloud DB
- **Git** — [Download](https://git-scm.com)
- **Ollama** (optional, for AI policy generation) — [Download](https://ollama.com)

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/ndlovumandla/popiaguard.git
cd popiaguard
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your database URL and JWT secrets.

### 4. Create the database

**Local PostgreSQL:**
```bash
psql -U postgres -c "CREATE DATABASE popiaguard;"
```

**Neon (cloud — free tier):**
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string into `DATABASE_URL` in your `.env.local`

### 5. Push the database schema

```bash
npm run db:push
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and register your account.

### 7. Complete onboarding

1. Click **"Register free"**
2. Fill in your name, organisation name, email, and password
3. Complete the **onboarding wizard** — add your organisation details and Information Officer
4. You'll land on the Dashboard with your initial compliance score

---

## Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/popiaguard

# JWT Secrets (use long random strings)
JWT_ACCESS_SECRET=replace-with-any-random-32-char-string
JWT_REFRESH_SECRET=replace-with-a-different-random-32-char-string

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Ollama (AI policy generation)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# Email (optional)
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

> ⚠️ **Never commit `.env.local` to git.** It is already in `.gitignore`.

---

## Database Setup

```bash
npm run db:push      # Push schema to the database
npm run db:studio    # Open visual DB browser at localhost:4983
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migration files
```

---

## Running the App

```bash
npm run dev       # Development (hot reload) → http://localhost:3000
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run linter
```

---

## Using Ollama (AI Policy Generator)

```bash
# Install Ollama from https://ollama.com
ollama pull llama3
ollama serve
```

Then on the Privacy Policy page, click **"AI Generate"** — it reads your data inventory, Information Officer, and organisation details to produce a POPIA-compliant policy.

---

## Project Structure

```
popiaguard/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login, Register, Forgot Password
│   │   ├── (app)/               # Protected app pages
│   │   │   ├── dashboard/
│   │   │   ├── data-inventory/
│   │   │   ├── consent-manager/
│   │   │   ├── breach-register/
│   │   │   ├── paia-requests/
│   │   │   ├── privacy-policy/
│   │   │   ├── tasks/
│   │   │   ├── reports/
│   │   │   ├── audit-log/
│   │   │   ├── team/
│   │   │   └── settings/
│   │   ├── api/                 # API route handlers
│   │   ├── onboarding/          # First-time setup wizard
│   │   └── policy/[slug]/       # Public privacy policy page
│   ├── components/
│   │   ├── layout/              # Sidebar, Header, Providers
│   │   └── ui/                  # Button, Input, Card, Dialog, etc.
│   ├── db/
│   │   ├── schema.ts            # Drizzle schema (all tables)
│   │   └── index.ts             # Database connection
│   ├── lib/
│   │   ├── jwt.ts               # Token sign/verify
│   │   ├── auth-helpers.ts      # withAuth() middleware helper
│   │   ├── audit.ts             # logAudit() helper
│   │   ├── compliance-score.ts  # Score calculation engine
│   │   └── validations.ts       # Zod schemas
│   └── middleware.ts            # JWT route protection
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── .env.example
└── package.json
```

---

## Security Features

- **JWT authentication** with 15-minute access tokens and 7-day refresh tokens
- **bcrypt** password hashing (cost factor 12)
- **HttpOnly cookies** — tokens never accessible via JavaScript
- **Middleware route protection** — all app routes require a valid token
- **Organisation isolation** — every DB query is scoped to the user's `orgId`
- **Immutable audit log** — tamper-evident record of all actions
- **Zod validation** on all API inputs

---

## License

MIT © [ndlovumandla](https://github.com/ndlovumandla)

---

<p align="center">Built for South African businesses to achieve POPIA compliance with confidence.</p>
