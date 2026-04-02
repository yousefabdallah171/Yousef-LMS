---
description: "Task list for Yousef LMS v1.0 — Arabic-first full-stack LMS"
---

# Tasks: Yousef LMS v1.0

**Input**: Design documents from `.specify/specs/001-yousef-lms/`
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Stack**: React 18 + Vite + TypeScript + Tailwind CSS (frontend) · Node.js 20 + Express + Prisma + PostgreSQL (backend) · Monorepo: /client, /server, /shared

**Organization**: Tasks grouped by user story (US1–US10). Setup and Foundation phases unblock all stories.

---

**Stitch UI Source of Truth**:
- Use `stitch/<page>/code.html` as the primary structural reference for every page implementation.
- Use `stitch/<page>/screen.png` as the visual verification reference.
- Use `stitch/obsidian_logic/DESIGN.md` as the shared style-system reference.
- Preserve exported Stitch style exactly as much as possible. Do not redesign.
- If a Stitch HTML file and screenshot disagree, preserve the screenshot's visual result, keep the HTML structure where possible, and record the mismatch in the relevant task or PR note.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task belongs to (US1–US10)
- Include exact file paths in all descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo initialization, Docker-first local infrastructure, CI/CD pipeline, and base configs

- [X] T001 Initialize monorepo root with npm workspaces — create root `package.json` with `"workspaces": ["client","server","shared"]` and root scripts (`dev`, `type-check`, `lint`, `format`)
- [X] T002 [P] Scaffold `/shared` package — create `shared/package.json`, `shared/tsconfig.json`, `shared/types/index.ts`, `shared/types/api.ts`, `shared/types/entities.ts`, `shared/constants/errors.ts`, `shared/validators/auth.ts`, `shared/validators/course.ts`
- [X] T003 [P] Scaffold `/server` package — run `npm init`, create `server/tsconfig.json`, `server/package.json` with all backend deps (express, prisma, zod, bcrypt, jsonwebtoken, multer, pino, express-rate-limit, node-cron, @aws-sdk/client-s3, resend, ioredis), add `server/.env.example`
- [X] T004 [P] Scaffold `/client` package — run `npm create vite@latest client -- --template react-ts`, install deps (tailwindcss, react-router-dom v6, @tanstack/react-query v5, react-hook-form, zod, axios, react-i18next, i18next)
- [X] T005 Configure Stitch-derived design tokens in `/client` - update `client/tailwind.config.js` or equivalent theme config to map colors and surfaces to `stitch/obsidian_logic/DESIGN.md`, and preserve the exported Stitch no-line / tonal-layering approach; frontend implementation: expose semantic tokens for base surface, low/high/highest containers, gradients, ghost borders, and ambient shadows; acceptance: exported page colors, radii, spacing intent, and elevation can be reproduced without page-level overrides
- [X] T006 Create CSS variable theming file from Stitch exports - create `client/src/index.css` with `:root` and `.dark` CSS variable definitions derived from `stitch/obsidian_logic/DESIGN.md` and the exported HTML pages; preserve exported Stitch style exactly, including surface hierarchy and gradient CTA treatment; frontend implementation: add logical spacing, typography, blur, shadow, and ghost-border tokens needed by the exports; acceptance: shared tokens reproduce Stitch surfaces and support loading/error/empty states without changing the base design language
- [X] T007 [P] Configure ESLint and Prettier — create root `.eslintrc.cjs` and `.prettierrc` shared across client and server; add `no-hardcoded-colors` rule reminder in comments
- [X] T008 [P] Configure GitHub Actions CI — create `.github/workflows/ci-cd.yml` with jobs: `type-check` (tsc), `lint` (eslint), `test` (vitest) on every PR; deploy-staging on merge to main

- [X] T010 Configure Vite dev proxy in `/client` — update `client/vite.config.ts` to proxy `/api` → `http://localhost:3000` in dev mode

- [X] T011 [P] Set up react-i18next in `/client` — create `client/src/i18n/index.ts` with i18next init, create `client/src/i18n/locales/ar.json` with empty namespace structure (auth, catalog, lesson, dashboard, admin, errors, common), set `dir="rtl"` and `lang="ar"` in `client/index.html`

- [X] T011A [P] Add Docker ignore and container baseline files - create root `.dockerignore` plus package-specific ignore files as needed; preserve monorepo build context hygiene and exclude `node_modules`, build output, Git data, local env files, and generated assets that should not enter images; acceptance: container build contexts are clean, deterministic, and safe for local and CI use
- [X] T011B Create multi-stage Dockerfiles for app services - create `client/Dockerfile` for the Stitch-based React app and `server/Dockerfile` for the Express API using Node 20 images, dependency caching, production targets, and non-root runtime users where practical; backend/data integration note: server image must support Prisma client generation and migrations; acceptance: both client and server images build successfully in dev and production targets
- [X] T011C Create Docker Compose setup for full local stack - create root `docker-compose.yml` with services for `client`, `server`, `postgres`, and `redis`, named volumes for persistence, health checks, env-file wiring, and service dependencies; frontend/backend integration note: client must talk to server through the Compose network and server must use Compose-hosted Postgres/Redis by default; acceptance: `docker compose up --build` brings up the full stack reliably and the app boots against containerized dependencies
- [X] T011D Add Docker-oriented root scripts and deployment notes - update root `package.json` scripts to include `docker:up`, `docker:down`, `docker:logs`, `docker:reset`, and `docker:build`; align task, plan, and quickstart docs so Docker is the default developer path and the base deployment story; acceptance: developers can run, stop, inspect, and reset the stack through simple root commands without memorizing Compose syntax

