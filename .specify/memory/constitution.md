# Yousef LMS v1.0 Constitution

<!-- Sync Impact Report
  Version Bump: 1.0.0 (Initial ratification)
  New Principles: 7 core principles + 3 sections
  Added Sections: Architecture Principles, Feature Rules, UX Behavior Rules, Data Model Constraints, Build Order Constraints, Performance & Quality Gates, Scope Management
  Removed Sections: None (initial)
  Templates Updated: ✅ tasks-template.md alignment verified, ⚠️ plan-template.md phase structure validated, ⚠️ spec-template.md scope gates configured
  Deferred: None
-->

## Core Principles

### I. Arabic-First, RTL Design (NON-NEGOTIABLE)

Arabic is the default and only language. All UI strings, error messages, toasts, and confirmations must be in Arabic. `dir="rtl"` is set on the `<html>` element on every page and dashboard. All layouts use CSS logical properties (`margin-inline-start`, `padding-inline-end`, text-align: `start`, etc.) — never hardcoded `left`/`right` values. Directional icons (arrows, chevrons) are mirrored for RTL. RTL is validated on every feature before it is considered done.

**Rationale**: Yousef LMS is designed for Arabic-speaking developers and tech learners. RTL is not a post-launch polish feature—it is foundational to the platform's identity and user experience.

### II. Dark and Light Mode on Every Surface (NON-NEGOTIABLE)

Both dark and light themes must be supported on every page and dashboard, with no exceptions. Theme is toggled via a `class="dark"` on the `<html>` element, stored in `localStorage`, and applied before first paint to prevent flash. All colors are defined as CSS variables. Both themes must pass WCAG 2.1 AA contrast ratio requirements. Theme toggle is accessible from the navigation bar on every page.

**Rationale**: User preference for theme is fundamental to modern UX. Persistence across sessions and flash prevention ensure a polished experience. WCAG AA compliance is non-negotiable for accessibility.

### III. Manual Payment Workflow Only in v1 (SCOPE BOUNDARY)

In v1, the payment workflow is strictly manual: students upload payment proof images (JPG, PNG, PDF; max 5MB), and the admin (Yousef Abdallah) reviews and approves or rejects each order manually. Approval creates an enrollment record and grants course access immediately. No automated payment gateways (Stripe, Paymob, etc.) are implemented in v1. This workflow is strictly deferred to v2.

**Rationale**: Manual approval allows Yousef to maintain direct control over student relationships and fraud detection. Removes dependency on payment gateway approval timelines, enabling immediate market entry. The manual workflow is temporary and explicitly marked for v2 automation.

### IV. First 5 Lessons Always Free (NON-NEGOTIABLE)

The first 5 lessons of every course are always free for all visitors—no login required. Lessons 6 and beyond require enrollment. This rule is enforced at the API level: any request to access lesson 6+ without enrollment returns a 403 error. The frontend marks lessons 1–5 as "مجاني" (free) in the lesson list and lessons 6+ as "مقفل" (locked).

**Rationale**: The free preview creates a high-conversion funnel—students experience real value before committing. This is Yousef's core value proposition against third-party platforms that obscure quality before purchase.

### V. Single Admin, Two-Role Architecture (SCOPE BOUNDARY)

The platform has exactly two roles: `admin` and `student`. The admin role is pre-seeded for Yousef Abdallah only. There is no public admin registration. All protected admin routes check `role === 'admin'` server-side and return 403 for non-admin requests. No multi-vendor, multi-instructor, or role-based instructor features are supported in v1.

**Rationale**: Simplifies auth, eliminates role explosion complexity, and ensures Yousef is the sole decision-maker on all platform operations. Multi-instructor support is explicitly deferred to v2.

### VI. Professional, Intentional Design (UX STANDARD)

The platform is Udemy-quality and personal-brand focused. No generic AI-generated UI. Every screen should feel professional, intentional, and aligned with Yousef's brand authority. Skeleton loaders replace blank pages, inline validation provides immediate feedback, toast notifications confirm success, and error banners preserve user input. All empty states have Arabic messages and relevant CTAs.

**Rationale**: Yousef's platform must reflect his expertise and credibility. Polished UX builds trust and conversion.

