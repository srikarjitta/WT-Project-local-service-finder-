# TECH_STACK.md — Local Service Finder Platform

This file is the shared technical agreement for all three developers and all AI/vibe-coding agents.

## 1. Golden rule: inspect before changing

The current GitHub repository is the source of truth. Before implementation, inspect:
- `README.md`
- frontend and backend `package.json`
- current source folders and routes
- current database connection/schema/models
- authentication and role handling
- `.gitignore` and environment examples

**Do not migrate frameworks, databases, auth providers, or major package versions just because an AI agent suggests it.** Keep the working stack already present in the repository. If the repo has no established backend/database, the team must agree once on the default below and record the decision here before coding.

## 2. Confirmed Project Stack (Agreed in Final Development Plan)

The team has officially agreed and finalized the stack as documented in `Local-Service-Finder-Final-Development-Plan.md`:

| Layer | Confirmed Choice |
|---|---|
| Framework & Runtime | Next.js App Router (Node.js LTS runtime) |
| Language | TypeScript |
| Routing | Next.js App Router (`src/app`) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend & API | Next.js Route Handlers (`src/app/api/...`) & Server Actions (No separate Express server needed for MVP) |
| API style | REST, JSON with Zod validation |
| Database | Supabase PostgreSQL with Row Level Security (RLS) |
| Database access | Supabase Client (`@supabase/supabase-js`, `@supabase/ssr`) |
| Authentication | Supabase Auth (`auth.users` linked to `public.profiles`) |
| Image storage | Supabase Storage (`business-images` bucket) |
| Version control | Git + GitHub |
| Deployment | Vercel (Frontend/API) + Supabase (Database/Auth/Storage) |

## 3. Application roles

Use exactly these application roles unless the existing implementation requires a compatible mapping:
- `customer`
- `business_owner`
- `admin`

Role checks must happen on the backend. Hiding a button in the frontend is not authorization.

## 4. Main feature modules

- `auth`: register, login, current user, logout/session handling
- `users`: customer and owner account information
- `businesses`: listing, profile, status, verification
- `categories`: category/subcategory data
- `services`: services offered by a business
- `enquiries`: customer enquiries and owner status updates
- `reviews`: ratings, comments, moderation status
- `favorites`: customer saved businesses
- `admin`: approvals, user management, moderation, reports, statistics

Keep modules separated by feature. Avoid a giant component, controller, or route file.

## 5. Database design rules

Core entities:
- `users`
- `businesses`
- `categories`
- `business_services`
- `business_images`
- `business_hours`
- `enquiries`
- `reviews`
- `favorites`
- `reports`

Relationships:
- One user (business owner) can own many businesses.
- One category can contain many businesses; categories may have a parent category.
- One business can have many services, images, hours, enquiries, and reviews.
- One customer can create many enquiries and reviews.
- Customers and businesses have a many-to-many favourite relationship through `favorites`.

Rules:
- Use primary keys, foreign keys/references, and indexes for common filters.
- Unique email; unique customer/business favourite pair.
- Hash passwords; never store plain-text passwords.
- Store image URLs, not image binaries, in business records.
- Rating must be 1–5 and validated server-side.
- Business owners can edit only businesses they own.
- Customers can access only their own private enquiries.
- Admin actions must be protected by an admin role check.
- Use statuses for pending/approved/rejected/suspended records and enquiry lifecycle.
- Do not trust role, owner ID, verification status, or price values sent by the browser without server-side validation.

## 6. API conventions

- Base prefix: `/api`
- JSON request and response bodies.
- Use consistent HTTP status codes.
- Return predictable responses:

Success:
```json
{ "success": true, "data": {}, "message": "Success" }
```

Error:
```json
{ "success": false, "message": "A clear error message" }
```

- Keep endpoint names and request/response shapes in `docs/API.md`.
- If an API contract changes, notify all members before merging.

## 7. Frontend conventions

- Use the existing app router and shared API client.
- Organize pages/components by feature (`customer`, `business`, `admin`).
- Shared UI goes in the shared components folder.
- Reuse shared `Button`, `Input`, `SearchBar`, `BusinessCard`, `Rating`, `Badge`, `Modal`, `Loading`, and `EmptyState`.
- Every data screen should handle loading, error, empty, and success states.
- Responsive design is mandatory.
- Use 3D/animation sparingly and keep performance/accessibility in mind.
- Do not hardcode API data in production screens; seed demo data in the database.

## 8. Dependency rules

- Do not independently upgrade React, Vite, Express, database drivers, router, or major dependencies.
- Do not install a package without telling the team and explaining why.
- Commit the relevant package manifest and lockfile together when a dependency is approved.
- All members use the same Node.js major version (record it in README or `.nvmrc` if appropriate).
- Use the package manager and lockfile already present in the repository.

## 9. Environment and secrets

- Commit `.env.example` with variable names and safe placeholders only.
- Never commit `.env`, API secrets, database passwords, JWT secrets, or private keys.
- Keep `.env` in `.gitignore`.
- Each developer creates their own local `.env`.
- Never paste secrets into AI prompts, commits, screenshots, or public issue reports.

Example placeholders (adapt to the actual project):
```env
PORT=5000
DATABASE_URL=
JWT_SECRET=
CLIENT_ORIGIN=http://localhost:5173
```

## 10. Git branches

Long-lived branches:
- `main` — stable and tested only
- `feature/customer` — Member 1
- `feature/business` — Member 2
- `feature/admin` — Member 3

No direct commits to `main`. Push work to the assigned branch and create a Pull Request into `main`. Review, test, then merge. Do not force-push shared branches.

## 11. AI / vibe-coding agent instruction

Paste this at the start of every coding task:

> Read `README.md` and `TECH_STACK.md` first. Inspect the existing code before editing. Preserve the current framework, database, authentication, routing, dependency versions, and established conventions. Work only on the assigned feature. Reuse shared components, API clients, types, and styles. Do not edit another member's module or shared files without approval. Do not add dependencies without approval. Never hardcode secrets or commit `.env`. Enforce server-side validation, authentication, role and ownership checks. Make the UI responsive and handle loading/error/empty states. Run the relevant checks and report exactly which files changed, what was tested, and what remains.

## 12. Change-control rule

Any change to the database schema, authentication, API contract, routing, global styles, shared components, or dependencies must be discussed in the team chat before implementation. Update this file and relevant docs after the team agrees.
