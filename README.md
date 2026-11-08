# Local Service Finder Platform

A modern web application where customers discover, compare, and contact local service providers and businesses.

## Tech Stack
- **Framework:** Next.js App Router (TypeScript, Node.js LTS)
- **Database & Backend:** Supabase (PostgreSQL with Row Level Security, Auth, Storage)
- **Styling:** Tailwind CSS + Lucide React
- **Validation:** Zod schemas

## Getting Started

### 1. Environment Setup
Copy `.env.example` to `.env.local` and configure your Supabase project credentials:
```bash
cp .env.example .env.local
```
Fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2. Database Migrations
Run the initial schema migration located in `supabase/migrations/01_initial_schema.sql` in your Supabase SQL Editor. This initializes all tables, RLS policies, triggers, and seed categories.

### 3. Run Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## Team & Branches
- `main` — Stable integrated release
- `feature/customer` — Member 1: Customer discovery, search, listings, reviews, and enquiries
- `feature/business` — Member 2: Business portal, owner onboarding, services, photos, hours, and enquiry management
- `feature/admin` — Member 3: Platform governance, approvals, categories, and moderation