### VII. Phase-Gated Build Order (PROCESS DISCIPLINE)

Features are built in four strictly sequenced phases with validation gates between each. No Phase 2 work begins before Phase 1 validation passes. No Phase 3 before Phase 2, etc. This prevents scope sprawl, ensures parallel workstreams don't block each other, and guarantees each phase delivers a shippable increment.

**Rationale**: With a small team (2–3 devs) and tight 8-week timeline, strict sequencing prevents rework, unblocks parallelization, and enforces incremental validation.

## Architecture Principles

**Frontend**: React 18 + TypeScript + Tailwind CSS. Routing via React Router v6 with protected routes for `/dashboard` and `/admin`. i18n via react-i18next with Arabic as default locale. State management: React Query for server state, Zustand or Context for UI state (theme, auth). Forms validated with React Hook Form + Zod. File uploads via Axios with multipart/form-data and progress tracking. RTL via CSS logical properties throughout.

**Backend**: Node.js 20 + TypeScript + Express.js. Database: PostgreSQL 15 via Prisma ORM. Cache/sessions: Redis. Auth: JWT with 15-minute access token expiry and 7-day refresh token rotation. File handling: Multer for upload parsing; files stored to S3-compatible bucket with non-guessable UUID-based paths. All request bodies validated server-side with Zod. Logging: Pino (structured JSON). Testing: Vitest (unit), Supertest (integration).

**Auth Flow**: Bearer JWT in Authorization header. On token expiry, client uses refresh token to request new access token. All admin routes return 403 for non-admin users. Role checked on every protected route.

**File Security**: Proof images validated by MIME type (not extension only). Stored with non-guessable URLs. All data in transit: TLS 1.3. All data at rest: AES-256. Passwords: bcrypt, cost factor 12.

**API Standard**: REST, versioned at `/api/v1/`. All errors follow shape: `{ code, message, details }`. Rate limiting on login (5 attempts per 5 minutes per IP), comments (basic throttling), and uploads (hourly per user and IP).

## Feature Rules (NON-NEGOTIABLE)

- **Free Preview**: First 5 lessons free to all visitors. Lessons 6+ behind enrollment wall.
- **Manual Payment**: Student uploads proof (JPG/PNG/PDF, max 5MB). Admin reviews, approves (creates enrollment), or rejects (with optional reason). No automated gateways in v1.
- **Two Roles Only**: Admin (pre-seeded) and Student. No public admin registration. No multi-vendor, multi-instructor, certificates, native mobile app, or analytics in v1.
- **Proof Storage**: Non-guessable URLs, MIME validation, 90-day deletion post-resolution.
- **Enrollment Logic**: One pending order per (student_id, course_id) enforced at DB level. One enrollment per (student_id, course_id). Approval grants instant access.

## UX Behavior Rules (NO EXCEPTIONS)

- **Form Validation**: Runs on blur and submit. Errors inline, in Arabic, below field. Fields with errors have red border. Error clears on input.
- **Loading States**: Every async button shows spinner and is disabled. Page data fetches show skeleton loader. File upload shows inline progress bar.
- **Success Feedback**: Every successful action triggers Arabic toast (top-left for RTL, auto-dismiss 4 seconds). Specific messages ("تم نشر الدورة بنجاح", not "تم").
- **Error Handling**: Network errors show full-width banner with retry. 404/403 show branded empty states. Form data always preserved on failure.
- **Destructive Actions**: Always require confirmation dialog naming the specific item. Modals close on Escape and backdrop click.
- **Keyboard & Focus**: All interactive elements keyboard navigable with visible focus ring. Disabled buttons have title tooltip explaining why.
- **Empty States**: All screens have Arabic message and relevant CTA (e.g., "لم تنضم إلى أي دورة بعد — [تصفح الدورات]").

## Data Model Constraints

Core entities: `Users`, `Courses`, `Sections`, `Lessons`, `Orders`, `Enrollments`, `Comments`, `LessonProgress`.

