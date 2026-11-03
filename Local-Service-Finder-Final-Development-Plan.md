# Local Service Finder Platform — Final Development Plan

**Final stack:** Next.js + TypeScript + Node.js runtime + Supabase (PostgreSQL, Auth, Storage)  
**Team:** 3 developers  
**Project type:** College minor project

## 1. Project goal

Create a responsive web platform where customers discover, compare and contact nearby local businesses/service providers. Local businesses can create and manage a digital listing without having to build and maintain their own software.

The concept is inspired by local business directories such as Justdial, but the team will create its own product identity, UI, content and implementation.

## 2. Final technology decision

The team has confirmed the syllabus-aligned stack:

- Next.js App Router + React + TypeScript
- Node.js LTS runtime
- Tailwind CSS, shadcn/ui where useful, Lucide React
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Zod for validation
- Git + GitHub
- Vercel + Supabase deployment

**Architecture decision:** Do not add a separate Express server for the MVP. Next.js runs on Node.js and provides Route Handlers for API endpoints. This keeps the project simpler while still using Node.js. A separate Express service is not needed unless a later requirement justifies it.

The uploaded starter is an early prototype using a different stack. Reuse its useful screens, business flows, requirements and naming as reference, but rebuild the final application on the agreed stack. Do not run the old FastAPI/SQLite backend as part of the final architecture.

## 3. User roles and core journeys

### Customer
- Browse categories and service providers.
- Search by service/business name and locality.
- Filter results by category, rating, verification and availability where supported.
- View business details, services, photos, address and hours.
- Call, open WhatsApp, or send an enquiry.
- Save favourites and submit reviews.
- View own enquiries.

### Business owner
- Register/sign in as a business owner.
- Create and edit business profile.
- Add services, indicative prices, photos and opening hours.
- Submit listing for admin approval.
- View enquiries and update their status.
- View basic listing/enquiry statistics.

### Admin
- View platform overview.
- Manage users and categories.
- Approve, reject or suspend businesses.
- Moderate reviews and reports.
- View basic counts and activity.

## 4. Feature scope

### MVP — must complete

**Customer**
1. Responsive landing page and search.
2. Category browsing.
3. Business search by keyword/category/city/locality.
4. Listing cards and business detail page.
5. Filters and sorting.
6. Contact, WhatsApp and enquiry actions.
7. Customer authentication.
8. Favourites.
9. Reviews and ratings.
10. Customer enquiry history.

**Business**
1. Business-owner authentication/role.
2. Business profile create/edit.
3. Services CRUD.
4. Image upload.
5. Opening hours.
6. Enquiry inbox.
7. Enquiry status updates.
8. Listing approval status display.

**Admin**
1. Protected admin dashboard.
2. User/business listing views.
3. Business approval/rejection/suspension.
4. Category management.
5. Review/report moderation.
6. Basic platform statistics.

### Add only after MVP is stable
- Map view and nearby sorting.
- Appointment request.
- Offers/deals.
- Business analytics.
- Recently viewed.
- Search suggestions.
- Featured businesses.

### Future scope
Payments/subscriptions, complex booking engine, real-time chat, AI recommendations, mobile apps and advanced CRM. Do not let these delay the MVP.

## 5. Equal team division

Each member owns their complete module: UI, data access/API integration, validation and testing.

| Member | Branch | Ownership | Work |
|---|---|---|---|
| Member 1 | `feature/customer` | Customer experience | Home, search, categories, filters, business results/details, favourites, customer enquiries, reviews |
| Member 2 | `feature/business` | Business portal | Owner onboarding, business profile, services, photos, hours, enquiry inbox/status, basic business stats |
| Member 3 | `feature/admin` | Admin/platform governance | Admin dashboard, users, categories, business verification, reports, review moderation, platform stats |

### Shared work
All members work together on:
- Repository migration and Next.js setup.
- Supabase project configuration.
- Database schema and RLS policies.
- Shared authentication and role model.
- Shared UI design system and components.
- Integration testing, documentation and demo preparation.