**Checkpoint**: Monorepo bootstrapped. `npm install` works from root. Both dev servers start (`npm run dev`). Full stack also starts through Docker with `docker compose up --build`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that ALL user stories depend on — database schema, auth middleware, RTL baseline, theme system, i18n, Axios client

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T012 Define complete Prisma schema — write `server/prisma/schema.prisma` with all models: User, Course, Section, Lesson, Order, Enrollment, Comment, LessonProgress, RefreshToken, AuditLog; include all field types, relations, indexes, and the partial unique index on orders `(studentId, courseId)` WHERE `status = PENDING_REVIEW`
- [X] T013 Run initial Prisma migration — execute `npx prisma migrate dev --name init` to create all tables; verify migration file in `server/prisma/migrations/`
- [X] T014 [P] Seed admin user — create `server/prisma/seed.ts` that inserts Yousef Abdallah as admin (bcrypt-hashed password, role = admin); add `"prisma": { "seed": "ts-node prisma/seed.ts" }` to `server/package.json`
- [X] T015 [P] Create shared error codes — populate `shared/constants/errors.ts` with all error code constants from API contracts: `EMAIL_ALREADY_EXISTS`, `INVALID_CREDENTIALS`, `RATE_LIMITED`, `ENROLLMENT_REQUIRED`, `ORDER_ALREADY_EXISTS`, `ALREADY_ENROLLED`, `INVALID_FILE_TYPE`, `FILE_TOO_LARGE`, `ALREADY_APPROVED`, `COURSE_NOT_FOUND`, `ORDER_NOT_FOUND`, `FORBIDDEN`, `UNAUTHORIZED`, `COMMENT_NOT_FOUND`, etc.
- [X] T016 [P] Create shared API types — populate `shared/types/api.ts` with all DTO interfaces (RegisterRequest, LoginResponse, CourseListResponse, OrderCreateRequest, OrderDetailResponse, EnrollmentResponse, etc.) matching contracts/
- [X] T017 [P] Create shared Zod validators — populate `shared/validators/auth.ts` with RegisterSchema, LoginSchema; `shared/validators/course.ts` with CourseCreateSchema, LessonCreateSchema; password min 8 chars, email format, title min 1 char
- [X] T018 Create Express app entry point — create `server/src/app.ts` (Express setup: JSON body parser, CORS with FRONTEND_URL, Pino HTTP logger middleware, rate limiter on /api/v1/auth/*); create `server/src/server.ts` (listen on PORT)
- [X] T019 Implement JWT utilities — create `server/src/utils/jwt.ts` with `signAccessToken(userId, role)` (15min), `signRefreshToken(userId)` (7d), `verifyAccessToken(token)`, `verifyRefreshToken(token)` using jsonwebtoken + JWT_SECRET env
- [X] T020 Implement password utilities — create `server/src/utils/password.ts` with `hashPassword(plain)` (bcrypt cost 12) and `verifyPassword(plain, hash)` — never log passwords
- [X] T021 Implement auth middleware — create `server/src/middleware/auth.ts` with `requireAuth` (verifies Bearer JWT, attaches `req.user = { id, role }`, returns 401 if invalid), `requireAdmin` (checks `req.user.role === 'admin'`, returns 403 if not)
- [X] T022 Implement Zod validation middleware — create `server/src/middleware/validate.ts` with `validate(schema)` middleware factory that validates `req.body` with Zod schema, returns 422 with `{ code: "VALIDATION_ERROR", details: { fields: {...} } }` on failure
- [X] T023 [P] Implement audit log utility — create `server/src/utils/auditLog.ts` with `logAdminAction(adminId, actionType, targetEntity, targetId, details?)` that inserts into AuditLog table via Prisma
- [X] T024 [P] Configure Redis client — create `server/src/utils/redis.ts` with ioredis client connected to REDIS_URL, export singleton; used for rate limiting and refresh token metadata
- [X] T025 Configure Axios client in `/client` — create `client/src/services/apiClient.ts` with Axios instance (`baseURL: /api/v1`), request interceptor attaches `Authorization: Bearer <accessToken>`, response interceptor catches 401 and attempts silent token refresh via `POST /api/v1/auth/refresh`, retries original request once; stores tokens in memory (not localStorage)
- [X] T026 Implement auth context in `/client` — create `client/src/context/AuthContext.tsx` with `AuthProvider` that holds `{ user, isLoading, login, logout, register }`, reads user from access token on mount (decode without verify), exposes `useAuth()` hook
- [X] T027 Implement theme system in `/client` - create `client/src/context/ThemeContext.tsx` with `ThemeProvider` that reads theme preference synchronously on init, applies the correct theme before first render, and preserves the exact visual treatment from the Stitch exports in both modes; frontend implementation: add inline script in `client/index.html` and ensure gradients, glass surfaces, ambient shadows, and tonal surfaces stay consistent with Stitch; acceptance: switching themes does not change layout, hierarchy, or the exported visual language
- [X] T028 [P] Create route protection components — create `client/src/components/ProtectedRoute.tsx` (redirects to /login if not authenticated) and `client/src/components/AdminRoute.tsx` (redirects to /dashboard with 403 toast if not admin)
- [X] T029 Configure React Router around Stitch page inventory - create `client/src/App.tsx` with routes matching `.specify/specs/001-yousef-lms/ui-mapping.md`: `/`, `/courses`, `/courses/:slug`, `/courses/:slug/lessons/:id`, `/register`, `/login`, `/forgot-password`, `/reset-password`, `/dashboard`, `/payment/:courseId`, `/admin`, `/admin/courses`, `/admin/orders`, `/admin/students`, `/admin/comments`, plus `/403`, catch-all `404`, `500`, offline, and session-expired fallbacks; preserve exported Stitch navigation flow; acceptance: every exported Stitch page has a concrete route target or fallback route in the app shell
- [X] T030 Create Stitch-derived shared UI primitives and shells - create `client/src/components/ui/` and `client/src/components/layout/` by extracting reusable pieces from the exported HTML pages: buttons, form fields, cards, table shells, status badges, modal shell, skeleton shell, empty-state shell, progress bar, public header, and admin sidebar/header; preserve exported Stitch style exactly; frontend implementation: convert static HTML into reusable React components with RTL, theme, accessibility, and dynamic-state support; acceptance: page implementations can compose these primitives while keeping the exported visual hierarchy unchanged
- [X] T031 [P] Create public and admin navigation shells from Stitch exports - implement `client/src/components/Navigation.tsx` and `client/src/components/admin/AdminChrome.tsx` using `stitch/yousef_lms_home_screen/code.html`, `stitch/yousef_lms_course_catalog/code.html`, and `stitch/admin_dashboard_overview/code.html` as the source; preserve spacing, hierarchy, sidebar structure, badges, and header treatment exactly; frontend implementation: add auth-aware link visibility, active-route states, and responsive collapse behavior without redesign; acceptance: navigation matches the Stitch exports visually and adapts correctly for visitor, student, and admin roles

**Checkpoint**: Foundation ready. App boots with Arabic RTL layout. Theme toggles work. Auth middleware protects routes. Database schema exists. Axios client handles token refresh.

---

## Phase 3: User Story 1 — Visitor Browses Courses Without Login (P1) 🎯 MVP Entry Point

**Goal**: Public course catalog with Arabic RTL layout, dark/light mode, and empty state

**Independent Test**: Visit `/courses`, verify published courses appear (thumbnail, title, description, price in Arabic, RTL). Toggle dark/light mode. Verify empty state with Arabic message when no courses published.

### Implementation for User Story 1

- [X] T032 [P] [US1] Create Course entity type in `shared/types/entities.ts` — add `Course`, `Section`, `Lesson` interfaces with all fields from data-model.md
- [X] T033 [P] [US1] Create courses API route (GET list) — create `server/src/routes/courses.ts` with `GET /api/v1/courses` that queries Prisma for `courses WHERE status = PUBLISHED`, returns `{ courses: [{ id, slug, title, description, thumbnailUrl, price, lessonsCount, createdAt }] }`; add to `server/src/routes/index.ts`
- [X] T034 [US1] Create course catalog query hook — create `client/src/hooks/useCourses.ts` using TanStack Query `useQuery({ queryKey: ['courses'], queryFn: () => apiClient.get('/courses') })` with loading and error states
- [X] T035 [US1] Create CourseCard component — create `client/src/components/CourseCard.tsx` displaying thumbnail, title (Arabic), short description, price (EGP); all strings via i18next; RTL layout with CSS logical properties; dark/light mode via CSS variables; hover state
- [X] T036 [US1] Implement Course Catalog page from Stitch export - use `stitch/yousef_lms_course_catalog/code.html` and verify against `stitch/yousef_lms_course_catalog/screen.png`; preserve layout, card spacing, filters, header rhythm, and visual hierarchy exactly as exported; frontend implementation: convert static course cards into reusable `CourseCard` rendering backed by `useCourses()` with loading, empty, and error states in the same style; backend/data integration:0ET /api/v1/courses`; acceptance: UI matches Stitch visually, uses real course data, and preserves RTL/theme/accessibility behavior
- [X] T037 [US1] Implement Home page from Stitch export - use `stitch/yousef_lms_home_screen/code.html` and verify against `stitch/yousef_lms_home_screen/screen.png`; preserve the exported hero, featured-course composition, navigation spacing, and CTA hierarchy exactly; frontend implementation: convert static sections into reusable landing-page components and bind featured course areas to real catalog data where applicable; backend/data integration: use `GET /api/v1/courses` or a featured subset derived from it; acceptance: UI matches Stitch visually and routes visitors correctly into the catalog or course flow without redesign
- [X] T038 [US1] Add Arabic translations for catalog strings — add to `client/src/i18n/locales/ar.json` under `catalog` namespace: `browseCourses`, `noCourses`, `priceLabel`, `courseCount`, `startLearning`; under `common`: `loading`, `error`, `retry`, `emptyState`

**Checkpoint**: US1 independently functional. Visitor lands on `/courses`, sees published courses in Arabic RTL layout. Dark/light toggle works. Empty state shows Arabic message.

---

## Phase 4: User Story 2 — Visitor Previews First 5 Lessons Free (P1)

**Goal**: Course detail page with lesson list, free/locked labels, video player for lessons 1–5 (no auth required), purchase modal for lessons 6+

**Independent Test**: Open a course with 6+ lessons. Verify lessons 1–5 show "مجاني" and are playable. Verify lesson 6+ shows "مقفل" and clicking opens purchase modal. Verify video plays for free lessons.

### Implementation for User Story 2

- [ ] T039 [P] [US2] Create courses GET detail API route — add `GET /api/v1/courses/:slug` in `server/src/routes/courses.ts`; queries Prisma for course with sections and lessons; returns `{ course: { ...fields, sections: [{ ...section, lessons: [{ id, title, orderIndex, isFreePreview, videoUrl }] }] }, enrollment: { enrolled: bool } }` (enrollment check requires optional auth); returns 404 if not found
- [ ] T040 [P] [US2] Create lesson player API route — add `GET /api/v1/courses/:slug/lessons/:id` in `server/src/routes/courses.ts`; if `isFreePreview = true`, returns lesson data without auth check; if `isFreePreview = false`, requires `requireAuth` + enrollment check, returns 403 `ENROLLMENT_REQUIRED` if not enrolled
- [ ] T041 [US2] Create course detail query hook — create `client/src/hooks/useCourse.ts` using TanStack Query for `GET /api/v1/courses/:slug`
- [ ] T042 [US2] Create LessonListItem component — create `client/src/components/LessonListItem.tsx`; shows lesson title; if `isFreePreview = true` shows "مجاني" badge (green) and play icon; if locked shows "مقفل" badge (gray) and lock icon; clicking locked lesson triggers onLockedClick callback; RTL layout; dark/light themed
- [ ] T043 [US2] Implement purchase-required modal as a Stitch-consistent adaptation - derive the modal styling and hierarchy from `stitch/yousef_lms_course_detail_screen/code.html` and `stitch/yousef_lms_payment_instructions/code.html`; preserve the exported surface treatment, spacing, and CTA hierarchy; frontend implementation: add auth-aware buttons for register, login, and payment plus focus trapping and dismiss behavior; backend/data integration: wire CTA targets to auth and payment routes; acceptance: locked-lesson interruption looks native to the Stitch design language and applies correct auth-aware routing
- [ ] T044 [US2] Implement Course Detail page from Stitch export - use `stitch/yousef_lms_course_detail_screen/code.html` and verify against `stitch/yousef_lms_course_detail_screen/screen.png`; preserve the exported hero, sticky purchase area, curriculum layout, lesson grouping, and free/locked visual states exactly; frontend implementation: render dynamic sections and lesson rows, attach purchase modal behavior, and add loading/404/error states in the same visual language; backend/data integration: bind to `GET /api/v1/courses/:slug`; acceptance: UI matches Stitch visually and correctly reflects course, lesson, and enrollment state from real API data
- [ ] T045 [US2] Implement video player shell to match Stitch lesson page - derive player chrome, surrounding metadata, and panel surfaces from `stitch/yousef_lms_lesson_player/code.html`; preserve exported spacing, surface hierarchy, and content framing; frontend implementation: wrap iframe or hosted player with loading, retry, and failure states that extend the same visual language; backend/data integration: consume lesson payload from `GET /api/v1/courses/:slug/lessons/:id`; acceptance: player container and failure states remain visually consistent with the Stitch export
- [ ] T046 [US2] Implement Lesson Player page from Stitch export - use `stitch/yousef_lms_lesson_player/code.html` and verify against `stitch/yousef_lms_lesson_player/screen.png`; preserve the exported player layout, side lesson navigator, description block, and comment area framing exactly; frontend implementation: render lesson data, free/locked transitions, comments slot, and redirect states without changing the base design; backend/data integration: bind to `GET /api/v1/courses/:slug/lessons/:id` and later comments/progress APIs; acceptance: UI matches Stitch visually and enforces preview versus enrolled access correctly
- [ ] T047 [US2] Add Arabic translations for lesson strings — add to `ar.json` under `lesson`: `freePreview`, `locked`, `purchaseRequired`, `videoError`, `videoRetry`, `lessonDescription`, `buyNow`, `register`, `login`

**Checkpoint**: US2 independently functional. Course detail shows lesson list with correct free/locked labels. Free lessons play in VideoPlayer. Locked lessons show purchase modal. RTL and dark/light work on all components.

---

## Phase 5: User Story 3 — Student Registers and Logs In (P1)

**Goal**: Registration, login, session persistence, logout, and role-based redirects

**Independent Test**: Register new account via `/register`. Verify redirect to `/dashboard`. Refresh page — session persists. Logout — redirected to `/`. Access `/admin` as student — redirected to `/dashboard` with 403 toast.

### Implementation for User Story 3

- [ ] T048 [P] [US3] Create auth API routes — create `server/src/routes/auth.ts` with:
  - `POST /api/v1/auth/register`: validate with RegisterSchema (Zod), check email uniqueness (409 if exists), hash password (bcrypt 12), create User (role=student), issue access+refresh tokens, store refresh token hash in RefreshTokens table and Redis, return tokens
  - `POST /api/v1/auth/login`: validate with LoginSchema, find user by email, verify password, issue tokens, return `{ user, accessToken, refreshToken }`
  - `POST /api/v1/auth/logout`: requireAuth, revoke refresh token in DB and Redis, return 200
  - `POST /api/v1/auth/refresh`: validate refreshToken in body, verify JWT, check DB not revoked, rotate (delete old, create new), return new token pair
- [ ] T049 [P] [US3] Implement refresh token service — create `server/src/services/authService.ts` with `issueTokens(userId, role)`, `revokeRefreshToken(tokenHash)`, `rotateRefreshToken(oldTokenHash, userId, role)` using Prisma + Redis
- [ ] T050 [US3] Implement Register page from Stitch export - use `stitch/yousef_lms_register_screen/code.html` and verify against `stitch/yousef_lms_register_screen/screen.png`; preserve split layout, form spacing, password-strength treatment, and CTA hierarchy exactly as exported; frontend implementation: convert static form into React Hook Form + Zod with inline validation, loading, success, and error states in the same style; backend/data integration: bind submit to `POST /api/v1/auth/register`; acceptance: UI matches Stitch visually and handles real registration flow, validation, and redirect behavior
- [ ] T051 [US3] Implement Login page from Stitch export - use `stitch/yousef_lms_login_screen/code.html` and verify against `stitch/yousef_lms_login_screen/screen.png`; preserve layout, branding panel, input spacing, and button hierarchy exactly; frontend implementation: convert static form into React Hook Form + auth-aware login flow with inline error, loading, and remembered return URL behavior; backend/data integration: bind submit to `POST /api/v1/auth/login`; acceptance: UI matches Stitch visually and applies real auth state, error handling, and redirect logic
- [ ] T052 [US3] Implement token storage and session in AuthContext — update `client/src/context/AuthContext.tsx` to: store accessToken in memory variable (not localStorage), store refreshToken in secure httpOnly pattern or memory, on mount attempt token refresh to restore session, implement `login()` calling `POST /auth/login` then storing tokens, `logout()` calling `POST /auth/logout` then clearing tokens + redirecting to `/`
- [ ] T053 [US3] Implement protected and admin route guards — update `client/src/components/ProtectedRoute.tsx` to redirect to `/login?returnUrl=current` if not authenticated; update `client/src/components/AdminRoute.tsx` to show 403 toast in Arabic "لا تملك صلاحية الوصول" and redirect to `/dashboard` if role ≠ admin
- [ ] T054 [US3] Add Arabic translations for auth strings — add to `ar.json` under `auth`: `registerTitle`, `loginTitle`, `nameLabel`, `emailLabel`, `passwordLabel`, `registerButton`, `loginButton`, `logoutButton`, `alreadyHaveAccount`, `noAccount`, `emailExists`, `invalidCredentials`, `passwordMinLength`, `sessionExpired`

**Checkpoint**: US3 independently functional. Student registers, logs in, session persists across refresh, logout works. Role-based redirects work. All form errors display inline in Arabic.

---

## Phase 6: User Story 4 — Student Initiates Purchase & Uploads Payment Proof (P1)

**Goal**: Full manual payment flow: payment instructions → proof upload (JPG/PNG/PDF, max 5MB) → order created with pending_review status

**Independent Test**: Logged-in student navigates to locked lesson → clicks buy → sees Arabic payment instructions → uploads valid JPG proof → order appears on dashboard with "قيد المراجعة" badge.

### Implementation for User Story 4

- [ ] T055 [P] [US4] Create Orders API route (student create) — create `server/src/routes/orders.ts` with `POST /api/v1/orders`: requireAuth, parse multipart/form-data with Multer (maxSize 5MB, MIME check via magic bytes: image/jpeg, image/png, application/pdf), check no pending order exists for (studentId, courseId) → 409, check not already enrolled → 409, upload file to Cloudflare R2 (UUID-based path), create Order record (status=pending_review, proofUrl=R2 path), return 201 with `{ order: { id, courseId, status, createdAt } }`
- [ ] T056 [P] [US4] Create Cloudflare R2 storage service — create `server/src/storage/r2.ts` using `@aws-sdk/client-s3`; `uploadProofFile(file, orderId)` uploads to private R2 bucket with path `proofs/${orderId}/${uuid}.${ext}`; `generateSignedUrl(objectKey, expiresInSeconds)` generates signed URL for admin access (1hr expiry); `deleteProofFile(objectKey)` for cleanup job
- [ ] T057 [P] [US4] Implement Multer middleware with MIME validation — create `server/src/middleware/upload.ts` using Multer with `fileFilter` that checks magic bytes (not extension): reads first 4 bytes of buffer, validates against JPEG (`FF D8`), PNG (`89 50 4E 47`), PDF (`25 50 44 46`) signatures; rejects with 422 `INVALID_FILE_TYPE` if mismatch; 5MB limit returning 422 `FILE_TOO_LARGE`
- [ ] T058 [US4] Implement Payment Instructions page from Stitch export - use `stitch/yousef_lms_payment_instructions/code.html` and verify against `stitch/yousef_lms_payment_instructions/screen.png`; preserve payment-step structure, summary card, instruction hierarchy, and CTA placement exactly; frontend implementation: convert static content into a route-aware page with real course summary, pending-order handling, and transition to proof upload; backend/data integration: bind to course summary data and `POST /api/v1/orders` entry flow; acceptance: UI matches Stitch visually and supports real payment flow branching without redesign
- [ ] T059 [US4] Implement Proof Upload page and form from Stitch export - use `stitch/proof_upload_screen_10/code.html` and verify against `stitch/proof_upload_screen_10/screen.png`; preserve upload-zone layout, file preview composition, progress presentation, and submission CTA exactly; frontend implementation: convert static HTML into a validated upload form with progress, replacement, file-type errors, and success state; backend/data integration: bind submit to `POST /api/v1/orders`; acceptance: UI matches Stitch visually, uses real multipart upload, and preserves loading/error/success states in the same style system
- [ ] T060 [US4] Integrate Payment Instructions and Proof Upload flow as Stitch-matched two-step UX - preserve the exported page sequence and visual continuity between `stitch/yousef_lms_payment_instructions` and `stitch/proof_upload_screen_10`; frontend implementation: keep the same visual hierarchy while adding navigation, pending-order disabling, and already-enrolled redirects; backend/data integration: surface `ORDER_ALREADY_EXISTS` and `ALREADY_ENROLLED` from orders APIs; acceptance: the live purchase flow feels identical to the Stitch exports while handling real backend states
- [ ] T061 [US4] Create orders API hook — create `client/src/hooks/useOrders.ts` with `useCreateOrder()` mutation via TanStack Query; `useMyOrders()` query for `GET /api/v1/orders/my`
- [ ] T062 [US4] Add GET /api/v1/orders/my route — add to `server/src/routes/orders.ts`: requireAuth, query Orders WHERE studentId = req.user.id, join course name, return `{ orders: [...] }`
- [ ] T063 [US4] Add Arabic translations for payment/order strings — add to `ar.json` under `payment`: `paymentInstructions`, `bankDetails`, `mobileWalletDetails`, `uploadProof`, `uploadButton`, `fileTooLarge`, `invalidFileType`, `submitting`, `orderSubmitted`, `pendingOrderExists`

**Checkpoint**: US4 independently functional. Logged-in student completes full payment proof upload flow. File validation works client and server side. Order created with pending_review status. Progress bar shows during upload.

---

## Phase 7: User Story 5 — Student Tracks Orders on Dashboard (P1)

**Goal**: Student dashboard with enrolled courses section, orders section with status badges, rejection reason display, and empty states

**Independent Test**: Logged-in student views `/dashboard`. Enrolled courses show with "متابعة التعلم" link. Orders show with correct Arabic status badges. Empty state shows when no enrollments/orders. Theme and RTL correct.

### Implementation for User Story 5

- [ ] T064 [P] [US5] Create enrollments API route — create `server/src/routes/enrollments.ts` with `GET /api/v1/enrollments/my`: requireAuth, query Enrollments WHERE studentId = req.user.id, join course data (name, thumbnail, price, lessonsCount), join lesson progress count, return `{ enrollments: [...] }`; add to routes index
- [ ] T065 [US5] Create enrollment query hook — create `client/src/hooks/useEnrollments.ts` using TanStack Query `useQuery(['enrollments', 'my'])` for `GET /api/v1/enrollments/my`
- [ ] T066 [US5] Create OrderStatusBadge component — create `client/src/components/OrderStatusBadge.tsx`; accepts `status: 'pending_review' | 'approved' | 'rejected'`; renders Arabic badge: "قيد المراجعة" (yellow), "مقبول" (green), "مرفوض" (red); styled with Tailwind + CSS variables for dark/light
- [ ] T067 [US5] Create EnrolledCourseCard component — create `client/src/components/EnrolledCourseCard.tsx`; shows course thumbnail, title (Arabic), "متابعة التعلم" link button → `/courses/:slug/lessons/first-unwatched`; RTL layout; dark/light themed
- [ ] T068 [US5] Create OrderHistoryItem component — create `client/src/components/OrderHistoryItem.tsx`; shows course name, submission date (formatted in Arabic), `OrderStatusBadge`, rejection reason if status=rejected (with "إعادة الإرسال" button → PaymentInstructions page); RTL layout
- [ ] T069 [US5] Implement Student Dashboard page from Stitch export - use `stitch/student_dashboard/code.html` and verify against `stitch/student_dashboard/screen.png`; preserve summary cards, course list layout, order list hierarchy, status badge placement, and empty-state composition exactly; frontend implementation: replace static dashboard content with reusable components backed by enrollments and orders queries plus loading/error/empty states; backend/data integration: bind to `GET /api/v1/enrollments/my` and `GET /api/v1/orders/my`; acceptance: UI matches Stitch visually and displays live student data with correct auth and status behavior
- [ ] T070 [US5] Add Arabic translations for dashboard strings — add to `ar.json` under `dashboard`: `myCourses`, `myOrders`, `continueLearning`, `noEnrollments`, `noOrders`, `pendingStatus`, `approvedStatus`, `rejectedStatus`, `rejectionReason`, `resubmitProof`, `orderDate`

**Checkpoint**: US5 independently functional. Student dashboard shows enrolled courses and order statuses. Status badges display correct Arabic text and colors. Empty states have Arabic messages. RTL layout correct.

---

## Phase 8: User Story 6 — Student Accesses Paid Lessons After Enrollment (P1)

**Goal**: Enrolled students can watch all lessons (1–∞), API enforces enrollment on lessons 6+, lesson player loads with full course content

**Independent Test**: After admin approves order (or manually create enrollment via seed), logged-in student accesses lesson 6 of enrolled course. Video loads. No enrollment prompt shown. All lesson content accessible.

### Implementation for User Story 6

- [ ] T071 [US6] Update lesson player API route for enrollment check — update `GET /api/v1/courses/:slug/lessons/:id` in `server/src/routes/courses.ts`; if `isFreePreview = false`: check `requireAuth` middleware, then check enrollment EXISTS for (req.user.id, course.id); if not enrolled return 403 `ENROLLMENT_REQUIRED`; if enrolled return full lesson data including videoUrl
- [ ] T072 [US6] Update Lesson Player page for enrolled access while preserving Stitch export - keep `stitch/yousef_lms_lesson_player` as the visual source of truth and extend it only for unlocked enrolled states, progress indicators, and purchase redirects; frontend implementation: toggle locked versus unlocked states, next-lesson actions, and success states without redesign; backend/data integration: consume enrollment-aware lesson API and progress API; acceptance: enrolled access changes behavior, not the exported visual language
- [ ] T073 [US6] Update lesson list rendering for enrolled students — update `client/src/components/LessonListItem.tsx`; if user is enrolled in the course, show all lessons with play icons (no locks); use `enrollment.enrolled` from `GET /api/v1/courses/:slug` response to determine enrolled state
- [ ] T074 [US6] Implement lesson progress tracking API — add `POST /api/v1/lessons/:id/progress` in `server/src/routes/courses.ts`: requireAuth, check enrollment, upsert LessonProgress record with watched_at; add to routes; also update `GET /api/v1/enrollments/my` to include lessonsWatched count per course
- [ ] T075 [US6] Create lesson progress hook — create `client/src/hooks/useLessonProgress.ts` with `useMarkWatched(lessonId)` mutation; update `client/src/pages/LessonPlayer.tsx` to call `markWatched` when user reaches 80% of video duration (via iframe `postMessage` or Vimeo SDK event if available, otherwise via timer estimate)

**Checkpoint**: US6 independently functional. Enrolled students access all course lessons. API blocks lesson 6+ for non-enrolled users. Progress tracking records watched lessons.

---

## Phase 9: User Story 7 — Enrolled Students Post and View Comments (P1)

**Goal**: Comment section below lesson video — all visitors see comments (read-only), enrolled students can post, admin can delete

**Independent Test**: Enrolled student posts comment on lesson. Non-enrolled visitor sees comment in read-only mode. Empty text submit fails. Admin can delete comment from admin panel.

### Implementation for User Story 7

- [ ] T076 [P] [US7] Create comments API routes — create `server/src/routes/comments.ts` with:
  - `GET /api/v1/lessons/:id/comments`: no auth required, returns active comments (deleted_at IS NULL) with authorName and createdAt
  - `POST /api/v1/lessons/:id/comments`: requireAuth, check enrollment for this lesson's course (403 ENROLLMENT_REQUIRED if not enrolled), validate content non-empty (422 EMPTY_CONTENT), create Comment record, return 201 with comment
  - `DELETE /api/v1/admin/comments/:id`: requireAuth + requireAdmin, soft-delete by setting deleted_at = now(), log to AuditLog; add to routes index
- [ ] T077 [US7] Create comments query and mutation hooks — create `client/src/hooks/useComments.ts` with `useComments(lessonId)` query and `usePostComment(lessonId)` mutation via TanStack Query; invalidate `['comments', lessonId]` on post
- [ ] T078 [US7] Create CommentItem component — create `client/src/components/CommentItem.tsx`; shows author name (Arabic), formatted date (Arabic locale), comment text (Arabic bidirectional text, `dir="auto"`); RTL layout; dark/light themed
- [ ] T079 [US7] Create CommentInput component — create `client/src/components/CommentInput.tsx`; text area with placeholder "أضف تعليقاً..."; `dir="auto"` for Arabic input; submit button "نشر" disabled when empty; loading spinner on submit; error toast on failure with text preserved; RTL layout
- [ ] T080 [US7] Implement Comments section as a Stitch-consistent extension of the lesson player export - derive spacing, surfaces, and action hierarchy from `stitch/yousef_lms_lesson_player/code.html`; preserve the exported lesson page framing exactly while adding read-only and enrolled-comment states; frontend implementation: render comment list, form, empty state, and submission state with reusable components; backend/data integration: bind to `GET /api/v1/lessons/:id/comments` and `POST /api/v1/lessons/:id/comments`; acceptance: comments feel native to the Stitch lesson page and support real read/write permissions
- [ ] T081 [US7] Integrate CommentsSection into LessonPlayer page — update `client/src/pages/LessonPlayer.tsx` to render `<CommentsSection lessonId={lesson.id} enrolled={enrollment.enrolled} />` below video description
- [ ] T082 [US7] Add Arabic translations for comment strings — add to `ar.json` under `comments`: `addComment`, `postButton`, `noComments`, `firstComment`, `enrollToCOmment`, `commentPosted`, `commentDeleted`, `deleteConfirm`

**Checkpoint**: US7 independently functional. Comments section visible on all lesson pages. Enrolled students post comments. Non-enrolled see read-only mode. Empty state shows Arabic message.

---

## Phase 10: User Story 8 — Admin Creates and Publishes Courses (P1)

**Goal**: Admin panel for creating courses, adding sections/lessons, and publishing to public catalog

**Independent Test**: Admin logs in to `/admin/courses`. Creates new course with title, description, thumbnail, price. Adds sections and lessons. Publishes course. Navigates to `/courses` as visitor — course appears. Unpublishes — course disappears.

### Implementation for User Story 8

- [ ] T083 [P] [US8] Create admin courses API routes — create `server/src/routes/admin/courses.ts` with all routes from `contracts/courses.md`:
  - `POST /api/v1/admin/courses`: requireAuth + requireAdmin, validate with CourseCreateSchema, auto-generate slug from title (Arabic transliteration), create Course (status=draft), log to AuditLog
  - `PUT /api/v1/admin/courses/:id`: requireAdmin, validate, update, log
  - `DELETE /api/v1/admin/courses/:id`: requireAdmin, check active enrollments → 409 with count, delete, log
  - `POST /api/v1/admin/courses/:id/publish`: requireAdmin, set status=published, log `course_publish`
  - `POST /api/v1/admin/courses/:id/unpublish`: requireAdmin, set status=draft, log `course_unpublish`
  - `POST /api/v1/admin/courses/:courseId/sections`: requireAdmin, create Section, log
  - `POST /api/v1/admin/sections/:sectionId/lessons`: requireAdmin, validate, compute order_index globally within course, set is_free_preview=(orderIndex<=5), create Lesson, log
  - `PUT /api/v1/admin/lessons/:id`: requireAdmin, update lesson, log
  - `DELETE /api/v1/admin/lessons/:id`: requireAdmin, check if only lesson in section → 409, delete, log
- [ ] T084 [P] [US8] Create admin course mutation hooks — create `client/src/hooks/useAdminCourses.ts` with mutations: `useCreateCourse()`, `useUpdateCourse()`, `useDeleteCourse()`, `usePublishCourse()`, `useUnpublishCourse()`, `useAddSection()`, `useAddLesson()`, `useUpdateLesson()`, `useDeleteLesson()` via TanStack Query with cache invalidation
- [ ] T085 [US8] Create Admin layout from Stitch exports - implement `client/src/components/admin/AdminLayout.tsx` and related shell pieces using `stitch/admin_dashboard_overview/code.html`, `stitch/admin_course_list_screen/code.html`, and `stitch/admin_orders_list_screen/code.html`; preserve sidebar width, surface hierarchy, header treatment, badges, and table container spacing exactly; frontend implementation: add role-aware routing, active states, and responsive collapse behavior; acceptance: all admin pages share the same exported Stitch chrome without redesign
- [ ] T086 [US8] Implement Admin Course List page from Stitch export - use `stitch/admin_course_list_screen/code.html` and verify against `stitch/admin_course_list_screen/screen.png`; preserve table layout, search/filter structure, action column, and empty-state treatment exactly; frontend implementation: bind rows to real admin course data and support loading, empty, publish/unpublish, and delete-confirm states in the same style; backend/data integration: bind to admin course list and mutation endpoints from `contracts/courses.md`; acceptance: UI matches Stitch visually and supports real course administration flows
- [ ] T087 [US8] Implement course form system from Stitch admin editor export - derive field grouping, labels, action bar, and supporting panels from `stitch/admin_course_editor/code.html`; preserve the exported form spacing and hierarchy exactly; frontend implementation: convert static inputs into React Hook Form + Zod components for create/edit flows; backend/data integration: support create and update requests to admin course endpoints; acceptance: form visuals match Stitch and validation/loading states remain in the same design language
- [ ] T088 [US8] Implement Admin Course Editor page from Stitch export - use `stitch/admin_course_editor/code.html` and verify against `stitch/admin_course_editor/screen.png`; preserve the exported page layout, curriculum builder structure, section/lesson nesting, sticky action area, and publish controls exactly; frontend implementation: convert static editor sections into dynamic forms and lists with add/edit/delete behavior; backend/data integration: bind to admin course, section, and lesson endpoints; acceptance: UI matches Stitch visually while supporting full CRUD on real data
- [ ] T089 [US8] Implement section and lesson subforms as Stitch-consistent editor components - derive layout and controls from `stitch/admin_course_editor/code.html`; preserve nested spacing, action placement, and input hierarchy exactly; frontend implementation: build reusable section and lesson form components with inline validation and optimistic or confirmed updates; backend/data integration: bind to `POST /api/v1/admin/courses/:courseId/sections` and lesson CRUD endpoints; acceptance: nested editor interactions stay visually identical to the Stitch export while operating on real APIs
- [ ] T090 [US8] Add Arabic translations for admin course strings — add to `ar.json` under `admin.courses`: `newCourse`, `saveDraft`, `publishCourse`, `unpublishCourse`, `deleteCourse`, `deleteConfirm`, `addSection`, `addLesson`, `sectionTitle`, `lessonTitle`, `videoUrl`, `lessonDescription`, `haEnrollmentsWarning`, `editCourse`, `coursePublished`, `courseUnpublished`, `courseDeleted`, `lessonSaved`

**Checkpoint**: US8 independently functional. Admin creates course, adds sections and lessons, publishes it. Course appears on public catalog at `/courses`. Unpublish hides it. RTL and dark/light work in admin panel.

---

## Phase 11: User Story 9 — Admin Reviews and Approves Orders (P2)

**Goal**: Admin orders section with filterable list, order detail with full-size proof image, approve/reject actions

**Independent Test**: Student submits order. Admin sees it in `/admin/orders` with "قيد المراجعة" badge. Opens order detail, views proof image full-size. Approves → enrollment created → student dashboard shows "مقبول". Reject with reason → student sees reason.

### Implementation for User Story 9

- [ ] T091 [P] [US9] Create admin orders API routes — add to `server/src/routes/orders.ts` (or `server/src/routes/admin/orders.ts`):
  - `GET /api/v1/admin/orders`: requireAdmin, optional `?status=` filter, pagination, join student name/email + course name, generate signed R2 URL for each proofUrl (1hr expiry)
  - `GET /api/v1/admin/orders/:id`: requireAdmin, return full detail + signed proof URL
  - `POST /api/v1/admin/orders/:id/approve`: requireAdmin, check order exists + is pending_review (not already approved → 409), create Enrollment, update Order status=approved, set reviewedAt + reviewedBy, log to AuditLog, fire-and-forget Resend approval email
  - `POST /api/v1/admin/orders/:id/reject`: requireAdmin, validate optional reason, update Order status=rejected + rejectionReason, set reviewedAt + reviewedBy, log to AuditLog, fire-and-forget Resend rejection email
- [ ] T092 [P] [US9] Implement Resend email service — create `server/src/email/emailService.ts`; `sendApprovalEmail(student, course)` sends Arabic HTML email via Resend with course access link; `sendRejectionEmail(student, course, reason)` sends Arabic HTML rejection email; both fire-and-forget (errors logged but don't block API response)
- [ ] T093 [P] [US9] Create admin order mutation hooks — create `client/src/hooks/useAdminOrders.ts` with `useAdminOrders(status?)` query, `useApproveOrder()` mutation, `useRejectOrder()` mutation; cache invalidation on approve/reject
- [ ] T094 [US9] Implement Admin Orders List page from Stitch export - use `stitch/admin_orders_list_screen/code.html` and verify against `stitch/admin_orders_list_screen/screen.png`; preserve the exported tab/filter row, table hierarchy, pending emphasis, and action placement exactly; frontend implementation: replace static rows with query-backed data plus loading, empty, and error states in the same style; backend/data integration: bind to `GET /api/v1/admin/orders`; acceptance: UI matches Stitch visually and supports real filtering, pagination, and review navigation
- [ ] T095 [US9] Implement Admin Order Detail page from Stitch export - use `stitch/admin_order_detail_16/code.html` and verify against `stitch/admin_order_detail_16/screen.png`; preserve detail layout, proof preview hierarchy, metadata blocks, and approve/reject action grouping exactly; frontend implementation: add image modal, confirmation dialogs, duplicate-approve handling, and loading states without redesign; backend/data integration: bind to `GET /api/v1/admin/orders/:id`, approval/rejection endpoints, and signed proof URL generation; acceptance: UI matches Stitch visually and supports real order review actions and state transitions
- [ ] T096 [US9] Add Arabic translations for admin order strings — add to `ar.json` under `admin.orders`: `allOrders`, `pendingOrders`, `approvedOrders`, `rejectedOrders`, `approve`, `reject`, `approveConfirm`, `approveSuccess`, `rejectConfirm`, `rejectReason`, `rejectSuccess`, `alreadyApproved`, `viewProof`, `orderDetail`, `submittedAt`

**Checkpoint**: US9 independently functional. Admin views pending orders, opens proof image full-size, approves (creates enrollment instantly) or rejects with reason. Emails fire in background.

---

## Phase 12: User Story 10 — Admin Views Students and Manages Comments (P2)

**Goal**: Admin students list with enrollment history, comments list across all lessons with delete capability

**Independent Test**: Admin views `/admin/students` — all registered students listed. Clicks student — sees their enrollments. Admin views `/admin/comments` — all comments across platform. Deletes comment → confirmation dialog → comment disappears from lesson page.

### Implementation for User Story 10

- [ ] T097 [P] [US10] Create admin students API routes — create `server/src/routes/admin/students.ts` with:
  - `GET /api/v1/admin/students`: requireAdmin, list all users WHERE role=student, include enrollmentCount, joinedAt, pagination
  - `GET /api/v1/admin/students/:id`: requireAdmin, return student detail + all enrollments with course names
- [ ] T098 [P] [US10] Add GET /api/v1/admin/comments route — add to `server/src/routes/comments.ts` (or admin route): requireAdmin, list all comments WHERE deleted_at IS NULL across all lessons, join lesson title + course title + student name, order by createdAt DESC, pagination
- [ ] T099 [US10] Implement Admin Students List page from Stitch export - use `stitch/admin_students_list_17/code.html` and verify against `stitch/admin_students_list_17/screen.png`; preserve table layout, row density, metadata hierarchy, and empty-state treatment exactly; frontend implementation: render query-backed rows, loading skeletons, and navigation into detail view without changing the exported design; backend/data integration: bind to `GET /api/v1/admin/students`; acceptance: UI matches Stitch visually and supports real student data and pagination
- [ ] T100 [US10] Implement Admin Student Detail page from Stitch export - use `stitch/admin_student_detail_screen/code.html` and verify against `stitch/admin_student_detail_screen/screen.png`; preserve the exported profile-summary and enrollment-history layout exactly; frontend implementation: replace static student content with query-backed summary and course history cards plus loading/error/empty states in the same style; backend/data integration: bind to `GET /api/v1/admin/students/:id`; acceptance: UI matches Stitch visually and shows live enrollment history without redesign
- [ ] T101 [US10] Implement Admin Comments Moderation page from Stitch export - use `stitch/admin_comments_moderation_screen/code.html` and verify against `stitch/admin_comments_moderation_screen/screen.png`; preserve list/table structure, moderation controls, and confirmation hierarchy exactly; frontend implementation: render real comment data, inline expand behavior if needed, and delete confirmation in the same visual language; backend/data integration: bind to `GET /api/v1/admin/comments` and `DELETE /api/v1/admin/comments/:id`; acceptance: UI matches Stitch visually and supports real moderation actions and cache updates
- [ ] T102 [US10] Create admin students/comments hooks — create `client/src/hooks/useAdminStudents.ts` with `useAdminStudents()`, `useAdminStudentDetail(id)`; create `client/src/hooks/useAdminComments.ts` with `useAdminComments()`, `useDeleteComment()` mutation with TanStack Query cache invalidation
- [ ] T103 [US10] Add Arabic translations for admin student/comment strings — add to `ar.json` under `admin.students`: `studentList`, `studentDetail`, `enrollmentHistory`, `joinDate`; under `admin.comments`: `commentList`, `deleteComment`, `deleteConfirm`, `noComments`, `lessonColumn`, `courseColumn`

**Checkpoint**: US10 independently functional. Admin views student roster and enrollment history. Admin views all comments across platform. Comment deletion works with confirmation and cache invalidation.

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect all user stories — security hardening, error handling, accessibility, performance, edge cases

- [ ] T104 [P] Implement edge-case handlers with Stitch parity - add remaining edge cases from spec.md Section 7 while preserving the visual language of the related Stitch pages, especially locked-lesson redirects, video failure retry, admin delete warnings, and resubmission flows; frontend implementation: add these states without redesigning the base pages; backend/data integration: ensure APIs return the required status codes and messages; acceptance: each added state looks native to the associated Stitch export and behaves correctly with real auth/data constraints
- [ ] T105 [P] Implement rate limiting on auth routes — verify `express-rate-limit` with Redis store applied to `POST /api/v1/auth/register`, `POST /api/v1/auth/login`; 10 req/min/IP; returns 429 with `{ code: "RATE_LIMITED", retryAfterSeconds: 60 }`
- [ ] T106 [P] Implement nightly proof image cleanup job — create `server/src/jobs/cleanupProofs.ts` using `node-cron`; runs daily at 3am; queries Orders WHERE (status = approved OR rejected) AND reviewedAt < 90 days ago AND proofUrl IS NOT NULL; deletes files from Cloudflare R2; sets proofUrl = null on order; register job in `server/src/server.ts`
- [ ] T107 [P] Complete Arabic i18n coverage across Stitch-derived pages - audit all exported-page implementations so every visible string, status, CTA, empty state, modal message, and error message uses `t()` while preserving the exported layout; acceptance: no English remains visible in user-facing UI except intentionally internal admin references not shown to end users
- [ ] T108 [P] Run RTL layout audit against Stitch exports - audit all implemented pages against their Stitch HTML and screenshots to ensure logical properties, mirrored icon direction, right-aligned hierarchy, and exported spacing are preserved; acceptance: no implemented page drifts from the exported RTL composition
- [ ] T109 [P] Run theme and visual parity audit against Stitch exports - verify every page matches the exported Stitch look in both supported themes, using `stitch/obsidian_logic/DESIGN.md` as the style reference; acceptance: no page regresses into generic borders, flat cards, or non-Stitch color usage
- [ ] T110 [P] Run responsive audit on Stitch-derived pages - test all exported page implementations at 320px, 768px, and 1280px while preserving the same visual hierarchy and spacing logic from the exports; acceptance: responsive behavior works without changing the base design language
- [ ] T111 [P] Add loading skeleton variants that match each Stitch page - ensure every data-fetching page uses skeletons shaped after its exported layout, including catalog cards, lesson sidebars, order tables, student lists, and admin panels; acceptance: loading states look like natural unfinished versions of the Stitch exports, not generic placeholders
- [ ] T112 [P] Accessibility audit — add `aria-label` to all icon-only buttons; ensure all form fields have associated `<label>`; verify keyboard navigation and visible focus rings on all interactive elements; add `alt` text to all images in Arabic; ensure modals trap focus correctly
- [ ] T113 Implement global error boundary using the Stitch 500-page style - create `client/src/components/ErrorBoundary.tsx` and render a branded error fallback derived from `stitch/500_server_error_screen/code.html`; preserve exported hierarchy and CTA treatment while wiring retry/report/home behavior; acceptance: unexpected frontend failures route into a 500 experience that visually matches Stitch
- [ ] T114 [P] Implement 403 and 404 pages from Stitch exports - create `client/src/pages/NotFound.tsx` from `stitch/404_not_found_screen/code.html` and `client/src/pages/Forbidden.tsx` from `stitch/403_access_denied/code.html`; preserve exported layout, spacing, and CTA hierarchy exactly; frontend implementation: wire router fallbacks and role-based redirects; acceptance: both pages match Stitch visually and apply the correct navigation outcomes
- [ ] T115 [P] Performance: add React Query stale times — configure `defaultOptions` in `QueryClient` with `staleTime: 5 * 60 * 1000` (5min) for courses and lessons; `staleTime: 0` for user-specific data (orders, enrollments) to always refetch
- [ ] T116 [P] Security: add security headers to Express — create `server/src/middleware/security.ts` using `helmet`; add `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options` headers; ensure no sensitive data in error responses (no stack traces in production)
- [ ] T117 Write backend unit tests — create `server/tests/unit/` tests with Vitest for: `jwt.ts` (sign/verify), `password.ts` (hash/verify), `auth.ts` middleware (valid token, expired token, missing token, wrong role), Zod validators (valid/invalid inputs for RegisterSchema, CourseCreateSchema, OrderCreateSchema); target 70% coverage on business logic
- [ ] T118 [P] Write backend integration tests — create `server/tests/integration/` tests with Supertest for critical happy paths: register → login → refresh → logout; create course → publish → fetch catalog; submit order → admin approve → enrollment created; admin reject order with reason
- [ ] T119 Validate all admin audit logs — manually test each admin action (approve order, reject order, delete comment, publish course, unpublish course, delete course, add lesson, delete lesson) and verify AuditLog records are created with correct fields in Prisma Studio
- [ ] T120 [P] Add database indexes via Prisma — verify all performance indexes from data-model.md are present in `prisma/schema.prisma`: orders.status, orders.studentId, orders.courseId, enrollments.studentId, lessons.sectionId, comments.lessonId, courses.status; run migration if any are missing
- [ ] T122 [US8] Implement Admin Dashboard Overview page from Stitch export - use `stitch/admin_dashboard_overview/code.html` and verify against `stitch/admin_dashboard_overview/screen.png`; preserve KPI-card layout, quick-action hierarchy, sidebar badge treatment, and surface rhythm exactly; frontend implementation: bind cards and panels to real admin summary queries and loading/error states; backend/data integration: add an aggregated admin overview endpoint or compose existing admin queries; acceptance: admin landing page matches Stitch visually and is backed by live platform metrics
- [ ] T123 [P] Implement missing Stitch support pages for auth recovery and utility states - create `/forgot-password`, `/reset-password`, `/500`, offline, and session-expired experiences from `stitch/yousef_lms_forgot_password`, `stitch/yousef_lms_reset_password_screen`, `stitch/500_server_error_screen`, `stitch/offline_no_connection`, and `stitch/session_expired_screen`; preserve exported style exactly; frontend implementation: add form validation, retry/sign-in actions, auth/session handling, and online/offline detection; backend/data integration: add missing password-recovery endpoints if the product keeps these pages in scope, otherwise mark backend as deferred support while still implementing the UI shell in the same design language
- [ ] T121 Final commit and staging deployment - merge all work to main; trigger GitHub Actions CI (type-check, lint, tests); verify Vercel preview deploys frontend; verify Railway staging deploys backend; run smoke test: browse catalog, watch free lesson, register, login, view dashboard

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user stories**
- **US1–US8 (Phases 3–10)**: Depends on Foundation (Phase 2) completion
  - US1 (catalog) → US2 (preview) → depends on US1 course detail page
  - US3 (auth) can run in parallel with US1 and US2
  - US4 (payment) depends on US3 (student must be logged in)
  - US5 (dashboard) depends on US3 (auth) + US4 (orders)
  - US6 (paid access) depends on US4 (enrollment from order approval)
  - US7 (comments) depends on US6 (enrolled student context)
  - US8 (admin creates courses) can run in parallel with US1–US7 if admin tests are separate
- **US9–US10 (Phases 11–12)**: Depends on US4 (orders exist) and US8 (courses exist)
- **Polish (Phase 13)**: Depends on all user stories being complete

### User Story Dependencies

- **US1**: Can start immediately after Foundation ✅ independent
- **US2**: Depends on US1 (course detail page built in US1)
- **US3**: Can start after Foundation — independent of US1/US2
- **US4**: Depends on US3 (requires auth) and US2 (locked lesson purchase modal)
- **US5**: Depends on US3 (auth) + US4 (orders API exists)
- **US6**: Depends on US4 (enrollment created by order approval)
- **US7**: Depends on US6 (enrolled student access)
- **US8**: Can start after Foundation — independent of US1–US7 (admin creates content separately)
- **US9**: Depends on US4 (orders must exist) and US8 (courses must exist)
- **US10**: Depends on US3 (students must be registered) and US7 (comments must exist)

### Within Each User Story

- API routes → query/mutation hooks → UI components → page integration
- All [P]-marked tasks within a story can run in parallel (different files)
- i18n translation tasks [P] can always run in parallel with implementation

### Parallel Opportunities

All [P] tasks across stories can run simultaneously if team has capacity:
- Backend developer: API routes (T033, T039, T040, T048, T055, T062, T064, T071, T076, T083, T091, T097, T098)
- Frontend developer: UI components and pages
- Both: shared types, hooks, translations

---

## Implementation Strategy

### MVP First (US1 + US2 + Foundation)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundation
3. Complete Phase 3: US1 (catalog)
4. Complete Phase 4: US2 (free preview)
5. **STOP and VALIDATE**: Visitor can browse catalog and watch free lessons. RTL, dark/light, Arabic all working.
6. Demo to Yousef — get feedback before continuing

### Incremental Delivery

1. Foundation → US1 → US2 → Demo (catalog + preview working)
2. Add US3 (auth) → Demo (register/login working)
3. Add US4 (payment) → Demo (full purchase flow)
4. Add US5 (dashboard) → Demo (student self-service)
5. Add US8 (admin content) → Demo (end-to-end content creation)
6. Add US6 + US7 (learning + comments) → Demo (full learning experience)
7. Add US9 + US10 (admin ops) → Demo (admin self-sufficient)
8. Polish Phase → Production

### Parallel Team Strategy (2–3 developers)

Once Foundation complete:
- **Developer A (Frontend)**: US1 → US2 → US5 → UI Polish
- **Developer B (Backend)**: US3 → US4 API → US8 API → US9 API
- **Developer C (Full-stack)**: Shared types, tests, deployment, US6 → US7 → US10

---

## Notes

- `[P]` = different files, no dependencies, safe to parallelize
- `[Story]` label maps each task to its user story for traceabilityspeckit.implement
- Each user story phase is independently completable and testable
- All Arabic strings go through `t()` — never hardcode Arabic text in components
- RTL: use `ms-*`, `me-*`, `ps-*`, `pe-*` Tailwind classes (logical) not `ml-*`/`mr-*`
- Dark mode: use `dark:` variant classes or CSS variables — never hardcode colors
- Commit after each task or logical group
- Stop at each story checkpoint to validate independently before next story









