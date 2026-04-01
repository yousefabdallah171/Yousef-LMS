# Implementation Plan: Yousef LMS v1.0

**Branch**: `001-yousef-lms` | **Date**: 2026-04-01 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/001-yousef-lms/spec.md`

---

## Summary

Build a complete, production-ready Arabic-first Learning Management System for Yousef Abdallah. A single instructor can create courses organized into sections and lessons, publish them, and manage student enrollments through a manual payment workflow (students upload proof images; admin approves). Students can browse a public catalog, preview the first 5 lessons of any course without login, and access paid lessons after enrollment. The platform supports comments, personal student dashboards, and a separate admin panel for content and order management. Full RTL layout and dark/light mode toggle on every page. All UI in Arabic, no English strings visible to users.

**Technical approach**: Full-stack TypeScript (React 18 frontend, Node.js/Express backend). Monorepo with /client, /server, /shared. PostgreSQL database with Prisma ORM. Redis for auth rate limiting and refresh token management. Cloudflare R2 for proof image storage. Vercel for frontend, Railway for backend, Supabase for DB. 4-phase build (Weeks 1–2: Foundation; Weeks 3–4: Enrollment; Weeks 5–6: Admin & Polish; Weeks 7–8: Launch). Minimal team (2–3 developers), focus on simplicity and maintainability.

---

## Technical Context

**UI source of truth**: Implement every page from the Stitch exports under `/stitch`. Use each `code.html` file as the primary structural reference, each `screen.png` as the visual verification reference, and `stitch/obsidian_logic/DESIGN.md` as the system-wide style guide. Do not redesign the exported pages during React conversion.

**Language/Version**: TypeScript + Node.js 20 (backend), React 18 (frontend)

**Primary Dependencies**:
- **Frontend**: React 18, Vite, Tailwind CSS, react-router v6, TanStack Query v5, React Hook Form, Zod, Axios, react-i18next
- **Backend**: Express, Prisma ORM, Zod, bcrypt, jsonwebtoken, Multer, Pino, express-rate-limit, node-cron, Resend (email)
- **Shared**: Zod (validation schemas), TypeScript types for API contracts
- **Platform/DevOps**: Docker, Docker Compose, multi-stage container images for local run and deployment parity

**Storage**: PostgreSQL 15 (primary), Redis (auth/rate limiting), Cloudflare R2 (proof images)

**Testing**: 
- Frontend: Vitest (unit), no E2E in v1 (manual QA only)
- Backend: Vitest (unit), Supertest (integration)
- Minimum coverage: 70% on backend business logic

**Target Platform**: Web (desktop + mobile responsive at 320px minimum)

**Project Type**: Full-stack SaaS web application (multi-user LMS with role-based access)

**Performance Goals**:
- Page load < 2 seconds (P75)
- API response < 500ms (P95)
- Error rate < 0.1%
- Support 500 concurrent users
- Handle 1000 enrollments/day

**Constraints**:
- 8-week timeline to production launch (2026-04-01 to 2026-05-27)
- Small team (2–3 developers)
- Arabic-first, RTL non-negotiable
- No hardcoded left/right values in CSS
- Dark/light mode on every surface
- Manual payment workflow only (no automated gateways in v1)
- All admin actions must be auditable
- Stitch exports are canonical for layout, spacing, hierarchy, surfaces, and component styling
- Additional states must extend the same exported visual language rather than introducing a new design language
- Local development must be runnable through Docker Compose with minimal manual machine setup
- Deployment should use the same containerized application structure as local development where practical

**Scale/Scope**:
- ~94 functional requirements
- ~10 user stories (8 P1, 2 P2)
- 8 core entities (Users, Courses, Sections, Lessons, Orders, Enrollments, Comments, AuditLogs)
- 2 roles (admin, student)
- Single-instructor platform (no multi-vendor)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle Alignment

✅ **I. Arabic-First, RTL Design (NON-NEGOTIABLE)**
- React app uses react-i18next with single ar.json locale file; no English strings in components
- RTL via CSS logical properties throughout (margin-inline-start, padding-inline-end, text-align: start)
- Icons mirrored via CSS (Tailwind directives or custom CSS for SVGs)
- Validated on every feature before done ✓

✅ **II. Dark & Light Mode (NON-NEGOTIABLE)**
- Tailwind dark mode class-based strategy on `<html>`
- Theme preference from localStorage, applied before first paint
- CSS variables for all colors, no hardcoded values
- Both themes pass WCAG AA contrast ✓

✅ **III. Manual Payment Workflow (SCOPE BOUNDARY)**
- Students upload proof (JPG/PNG/PDF, max 5MB)
- Admin reviews and approves/rejects manually
- No Stripe, Paymob, or automated gateways in v1
- Proof stored in Cloudflare R2 with signed URLs, deleted 90 days post-resolution ✓

✅ **IV. First 5 Lessons Always Free (NON-NEGOTIABLE)**
- Lessons 1–5 marked is_free_preview = true at creation (order_index ≤ 5)
- API returns 403 for lessons 6+ without enrollment
- Frontend shows locked state with purchase prompt ✓

✅ **V. Single Admin, Two-Role (SCOPE BOUNDARY)**
- Pre-seeded admin account for Yousef
- No public admin registration
- Role middleware returns 403 for non-admin on /admin routes
- Two roles only: admin, student ✓

✅ **VI. Professional, Intentional Design (UX STANDARD)**
- No generic AI UI; Udemy-quality expected
- Skeleton loaders (no blanks), inline validation, toast notifications, error preservation
- All empty states in Arabic with CTAs
- Theme toggle on every page
- RTL navigation (top-left toasts, mirrored icons) ✓

✅ **VII. Phase-Gated Build Order (PROCESS DISCIPLINE)**
- 4 phases with validation gates (Section 14, PRD-v1.1.md)
- No Phase 2 work until Phase 1 validation passes
- Build order codified in tasks.md (generated by /speckit.tasks) ✓

### Security Constraints (NON-NEGOTIABLE)

✅ **No public API write/delete access**
- All data-modifying endpoints (POST, PUT, DELETE) require authentication
- Admin endpoints require role = 'admin'

✅ **No public proof image URLs**
- Cloudflare R2 bucket is private
- Signed URL endpoint verifies admin role before generating access
- URLs expire in 1 hour

✅ **No plaintext passwords**
- Passwords hashed with bcrypt cost 12
- Never logged or stored plaintext

✅ **All inputs validated before DB**
- Zod validation on every request body
- Prisma parameterized queries (no SQL injection)
- MIME type validation on file uploads (magic bytes, not extension)

✅ **JWT authentication**
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry, rotated on use, stored in DB for revocation
- Rate limiting: 10 auth attempts per minute per IP (Redis store)

✅ **Audit logging**
- All admin actions logged: timestamp, admin_id, action_type, target_entity_id

### Gate Result

✅ **PASS — No violations. All constraints satisfied. Ready for Phase 0.**

---

## Project Structure

### Documentation (this feature)

```
specs/001-yousef-lms/
├── spec.md                      # Feature specification (10 user stories, 94 FRs)
├── plan.md                      # This file (implementation plan)
├── research.md                  # Phase 0 output (resolved unknowns)
├── data-model.md                # Phase 1 output (entity definitions, schemas)
├── ui-mapping.md                # Stitch page inventory mapped to features, APIs, and tasks
├── quickstart.md                # Phase 1 output (local dev setup)
├── contracts/                   # Phase 1 output (API contracts)
│   ├── auth.md                  # POST /api/v1/auth/* endpoints
│   ├── courses.md               # GET /api/v1/courses* + admin endpoints
│   ├── orders.md                # POST /api/v1/orders + admin approval
│   ├── enrollments.md           # GET /api/v1/enrollments*
│   ├── comments.md              # POST/GET /api/v1/lessons/:id/comments
│   └── students.md              # GET /api/v1/admin/students*
├── checklists/
│   └── requirements.md           # Spec quality validation (PASSED)
└── tasks.md                     # Phase 2 output (/speckit.tasks command)
```

### Source Code Structure (Monorepo)

```
repository root/
├── stitch/                      # Stitch export source of truth (HTML + screenshots + DESIGN.md)
├── client/                      # React 18 frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/          # Reusable UI components (buttons, forms, cards, modals, etc.)
│   │   ├── pages/               # Route pages (Home, Catalog, CourseDetail, LessonPlayer, Dashboard, Admin)
│   │   ├── hooks/               # Custom hooks (useAuth, useCourse, useOrder, etc.)
│   │   ├── services/            # API clients (axios instance, auth service)
│   │   ├── context/             # Context for auth, theme state
│   │   ├── i18n/                # react-i18next setup
│   │   │   └── locales/ar.json  # All Arabic UI strings
│   │   ├── types/               # TypeScript types (imported from /shared)
│   │   ├── utils/               # Utility functions (validators, formatters, etc.)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css            # CSS variables for theming (colors, fonts, spacing)
│   ├── public/
│   │   └── icons/               # RTL-safe SVG icons or iconography
│   ├── tailwind.config.js        # Tailwind config (dark mode, theme colors)
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── tests/
│       ├── unit/                # Vitest unit tests
│       └── integration/         # Component integration tests
│
├── server/                      # Node.js + Express backend (TypeScript)
│   ├── src/
│   │   ├── models/              # Prisma client setup, database helpers
│   │   ├── routes/              # Express route handlers organized by resource
│   │   │   ├── auth.ts          # /api/v1/auth/*
│   │   │   ├── courses.ts       # /api/v1/courses + /api/v1/admin/courses
│   │   │   ├── orders.ts        # /api/v1/orders + /api/v1/admin/orders
│   │   │   ├── enrollments.ts   # /api/v1/enrollments
│   │   │   ├── comments.ts      # /api/v1/lessons/:id/comments + delete
│   │   │   ├── students.ts      # /api/v1/admin/students
│   │   │   └── index.ts         # Route assembly
│   │   ├── middleware/          # Auth, role checking, error handling, logging
│   │   ├── validators/          # Zod schemas for request validation
│   │   ├── services/            # Business logic (auth service, course service, order service, etc.)
│   │   ├── storage/             # File upload handling (Multer + Cloudflare R2 client)
│   │   ├── email/               # Resend integration for approval/rejection emails
│   │   ├── utils/               # Utility functions (JWT generation, hashing, formatters)
│   │   ├── jobs/                # Scheduled jobs (90-day proof image cleanup via node-cron)
│   │   ├── app.ts               # Express app setup (middleware, routes, error handling)
│   │   ├── server.ts            # Server startup and configuration
│   │   └── types.ts             # Type definitions (imported from /shared)
│   ├── prisma/
│   │   ├── schema.prisma        # Prisma schema (all entities, relationships, indexes)
│   │   └── migrations/          # Prisma migrations (auto-generated)
│   ├── tests/
│   │   ├── unit/                # Vitest unit tests (auth middleware, validators, services)
│   │   └── integration/         # Supertest integration tests (API endpoints)
│   ├── .env.example
│   ├── tsconfig.json
│   ├── package.json
│   └── vite.config.ts           # Vitest config
│
├── shared/                      # Shared TypeScript types and constants
│   ├── types/
│   │   ├── api.ts               # API request/response types (DTO objects)
│   │   ├── entities.ts          # Entity type definitions (mirroring Prisma schema)
│   │   └── index.ts             # Export all types
│   ├── constants/
│   │   └── errors.ts            # Standardized error codes (EMAIL_ALREADY_EXISTS, ENROLLMENT_REQUIRED, etc.)
│   ├── validators/
│   │   ├── auth.ts              # Shared Zod schemas (email format, password rules, etc.)
│   │   ├── course.ts            # Shared course validators
│   │   └── index.ts
│   └── package.json             # Minimal package for types-only
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml            # GitHub Actions: lint, test, build, deploy
│
├── .gitignore
├── README.md
└── package.json                 # Root workspace package