Do not assign all backend/database work to one member. Each member implements their own module against the agreed shared database/API contracts.

## 6. Database baseline

Use Supabase PostgreSQL tables:

- `profiles` — authenticated user's profile and role.
- `categories` — categories and optional subcategories.
- `businesses` — owner, category, description, contact, address, locality, coordinates, status, verification.
- `business_services` — services and indicative price range.
- `business_images` — storage paths/URLs.
- `business_hours` — weekly opening hours.
- `enquiries` — customer-to-business requests and lifecycle status.
- `reviews` — rating/comment and moderation status.
- `favorites` — saved businesses.
- `reports` — reports against businesses/reviews.

Use UUIDs, foreign keys, indexes, timestamps, unique constraints and RLS. Passwords are managed by Supabase Auth; do not store passwords in `profiles`. Store image files in Supabase Storage, not as binary data in PostgreSQL.

### Key security rules
- Public users can read only approved/active business listings and public categories.
- Customers can create/read only their own enquiries, reviews and favourites as permitted by product rules.
- Business owners can update only businesses they own and manage only their related services/images/hours/enquiries.
- Admin operations require server-side admin authorization.
- Apply RLS to exposed tables.
- Never expose the Supabase service-role key to browser code.

## 7. API/data-access approach

Use Next.js Route Handlers (`src/app/api/.../route.ts`) for REST endpoints where needed. Use Server Components for suitable server-side reads and Server Actions for suitable form mutations. Keep business logic in feature services and validate inputs with Zod.

Example endpoint groups:
- `/api/businesses`
- `/api/categories`
- `/api/enquiries`
- `/api/reviews`
- `/api/favorites`
- `/api/admin/...`

Document request/response shapes in `docs/API.md`. Avoid building duplicate APIs for the same operation.

## 8. UI direction

- Search-first landing page.
- Clean modern marketplace layout.
- Attractive business and category cards.
- Clear business detail pages with contact actions.
- Separate customer, business and admin dashboards.
- Consistent typography, colours, spacing and reusable components.
- Responsive mobile-first layouts.
- Subtle hover and page animations.
- A small number of tasteful 3D hero elements; avoid heavy 3D on every page.
- Loading, empty, error and success states on all data-driven screens.

Shared components should include: Navbar, Footer, Button, Input, SearchBar, BusinessCard, CategoryCard, Rating, Badge, Modal, Loading, EmptyState and Pagination.

## 9. Git workflow for beginners

### Terms
- **Clone:** download the repository to your computer.
- **Branch:** an isolated line of work for a feature/module.
- **Commit:** save a checkpoint of your local changes.
- **Push:** upload your commits to GitHub.
- **Pull:** download and integrate remote changes.
- **Pull Request (PR):** request review and merge into another branch.
- **Merge:** combine reviewed changes.

### Branches
- `main` — stable integrated version.
- `feature/customer` — Member 1.
- `feature/business` — Member 2.
- `feature/admin` — Member 3.

### One-time clone (each member)

```bash
git clone <repository-url>
cd <repository-folder>
npm install
```

### Team lead creates/publishes feature branches

```bash
git switch main
git pull origin main

git switch -c feature/customer
git push -u origin feature/customer

git switch main
git switch -c feature/business
git push -u origin feature/business

git switch main
git switch -c feature/admin
git push -u origin feature/admin

git switch main
```

If a branch already exists on GitHub, do not recreate it; fetch and check it out instead.

### Daily workflow (example: Member 1)

```bash
git switch feature/customer
git pull origin feature/customer

# Make changes and test

git status
git add .
git commit -m "feat(customer): add business search"
git push origin feature/customer
```

Other members use their assigned branch.

### Keep branch updated with main

```bash
git fetch origin
git switch feature/customer
git merge origin/main
```

Resolve conflicts carefully, run tests, then push. For beginners, use merge rather than rebase. Never force-push shared branches.