- **Lessons**: `is_free_preview` computed at creation based on `order_index ≤ 5` within course.
- **Orders**: Unique constraint `(student_id, course_id)` WHERE `status = 'pending_review'` enforced at DB level. One pending order per student per course.
- **Enrollments**: Unique constraint `(student_id, course_id)`. One enrollment per student per course.
- **Comments**: Include `deleted_at` for soft deletes by admin.
- **Audit Logging**: All admin actions logged with timestamp, admin ID, action type, target entity ID.
- **Data Retention**: Payment proof images deleted 90 days after order resolution (approved or rejected).

## Build Order Constraints

**Phase 1 (Weeks 1–2, Foundation)**:
- Auth API: register, login, logout, refresh
- RTL baseline: `dir="rtl"`, react-i18next configured, Arabic locale file
- Dark/light theme system: CSS variables, Tailwind config, localStorage persistence
- Course catalog: `/courses` — fetch and display published courses
- Course detail: `/courses/:slug` — lesson list with free/locked labels
- Lesson preview: `/courses/:slug/lessons/:id` — free preview, no auth required

**Phase 2 (Weeks 3–4, Enrollment Flow)**:
- Orders, Enrollments database schema
- Proof upload: Multer + S3, MIME validation, size limit
- Student registration + login UI
- Payment instructions page
- Proof upload form with progress
- Student dashboard: enrolled courses, order statuses
- Lesson access control: enforce enrollment on lessons 6+
- Admin: Orders section, approve/reject actions
- Lesson comments: post, display, enrollment check

**Phase 3 (Weeks 5–6, Admin & Polish)**:
- Admin: Full course CRUD (create, edit, publish, unpublish, delete)
- Admin: Sections, lessons management within course editor
- Admin: Student list view
- Admin: Comment moderation (delete)
- Audit logging for admin actions
- Dark/light mode validated on all pages
- RTL validated across all pages
- Complete Arabic translation
- All edge cases and empty states implemented

**Phase 4 (Weeks 7–8, Launch Hardening)**:
- P1 features: search/filter, order history, email notifications, progress indicator
- Full end-to-end QA: all user flows
- Cross-browser testing: Chrome, Safari, Firefox, Edge
- Mobile responsiveness: 320px, 768px, 1280px
- Security review: input validation, file upload, auth routes, rate limiting
- Load test: 500 concurrent users
- Performance audit: Lighthouse, API response times
- Database backups, monitoring, production deployment

## Performance & Quality Gates

- **Page Load**: < 2 seconds (P75). **API Response**: < 500ms (P95). **Error Rate**: < 0.1%.
- **Accessibility**: WCAG 2.1 AA on all pages. Both dark and light themes pass WCAG AA contrast ratios.
- **Browser Support**: Chrome 100+, Safari 15+, Firefox 100+, Edge 100+.
- **Mobile**: Minimum 320px width; responsive at 768px, 1280px breakpoints.
- **Feature Completeness**: No feature is "done" until (a) full acceptance criteria from PRD are met, (b) RTL is validated, (c) both themes confirmed working.

## Scope Management (v1 FREEZE)

This is v1. The scope is frozen at PRD sign-off (2026-04-03). Any request outside the defined P0 and P1 features goes to the v2 backlog without exception. v2 includes: automated payment gateways, certificates, progress tracking, native mobile app, multi-instructor support, analytics dashboards, and email notifications (if not included in P1 completion).

Scope is changed only by formal amendment to this constitution, reviewed by Yousef Abdallah, and logged in the Revision History section.

## Governance

**Amendment Procedure**: Constitution amendments require:
1. Formal proposal with clear rationale
2. Review and approval by Yousef Abdallah (platform owner)
3. Documented amendment in Revision History
4. Version bump per semantic versioning (MAJOR: backward-incompatible changes; MINOR: new principle/section; PATCH: clarifications/wording)
5. Propagation to dependent templates and runtime guidance

**Compliance Review**: All PRs must verify constitution compliance. Violations flagged during review. Complexity must be justified against one or more principles.

**Runtime Guidance**: Refer to `CLAUDE.md` in the repository root for development workflow, review process, and agent-specific implementation guidance. This constitution supersedes all other practices when conflicts arise.

---

**Version**: 1.0.0 | **Ratified**: 2026-04-01 | **Last Amended**: 2026-04-01