```

**Structure Decision**: Monorepo with three packages (/client, /server, /shared). Chosen for:
- Single git repository simplifies CI/CD and coordination for small team
- Shared types reduce API contract drift between frontend/backend
- Each package has independent build/test scripts (no abstraction layer)
- Clear boundaries: /client for UI, /server for API, /shared for contracts
- Scaling: Easy to split into separate repos later if needed
- `/stitch` remains the permanent visual parity reference for all page implementations

### Stitch UI Source of Truth

**Canonical reference order**
1. `stitch/<page>/code.html` for DOM structure and component grouping
2. `stitch/<page>/screen.png` for spacing, composition, and final visual verification
3. `stitch/obsidian_logic/DESIGN.md` for global surface, typography, and elevation rules

**Implementation rule**
- Refactor static export markup into reusable React components internally, but preserve the exported visual result.
- If HTML and screenshot disagree, implement the screenshot's visual result and note the mismatch in the relevant task or implementation note.
- Any loading, empty, error, success, auth, or permission state not present in Stitch must be added in the same visual language.

---

## Phase 0: Research

### Unknowns to Resolve

All technical choices in the user input are explicit and well-defined. No NEEDS CLARIFICATION markers required.

**Decisions already made:**
1. ✅ React 18 + TypeScript + Vite for frontend
2. ✅ Node.js 20 + Express + Prisma for backend
3. ✅ PostgreSQL 15 + Redis (Upstash) + Cloudflare R2
4. ✅ Vercel + Railway + Supabase deployment
5. ✅ Monorepo with /client, /server, /shared
6. ✅ react-i18next for Arabic i18n
7. ✅ Tailwind dark mode + CSS logical properties for RTL
8. ✅ Cloudflare R2 for proof image storage with signed URLs
9. ✅ Resend for transactional email (order approval/rejection)

**Research tasks (optional, for team reference):**
- Best practices for React Hook Form + Zod integration
- Prisma migration best practices for CI/CD
- Cloudflare R2 signed URL generation and validation
- Express middleware ordering and error handling patterns
- JWT refresh token rotation implementation in Node.js

### Output

**Phase 0 Research**: No critical unknowns. All architectural decisions codified. Proceed to Phase 1.

---

## Phase 1: Design

### Data Model (Entities & Relationships)

See **data-model.md** (generated below).

**Core Entities** (8 total):
1. **Users** — Registration, login, profile
2. **Courses** — Published catalog
3. **Sections** — Course organization
4. **Lessons** — Video content with free preview logic
5. **Orders** — Manual payment workflow
6. **Enrollments** — Student course access
7. **Comments** — Lesson engagement
8. **AuditLogs** — Admin action tracking

**Key Constraints**:
- Partial unique index on Orders: (student_id, course_id) WHERE status = 'pending_review'
- Unique index on Enrollments: (student_id, course_id)
- is_free_preview computed at lesson creation (order_index ≤ 5)
- Proof images deleted 90 days post-resolution

### API Contracts

See **contracts/** directory (generated below).

**6 API Contract Modules**:
1. **auth.md** — POST /api/v1/auth/register, login, logout, refresh
2. **courses.md** — GET /api/v1/courses, /courses/:slug, admin CRUD
3. **orders.md** — POST /api/v1/orders, GET /api/v1/orders/my, admin approve/reject
4. **enrollments.md** — GET /api/v1/enrollments/my
5. **comments.md** — GET/POST /api/v1/lessons/:id/comments, admin delete
6. **students.md** — GET /api/v1/admin/students, /admin/students/:id

**Standards**:
- All endpoints versioned at /api/v1/
- Error shape: { code, message, details }
- Auth: Bearer JWT in Authorization header
- Validation: Zod on all request bodies, return 422 with field-level errors
- Rate limiting: 10 auth attempts per minute per IP

### Quick Start (Local Development)

See **quickstart.md** (generated below).

**Setup steps**:
1. Clone repo
2. Install dependencies: `npm install` (root workspace)
3. Copy .env.example → .env in /server (configure Supabase, Upstash, Resend, Cloudflare R2)
4. Run migrations: `npm run migrate` (server)
5. Start dev servers: `npm run dev` (root, runs both client and server)
6. Visit http://localhost:5173 (frontend)

---

## Complexity Tracking

No complexity violations. Constitution is fully satisfied by the technical choices. All constraints are justified and necessary.

---

## Phase Breakdown (Detailed)

### Phase 1: Foundation (Weeks 1–2)

**Gate Entry**: PRD signed off, design assets delivered, video host selected

**Deliverables**:
- Repository structure initialized
- Docker-first local stack and deployment-ready container images defined
- CI/CD pipeline configured (GitHub Actions)
- Database schema created + Prisma migrations
- Auth API: register, login, logout, refresh
- RTL baseline + i18n setup (react-i18next with ar.json)
- Shared public and admin shells derived from Stitch exports
- Home page from `stitch/yousef_lms_home_screen`
- Dark/light theme system (Tailwind class-based, localStorage persistence) aligned to the Stitch exports and `DESIGN.md`
- Course catalog page from `stitch/yousef_lms_course_catalog`
- Course detail page from `stitch/yousef_lms_course_detail_screen`
- Lesson player from `stitch/yousef_lms_lesson_player` (free preview, no auth required for lessons 1–5)

**Validation Gate**: Docker Compose boots the full stack successfully, and a visitor can browse catalog, preview 5 free lessons, theme toggles work, RTL layout correct, staging deployed.

### Phase 2: Enrollment Flow (Weeks 3–4)

**Gate Entry**: Phase 1 validation passed

**Deliverables**:
- Orders & Enrollments schema + migrations
- Proof file upload (Multer + Cloudflare R2)
- Student registration + login UI from `stitch/yousef_lms_register_screen` and `stitch/yousef_lms_login_screen`
- Forgot/reset password support screens from `stitch/yousef_lms_forgot_password` and `stitch/yousef_lms_reset_password_screen`
- Payment instructions page from `stitch/yousef_lms_payment_instructions`
- Proof upload page from `stitch/proof_upload_screen_10`
- Student dashboard from `stitch/student_dashboard`
- Lesson access control (enforce enrollment on lessons 6+)
- Admin: Orders section from `stitch/admin_orders_list_screen` and `stitch/admin_order_detail_16`
- Lesson comments (post, display, moderation)

**Validation Gate**: Student can register, upload proof, receive approval, access paid lessons. Admin can approve/reject orders. Comments work for enrolled students.

### Phase 3: Admin & Polish (Weeks 5–6)

**Gate Entry**: Phase 2 validation passed

**Deliverables**:
- Admin: Dashboard overview from `stitch/admin_dashboard_overview`
- Admin: Full course CRUD (create, edit, publish, unpublish, delete)
- Admin: Section & lesson management
- Admin: Student list/detail from `stitch/admin_students_list_17` and `stitch/admin_student_detail_screen`
- Admin: Comment moderation from `stitch/admin_comments_moderation_screen`
- Admin: Pending order notification badge
- Audit logging (all admin actions)
- Dark/light mode validated on all pages
- RTL validated on all pages and dashboards
- Complete Arabic translation (all remaining strings)
- Edge case handling (all scenarios from spec Section 7)
- Empty states and utility pages matching Stitch exports for `403`, `404`, `500`, `offline`, and `session expired`

**Validation Gate**: Admin can manage all content without developer help. All pages pass RTL and dark/light mode. All edge cases handled.

### Phase 4: Launch Hardening (Weeks 7–8)

**Gate Entry**: Phase 3 validation passed

**Deliverables**:
- P1 Features: Course search/filter, order history, email notifications, progress indicator
- Full end-to-end QA
- Cross-browser testing (Chrome, Safari, Firefox, Edge)
- Mobile responsiveness testing (320px, 768px, 1280px)
- Security review (input validation, file upload, auth, rate limiting)
- Load test (500 concurrent users)
- Performance audit (Lighthouse, API response times)
- Database backup configuration
- Monitoring & alerting setup
- Production environment provisioned
- Production smoke test

**Validation Gate**: All P0 and P1 features functional. QA sign-off. Load test passed. Production deployment ready.

---

## Next Steps

1. ✅ **Phase 0 Research**: Complete (no unknowns)
2. ✅ **Phase 1 Design**: Generate data-model.md, contracts/, quickstart.md
3. → **Phase 2 Tasks**: Run `/speckit.tasks` to generate tasks.md (implementation breakdown)
4. → **Phase 2 Implementation**: Developers begin Phase 1 foundation work

---

**Ready for `/speckit.tasks` to generate the detailed task breakdown and implementation sequence.**