### Pull Request
1. Push your assigned branch.
2. GitHub → Pull requests → New pull request.
3. Base: `main`; compare: your feature branch.
4. Describe changes and tests.
5. Another member reviews.
6. Team lead approves and merges.
7. Test the integrated `main` branch.

Never commit directly to `main`. Never merge untested code.

## 10. Shared vibe-coding rules

Every member must read `TECH_STACK.md` and give it to their AI coding agent.

Use this prompt:

> Read README.md and TECH_STACK.md before editing. This project uses Next.js App Router, TypeScript, Node.js runtime and Supabase PostgreSQL/Auth/Storage. Inspect the existing repository first. Work only on my assigned feature. Do not introduce Express, another database, another authentication provider, or a different framework without team approval. Reuse shared components, types, validation schemas and Supabase clients. Do not edit another member's module or shared files without approval. Do not add dependencies without approval. Never expose secrets or the Supabase service-role key in client code. Enforce server-side authentication, role/ownership checks, input validation and RLS. Make the UI responsive and handle loading, empty and error states. Run relevant checks and report changed files, tests and integration requirements. Do not claim a feature works unless tested.

Any change to schema, RLS, auth, API contract, global styles, shared components or core dependencies must be discussed by all three members first.

## 11. Milestones

### M1 — Inspect and migrate foundation
- [ ] Confirm the existing repository and useful prototype features.
- [ ] Create a migration branch or preserve the starter in Git history.
- [ ] Set up Next.js App Router + TypeScript.
- [ ] Configure Tailwind and shared UI foundations.
- [ ] Create Supabase project and environment configuration.
- [ ] Add `TECH_STACK.md`, `.env.example`, README and `.gitignore`.

### M2 — Database and authentication
- [ ] Create SQL migrations and seed data.
- [ ] Create profiles and roles.
- [ ] Configure Supabase Auth.
- [ ] Implement protected routes and server-side role checks.
- [ ] Write and test RLS policies.
- [ ] Test customer, business-owner and admin access separately.

### M3 — Shared UI and integration contracts
- [ ] Agree design tokens and shared components.
- [ ] Agree route structure and data types.
- [ ] Document database and API contracts.
- [ ] Publish three feature branches.

### M4 — Parallel module development
- [ ] Member 1 completes customer discovery and engagement.
- [ ] Member 2 completes business management.
- [ ] Member 3 completes admin governance.
- [ ] Each member tests and submits small PRs.

### M5 — Integration and quality
- [ ] Merge reviewed PRs.
- [ ] Test customer → business owner → admin journey.
- [ ] Test access control and RLS.
- [ ] Test mobile layout, loading, errors and empty states.
- [ ] Fix defects before optional features.

### M6 — Submission and deployment
- [ ] Add realistic seed/demo data.
- [ ] Prepare demo accounts without committing passwords.
- [ ] Complete README setup guide.
- [ ] Prepare ER diagram, architecture diagram, use-case diagram and test cases.
- [ ] Deploy Next.js app and Supabase project if available.
- [ ] Rehearse the final demonstration.

## 12. Definition of done

A feature is complete only when:
- Its UI is responsive and consistent.
- It reads/writes real Supabase data.
- Authentication and role/ownership checks work server-side.
- RLS is tested for the relevant table.
- Input validation and error states exist.
- The feature owner has tested it.
- Another member has reviewed it.
- It is merged into `main` through a Pull Request.

## 13. Final demo flow

1. Customer searches for a service in a locality.
2. Customer filters and opens a business profile.
3. Customer sends an enquiry and saves the business.
4. Business owner signs in, sees the enquiry and updates its status.
5. Admin approves a pending business and moderates a report/review.
6. Demonstrate responsive mobile screens and explain the database relationships.

**Final success criterion:** a customer can discover and contact a listed business; a business owner can manage their listing and enquiries; an admin can govern the platform. Complete this end-to-end workflow before optional features.
