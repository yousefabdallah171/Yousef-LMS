# Yousef LMS v1.0 — Product Requirements Document

---

## Section 1 — Project Identity

| Field | Value |
|---|---|
| **Project Name** | Yousef LMS v1.0 |
| **Project ID** | PRD-001 |
| **Version** | v1.0 |
| **Status** | Draft |
| **Priority** | High |
| **Created Date** | 2026-04-01 |
| **Last Updated** | 2026-04-01 |
| **Owner / PM** | Yousef Abdallah |
| **Team Members** | Frontend Dev / Backend Dev / Designer / QA |
| **Tech Stack** | React 18 + TypeScript + Tailwind CSS / Node.js + Express + PostgreSQL |
| **Repository** | [TBD] |
| **Git Branch Prefix** | NNN-feature-name |
| **PRD File Path** | docs/PRD.md |

---

## Section 2 — Problem & Purpose

### Problem Statement

Yousef Abdallah has no dedicated platform to host and sell his programming and AI courses. This forces reliance on third-party platforms that charge commissions, limit branding control, and remove the instructor from direct student relationships. Arabic-speaking developers and tech learners also lack a trusted, high-quality platform that offers a risk-free preview before purchasing.

### Project Purpose

Build a fully owned, branded LMS that allows Yousef to publish, sell, and manage programming and AI courses — launching immediately with a manual payment workflow requiring no payment gateway on day one.

### Business Value

| Value Driver | Measurable Impact |
|---|---|
| Zero commission loss | 100% of course revenue retained by Yousef |
| Direct student relationships | Full access to student emails, behavior, and history |
| Free preview funnel | 5 free lessons per course drives conversion without discounting |
| Immediate market entry | No dependency on payment gateway approval timelines |
| Brand authority | Platform operates entirely under Yousef's identity |

### Opportunity

The 5-lesson free preview model creates a high-conversion sales funnel: students experience real value before committing. Combined with Arabic-first design and RTL support, the platform directly addresses an underserved market segment with no equivalent local alternative.

---

## Section 3 — Goals & Objectives

### Primary Goal

Deliver a fully working LMS where students can browse courses, watch the first 5 lessons for free, request a purchase by uploading payment proof, and receive full course access upon admin approval — all under Yousef Abdallah's brand, in Arabic, with RTL layout, and dark/light mode support.

### Objectives

| # | Objective | Metric | Target |
|---|---|---|---|
| 1 | Launch functional course catalog | Courses browsable without login | Day 1 of launch |
| 2 | Deliver free preview system | First 5 lessons accessible to all visitors | Day 1 of launch |
| 3 | Complete manual payment workflow | Student can submit proof; admin can approve in < 5 clicks | Phase 2 complete |
| 4 | Deliver student dashboard | Enrolled courses and order status visible | Phase 2 complete |
| 5 | Deliver admin dashboard | Full CRUD on courses, orders, comments | Phase 3 complete |
| 6 | Full RTL + Arabic + dark/light mode | All pages pass RTL and i18n validation | Phase 3 complete |

### Success Definition

The platform is considered launch-ready when:
- A visitor can browse, preview 5 lessons, register, upload payment proof, and receive course access end-to-end without developer intervention
- Admin can manage all content, orders, and comments from the dashboard
- All pages render correctly in RTL Arabic in both dark and light mode
- Error rate is below 0.1% and page load is under 2 seconds on staging

### Non-Goals (v1)

- Automated payment processing (Stripe, Paymob) — deferred to v2
- Course completion certificates — deferred to v2
- Student progress tracking across lessons — deferred to v2
- Native mobile application — deferred to v2
- Multi-vendor or multi-instructor support — not planned
- Analytics dashboards — deferred to v2
- Course ratings and reviews — deferred to v2

---

## Section 4 — Scope

### In Scope

- Course catalog with thumbnails, descriptions, prices
- Individual course detail page with full lesson list
- Free preview: first 5 lessons unlocked for all visitors
- Video lesson player with lesson title and description
- Comments section per lesson (enrolled students only)
- Student registration and login (JWT-based)
- Manual payment workflow: proof image upload → admin review → approve or reject
- Student dashboard: enrolled courses, order statuses, order history
- Admin dashboard: course CRUD, student list, order management, comment moderation
- Full RTL layout across all pages and dashboards
- Arabic language translation for all UI strings
- Dark mode and light mode toggle persisted per session

### Out of Scope

- Payment gateway (Stripe, Paymob) — v2
- Certificates — v2
- Progress tracking — v2
- Native mobile app — v2
- Multi-vendor support — not planned
- Analytics and reporting — v2

### Assumptions

- Yousef Abdallah is the sole admin and content creator
- Course videos will be hosted on a third-party video service (Bunny.net or Vimeo — decision required by end of Phase 1, Week 1)
- Students pay externally (bank transfer, Vodafone Cash) and upload a screenshot as proof
- All course content will be authored in Arabic
- The platform is Arabic-first; RTL is the default layout direction
- A small team of 2–3 developers will build this over 8 weeks

### Constraints

| Constraint | Impact |
|---|---|
| No payment gateway in v1 | Manual admin approval required for every order |
| Video host not yet selected | Lesson player cannot be finalized until decision made |
| Small team (2–3 devs) | Parallel workstreams must be carefully sequenced |
| 8-week timeline | P2 features may be deprioritized if Phase 4 runs long |
| Admin is a single person | Order approval throughput limited to Yousef's availability |

### Dependencies

| Dependency | Required By | Owner |
|---|---|---|
| Video hosting service selected and configured | End of Phase 1 Week 1 | Yousef Abdallah |
| Design assets and brand guidelines delivered | Start of Phase 1 | Designer |
| Email service account created (Resend / SendGrid) | Start of Phase 4 | Tech Lead |
| Admin availability for order reviews at launch | Launch day | Yousef Abdallah |
| PRD sign-off before development starts | 2026-04-03 | Yousef Abdallah |

---

## Section 5 — Users & Personas

### Persona 1 — Primary User: Student

| Field | Detail |
|---|---|
| **Name** | Ahmed (Representative Student) |
| **Role** | Junior Developer / Arabic-speaking Tech Learner |
| **Goal** | Access high-quality programming and AI courses at a fair price, with the ability to preview before purchasing |
| **Pain Point** | Cannot evaluate a course before paying; no trusted Arabic-language platform with professional course quality |
| **Tech Level** | Medium |
| **Frequency** | Weekly — browses new courses, watches lessons, submits purchase requests |
| **Success Definition** | Ahmed can preview 5 lessons, decide to purchase, upload proof, and access the full course within 24 hours of admin approval |

### Persona 2 — Admin: Yousef Abdallah

| Field | Detail |
|---|---|
| **Name** | Yousef Abdallah |
| **Role** | Platform Owner, Sole Administrator |
| **Goal** | Publish courses, manage enrollments, approve orders, and moderate comments from a single panel — without developer help |
| **Pain Point** | Currently relies on third-party platforms with no control over brand, pricing, or student data |
| **Tech Level** | High |
| **Frequency** | Daily — reviews orders, manages content, moderates comments |
| **Success Definition** | Yousef can approve an order, publish a new lesson, and delete a comment in under 2 minutes each, without opening a code editor |

---

## Section 6 — End-to-End User Flows

### Flow 1 — Visitor Browses and Previews a Course

```
Visitor lands on Homepage
    ↓
Clicks "Browse Courses" → Course Catalog Page
    ↓
Clicks a Course Card → Course Detail Page
    ↓
Sees lesson list: lessons 1–5 marked "Free Preview", lessons 6+ marked "Locked"
    ↓
Clicks Lesson 1 → Lesson Player Page (no login required)
    ↓
Watches video, reads description, reads comments
    ↓
Clicks Lesson 6 → System shows "Purchase Required" modal
    ↓
[EXIT: Visitor leaves] OR [CONTINUE: Clicks "Buy Course" → Flow 2]
```

### Flow 2 — Student Registers and Purchases a Course

```
Visitor clicks "Buy Course" on a locked lesson or course detail page
    ↓
System checks auth → Not logged in → Redirect to Register/Login
    ↓
Visitor registers: name, email, password → Account created
    ↓
Redirected back to the course detail page
    ↓
Clicks "Purchase Course"
    ↓
Payment Instructions Page:
  - Bank account / Vodafone Cash number displayed
  - Student completes external payment
    ↓
Student returns to platform → Clicks "I've Paid"
    ↓
Proof Upload Form:
  - Uploads screenshot (JPG/PNG/PDF, max 5MB)
  - Clicks "Submit Order"
    ↓
Order created: status = "Pending Review"
    ↓
Student Dashboard: shows order with status badge "Pending Review"
    ↓
[Admin reviews → Flow 3]
    ↓
Order Approved → Student sees "Enrolled" badge on course
    ↓
Student clicks "Start Learning" → Full course access granted
```

### Flow 3 — Admin Reviews and Approves an Order

```
Admin logs in → Admin Dashboard
    ↓
Sees notification badge: "3 Pending Orders"
    ↓
Navigates to Orders section
    ↓
Filters by status: "Pending Review"
    ↓
Clicks on Order #00123
    ↓
Order Detail View:
  - Student name, email
  - Course requested
  - Payment proof image (click to enlarge)
  - Submission timestamp
    ↓
Admin clicks "Approve" → Confirmation dialog: "Grant full access to Ahmed for [Course Name]?"
    ↓
Admin confirms → Enrollment record created → Course unlocked for student
    ↓
[If P1-F003 enabled] → System sends approval email to student
    ↓
Order status updated to "Approved" in both admin and student dashboard
```

### Flow 4 — Admin Rejects an Order

```
Admin opens Order Detail View (from Flow 3)
    ↓
Admin clicks "Reject"
    ↓
Rejection Dialog: optional text field for reason → "Reject Order"
    ↓
Order status updated to "Rejected"
    ↓
[If P1-F003 enabled] → System sends rejection email with reason to student
    ↓
Student Dashboard: order shows "Rejected" with reason displayed
    ↓
Student clicks "Resubmit" → Proof Upload Form (Flow 2 re-entry)
```

### Flow 5 — Admin Creates and Publishes a Course

```
Admin → Admin Dashboard → Courses section
    ↓
Clicks "New Course"
    ↓
Course Form:
  - Title (Arabic)
  - Description (Arabic, rich text)
  - Thumbnail image upload
  - Price (EGP)
  - Status: Draft
    ↓
Clicks "Save as Draft"
    ↓
Course detail page opens → Admin clicks "Add Section"
    ↓
Section Form: Section title → Save
    ↓
Admin clicks "Add Lesson" within section
    ↓
Lesson Form:
  - Lesson title
  - Video URL (from video host)
  - Description (Arabic, rich text)
    ↓
Repeats for all lessons
    ↓
Admin clicks "Publish Course" → Status changes to Published
    ↓
Course appears on catalog immediately
```

---

## Section 7 — Edge Cases & Failure Scenarios

### Authentication

| Scenario | System Response |
|---|---|
| Student submits registration with existing email | Inline error: "هذا البريد الإلكتروني مسجل بالفعل" — email field highlighted |
| Student submits login with wrong password | Inline error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" — no field-level hint to prevent enumeration |
| Student attempts to access /dashboard while unauthenticated | Redirect to /login with return URL preserved |
| Admin attempts to access /admin while logged in as student | Redirect to /dashboard with 403 toast notification |
| JWT token expires mid-session | Silent refresh attempt; if refresh fails, redirect to /login with message: "انتهت جلستك، يرجى تسجيل الدخول مجدداً" |
| Network failure during login submit | Error toast: "تعذر الاتصال، يرجى التحقق من الإنترنت" — form remains populated |

### Course Catalog & Preview

| Scenario | System Response |
|---|---|
| No courses published yet | Catalog shows empty state illustration with message: "لا توجد دورات متاحة حالياً" |
| Student clicks lesson 6+ while not logged in | "Purchase Required" modal with Register/Login CTA |
| Student clicks lesson 6+ while logged in but not enrolled | "Purchase Required" modal with "Buy Course" CTA |
| Video fails to load on lesson player | Error state with retry button; message: "تعذر تحميل الفيديو، حاول مرة أخرى" |
| Course has fewer than 5 lessons | All lessons are free preview — no lessons locked |
| Admin unpublishes a course a student is enrolled in | Student retains access; course hidden from catalog only |

### Payment & Order Flow

| Scenario | System Response |
|---|---|
| Student uploads file larger than 5MB | Client-side validation error before upload: "الحد الأقصى لحجم الملف 5MB" |
| Student uploads unsupported file type | Client-side validation: "يُسمح فقط بملفات JPG, PNG, PDF" |
| Student submits order with no file attached | Form submit blocked; file field highlighted with error |
| Student submits a second order for the same course while one is pending | "لديك طلب قيد المراجعة لهذه الدورة" — purchase button disabled |
| Network failure during proof upload | Upload progress bar stops; error toast: "فشل الرفع، يرجى المحاولة مجدداً" — file selection preserved |
| Admin approves an order that was already approved (duplicate action) | System returns 409 Conflict; dashboard shows "تم قبول هذا الطلب مسبقاً" |
| Student tries to access course URL directly while not enrolled | Redirect to course detail page with purchase CTA |

### Admin Dashboard

| Scenario | System Response |
|---|---|
| Admin tries to delete a course with active enrollments | Warning dialog: "هذه الدورة بها [N] طالب مسجل. هل تريد إلغاء نشرها بدلاً من حذفها؟" — two options: Unpublish or Cancel |
| Admin tries to delete the only lesson in a section | Warning dialog: "لا يمكن حذف الدرس الوحيد في القسم" — redirect to add another first |
| Admin submits course form with empty required fields | Inline validation on all required fields before submit |
| Admin session times out while reviewing an order | On next action, redirect to admin login with return URL preserved |
| Network failure during order approval | Error toast: "فشل تأكيد الطلب، يرجى المحاولة مجدداً" — order status unchanged |

### Comments

| Scenario | System Response |
|---|---|
| Enrolled student submits empty comment | Submit button disabled until minimum 1 character entered |
| Non-enrolled user views lesson with comments | Comments visible in read-only mode; posting area replaced with enrollment CTA |
| Admin deletes a comment | Comment removed immediately; confirmation toast shown; no undo in v1 |

### Empty States (all screens)

| Screen | Empty State Message |
|---|---|
| Course Catalog (no published courses) | "لا توجد دورات متاحة حالياً، ترقب الإضافات القادمة" |
| Student Dashboard (no enrollments) | "لم تنضم إلى أي دورة بعد — [تصفح الدورات]" |
| Student Order History (no orders) | "لا توجد طلبات سابقة" |
| Admin Orders (no pending orders) | "لا توجد طلبات قيد المراجعة حالياً ✓" |
| Admin Comments (no comments) | "لا توجد تعليقات حتى الآن" |
| Lesson Comments (no comments yet) | "كن أول من يعلّق على هذا الدرس" |

---

## Section 8 — UX Behavior Rules

These rules apply universally across every screen in the platform. No exceptions.

### Validation Rules

- All form validation runs **on blur** (when the user leaves a field) and **on submit**
- Errors are displayed **inline**, directly below the relevant field — never in a separate alert box
- Error messages are written in **Arabic**, specific, and actionable (e.g., "يجب أن تكون كلمة المرور 8 أحرف على الأقل" not "خطأ")
- Fields with errors are highlighted with a red border
- Error state clears as soon as the user corrects the input (on input event)
- Required fields are marked with an asterisk (*) adjacent to the label

### Loading States

- Every button that triggers an async action must show a **loading spinner** and become **disabled** for the duration of the request
- Loading spinner replaces the button label (e.g., "جارٍ الحفظ..." with spinner icon)
- Page-level data fetches show a **skeleton loader** matching the content layout — never a blank page
- File upload shows an **inline progress bar** with percentage
- Video player shows a **buffering spinner** centered on the video before playback begins

### Success Feedback

- Every successful action triggers a **toast notification** in the top-right (RTL: top-left) corner
- Toast auto-dismisses after **4 seconds**
- Toast messages are specific: "تم نشر الدورة بنجاح" not "تم"
- After form submission (e.g., order submit), redirect occurs only after the success response — never optimistically

### Error Handling UI

- Network errors (no internet, server 500) show a **full-width banner** at the top of the page with a retry option — never a broken blank page
- 404 pages show a branded empty state with a link back to the homepage
- 403 pages show a clear "لا تملك صلاحية الوصول" message with a back link
- All error states preserve any data the user had entered in forms

### Interaction Patterns

- Destructive actions (delete course, reject order) always require a **confirmation dialog** before executing
- Confirmation dialog must name the specific item being affected: "هل تريد حذف دورة [اسم الدورة]؟"
- Modals close on Escape key and on clicking the backdrop
- All interactive elements (buttons, links, form fields) must have a **focus ring** visible for keyboard navigation
- Disabled buttons must have a `title` tooltip explaining why they are disabled

### RTL-Specific Rules

- All layout uses CSS logical properties (`margin-inline-start`, `padding-inline-end`, etc.)
- Icons with directional meaning (arrows, chevrons, breadcrumb separators) are mirrored for RTL
- Text alignment defaults to `start` (right in RTL) — never hardcoded `right` or `left`
- Toast notifications appear in the **top-left** corner (logical: top-inline-end)
- Progress bars fill from **right to left**

### Theme Rules

- Dark/light mode is controlled by a class on the `<html>` element (`class="dark"`)
- Theme toggle is accessible from the navigation bar on every page
- Theme preference is stored in `localStorage` and applied before first paint to prevent flash
- All colors are defined as CSS variables — no hardcoded color values in components
- Both themes must pass WCAG AA contrast ratio requirements

---

## Section 9 — Functional Requirements

### Feature Mapping

Each P0 feature maps to API endpoints, database entities, and the universal UX rules from Section 8 (`validation`, `loading`, `error`, `success`).

| Feature | API Endpoints | Database Entities | UX Rules |
|---|---|---|---|
| P0-F001 — User Authentication | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `POST /api/v1/auth/refresh` | `Users` | validation, loading, error, success |
| P0-F002 — Course Catalog | `GET /api/v1/courses`, `GET /api/v1/courses/:slug` | `Courses`, `Sections`, `Lessons` | validation, loading, error, success |
| P0-F003 — Free Lesson Preview | `GET /api/v1/courses/:slug`, `GET /api/v1/courses/:slug/lessons/:id` | `Courses`, `Sections`, `Lessons`, `Enrollments` | validation, loading, error, success |
| P0-F004 — Video Lesson Player | `GET /api/v1/courses/:slug/lessons/:id`, `GET /api/v1/lessons/:id/comments` | `Lessons`, `Comments`, `Enrollments` | validation, loading, error, success |
| P0-F005 — Lesson Comments | `GET /api/v1/lessons/:id/comments`, `POST /api/v1/lessons/:id/comments`, `DELETE /api/v1/admin/comments/:id` | `Comments`, `Lessons`, `Users`, `Enrollments` | validation, loading, error, success |
| P0-F006 — Manual Payment Workflow | `POST /api/v1/orders`, `GET /api/v1/orders/my`, `GET /api/v1/admin/orders`, `GET /api/v1/admin/orders/:id`, `POST /api/v1/admin/orders/:id/approve`, `POST /api/v1/admin/orders/:id/reject` | `Orders`, `Enrollments`, `Users`, `Courses` | validation, loading, error, success |
| P0-F007 — Student Dashboard | `GET /api/v1/enrollments/my`, `GET /api/v1/orders/my` | `Enrollments`, `Orders`, `Courses`, `Users` | validation, loading, error, success |
| P0-F008 — Admin Dashboard | `POST /api/v1/admin/courses`, `PUT /api/v1/admin/courses/:id`, `DELETE /api/v1/admin/courses/:id`, `POST /api/v1/admin/courses/:id/publish`, `POST /api/v1/admin/courses/:id/unpublish`, `POST /api/v1/admin/courses/:id/sections`, `POST /api/v1/admin/sections/:id/lessons`, `PUT /api/v1/admin/lessons/:id`, `DELETE /api/v1/admin/lessons/:id`, `GET /api/v1/admin/orders`, `GET /api/v1/admin/orders/:id`, `POST /api/v1/admin/orders/:id/approve`, `POST /api/v1/admin/orders/:id/reject`, `GET /api/v1/admin/students`, `GET /api/v1/admin/students/:id`, `DELETE /api/v1/admin/comments/:id` | `Courses`, `Sections`, `Lessons`, `Orders`, `Enrollments`, `Comments`, `Users` | validation, loading, error, success |
| P0-F009 — RTL Support | Shared across all frontend routes; no dedicated API | N/A — presentation layer requirement | validation, loading, error, success |
| P0-F010 — Arabic Translation | Shared across all frontend routes; no dedicated API | N/A — presentation layer requirement | validation, loading, error, success |
| P0-F011 — Dark / Light Mode | Shared across all frontend routes; no dedicated API | N/A — preference stored client-side in v1 | validation, loading, error, success |

---

### P0-F001 — User Authentication

**Description:** Students can register, log in, and maintain an authenticated session. The admin account is pre-seeded and not publicly registerable.

**User Story:** As a student, I want to register and log in so that I can purchase courses and access my enrollments.

**Trigger:** Student clicks "Register" or "Login."

**Pre-conditions:** Student is not already logged in.

**Post-conditions:** Authenticated session established; student redirected to dashboard or previously viewed course.

**Main Flow:**
1. Student navigates to /register
2. Enters: name, email, password (min 8 characters)
3. System validates: email format, uniqueness, password strength
4. Account created, JWT issued, session started
5. Redirect to /dashboard or previously requested URL

**Alternate Flows:**
- Duplicate email → inline error on email field, no account created
- Weak password → inline error on password field before submit
- Network failure → toast error, form data preserved

**Definition of Done:**
- [ ] Student can register with name, email, password
- [ ] Duplicate email registration returns 409 with inline error
- [ ] Student can log in with valid credentials and receive JWT
- [ ] Invalid credentials return 401 with non-enumerable error message
- [ ] Authenticated session persists across page refreshes via refresh token
- [ ] Logout clears both access and refresh tokens
- [ ] Admin account is not accessible via public registration
- [ ] All form errors display in Arabic inline below the relevant field
- [ ] Loading spinner shown on submit button during request

---

### P0-F002 — Course Catalog

**Description:** A browsable page displaying all published courses with thumbnail, title, short description, and price. No login required.

**User Story:** As a visitor, I want to browse all available courses so that I can find one that matches my goals.

**Trigger:** Visitor navigates to /courses

**Pre-conditions:** At least one course is published.

**Post-conditions:** All published courses are displayed.

**Main Flow:**
1. Visitor navigates to /courses
2. System fetches all courses where `status = published`
3. Each course card displays: thumbnail, title (Arabic), short description, price
4. Visitor clicks card → navigates to /courses/:slug

**Alternate Flows:**
- No published courses → empty state with Arabic message
- Network failure → error banner with retry

**Definition of Done:**
- [ ] All published courses visible without login
- [ ] Each card shows thumbnail, title, description, price
- [ ] Draft/unpublished courses hidden from all non-admin users
- [ ] Clicking a card navigates to correct course detail page
- [ ] Empty state shown when no courses are published
- [ ] Page renders correctly in RTL
- [ ] Skeleton loader shown during data fetch
- [ ] Page load under 2 seconds

---

### P0-F003 — Free Lesson Preview

**Description:** First 5 lessons of every course are accessible without login. Lessons 6+ are locked until enrolled.

**User Story:** As a visitor, I want to watch the first 5 lessons for free so that I can evaluate the course before buying.

**Trigger:** Visitor clicks a lesson in the course detail lesson list.

**Pre-conditions:** Lesson index ≤ 5.

**Post-conditions:** Visitor can watch video and read description without authentication.

**Main Flow:**
1. Visitor opens course detail page
2. Lesson list displays lessons 1–5 labeled "مجاني" (free), lessons 6+ labeled "مقفل" with lock icon
3. Visitor clicks lesson ≤ 5 → navigates to /courses/:slug/lessons/:id
4. Video player and description load without auth check

**Alternate Flows:**
- Visitor clicks locked lesson (6+) while not logged in → "Purchase Required" modal with Register/Login CTA
- Visitor clicks locked lesson while logged in but not enrolled → "Purchase Required" modal with Buy CTA
- Course has fewer than 5 lessons → all lessons are free

**Definition of Done:**
- [ ] Lessons 1–5 accessible without authentication
- [ ] Lessons 6+ display locked state for non-enrolled users
- [ ] Free lessons labeled "مجاني" in lesson list
- [ ] Locked lesson click triggers purchase modal
- [ ] Direct URL access to locked lesson redirected for non-enrolled users
- [ ] Works correctly when course has fewer than 5 lessons (all free)

---

### P0-F004 — Video Lesson Player

**Description:** Each lesson has an embedded video player, lesson title, description, and comment section.

**User Story:** As an enrolled student, I want to watch lesson videos with a clean player and read the lesson description.

**Trigger:** Student or visitor clicks an accessible lesson.

**Pre-conditions:** Lesson is either free preview or student is enrolled.

**Post-conditions:** Video, description, and comments are displayed.

**Main Flow:**
1. User navigates to /courses/:slug/lessons/:id
2. Auth check: free preview → no auth needed; lesson 6+ → enrollment check
3. Embedded video player renders (iframe from video host)
4. Lesson title displayed above player
5. Lesson description (rich text, Arabic) displayed below player
6. Comment section rendered below description

**Alternate Flows:**
- Video fails to load → error state with retry button
- Unenrolled student accesses lesson 6+ via direct URL → redirect to course detail page with purchase CTA

**Definition of Done:**
- [ ] Video player embeds and plays correctly
- [ ] Standard controls: play, pause, seek, volume, fullscreen
- [ ] Lesson title displayed above player
- [ ] Lesson description displayed below player (supports rich text)
- [ ] Comment section rendered below description
- [ ] Unenrolled users blocked from non-preview lessons at URL level
- [ ] Video error state shown with retry on load failure
- [ ] Layout renders correctly in RTL

---

### P0-F005 — Lesson Comments

**Description:** Comment section under each lesson for enrolled students. Admin can delete any comment.

**User Story:** As an enrolled student, I want to post a comment under a lesson so I can ask questions and engage.

**Trigger:** Enrolled student submits a comment.

**Pre-conditions:** Student is logged in and enrolled in the course.

**Post-conditions:** Comment saved and displayed immediately.

**Main Flow:**
1. Student scrolls to comment section on lesson page
2. Text area displayed: "أضف تعليقاً..."
3. Student types comment, clicks "نشر"
4. System validates: not empty, student is enrolled
5. Comment saved with: student name, timestamp, content
6. Comment displayed immediately at top of comment list

**Alternate Flows:**
- Student not enrolled → read-only comment list, text area replaced with enrollment CTA
- Empty submit → submit button remains disabled
- Network failure → error toast, comment text preserved in field

**Definition of Done:**
- [ ] Enrolled students can post comments on any lesson
- [ ] Comments display student name and formatted timestamp
- [ ] Non-enrolled visitors see comments in read-only mode
- [ ] Empty comment cannot be submitted
- [ ] Admin can delete any comment from admin dashboard
- [ ] Deleted comment removed from lesson page on next load
- [ ] Comment text area supports RTL Arabic input

---

### P0-F006 — Manual Payment Workflow

**Description:** Student uploads payment proof image; admin reviews and approves or rejects. Approval grants course access. This replaces a payment gateway in v1.

**User Story:** As a student, I want to upload my payment proof so the admin can verify and grant me access to the course.

**Trigger:** Student clicks "Purchase Course" on a course they are not enrolled in.

**Pre-conditions:** Student is logged in and not already enrolled in or pending review for the course.

**Post-conditions:** Order created with status `pending_review`.

**Main Flow:**
1. Student clicks "Purchase Course" on course detail page
2. System checks: not enrolled, no pending order → proceed
3. Payment Instructions page displayed: bank/Vodafone Cash details
4. Student completes external payment, returns to platform
5. Student clicks "رفع إثبات الدفع"
6. File upload field: accepts JPG, PNG, PDF — max 5MB
7. Student uploads file, clicks "إرسال الطلب"
8. Order created: `student_id`, `course_id`, `proof_url`, `status: pending_review`, `created_at`
9. Student redirected to dashboard: order visible with "قيد المراجعة" badge
10. Admin sees notification in dashboard
11. Admin opens order: views proof image, student info, course name
12. Admin clicks "قبول" → confirmation dialog → confirm
13. Enrollment record created: student gets full course access
14. Order status updated to `approved`
15. Admin clicks "رفض" → rejection dialog with optional reason → confirm
16. Order status updated to `rejected`, reason stored
17. Student dashboard shows "مرفوض" with rejection reason

**Alternate Flows:**
- Student already has pending order for course → "Purchase Course" button disabled with tooltip
- File > 5MB → client-side error before upload attempt
- Invalid file type → client-side error before upload attempt
- Network failure during upload → progress bar stops, error toast, file preserved
- Admin approves already-approved order → 409 response, toast: "تم قبول هذا الطلب مسبقاً"

**Definition of Done:**
- [ ] Student cannot initiate order if one is already pending for the same course
- [ ] File upload accepts JPG, PNG, PDF only, max 5MB — validated client-side
- [ ] Order created with correct status `pending_review` on submission
- [ ] Admin can view proof image in order detail (click to enlarge)
- [ ] Admin approve action creates enrollment and unlocks course immediately
- [ ] Admin reject action stores optional reason
- [ ] Student dashboard reflects updated order status on refresh
- [ ] Student cannot access course content while order is pending or rejected
- [ ] Direct URL to course lesson redirects unenrolled students to course detail
- [ ] Duplicate order submission returns 409 error

---

### P0-F007 — Student Dashboard

**Description:** Private dashboard for logged-in students showing enrolled courses, order statuses, and order history.

**User Story:** As a student, I want a personal dashboard to see my enrolled courses and purchase request statuses.

**Trigger:** Student logs in or navigates to /dashboard.

**Pre-conditions:** Student is logged in.

**Post-conditions:** All enrolled courses and orders displayed.

**Main Flow:**
1. Student logs in → redirected to /dashboard
2. Section 1 — My Courses: cards for each enrolled course with "متابعة التعلم" link
3. Section 2 — My Orders: list of all orders with status badges and timestamps
4. Student clicks "متابعة التعلم" → navigates to next unwatched lesson (or first lesson if none watched)
5. Student clicks rejected order → sees rejection reason, "إعادة الإرسال" button

**Alternate Flows:**
- No enrollments and no orders → empty state with "تصفح الدورات" CTA
- No enrollments but has pending orders → orders section only, courses section shows empty state

**Definition of Done:**
- [ ] Dashboard accessible only to authenticated students
- [ ] All enrolled courses shown with "متابعة التعلم" link
- [ ] All orders shown with status: قيد المراجعة / مقبول / مرفوض
- [ ] Rejected orders display rejection reason
- [ ] "إعادة الإرسال" button on rejected orders opens proof upload flow
- [ ] Empty state shown when no enrollments or orders exist
- [ ] Dashboard renders correctly in RTL and Arabic
- [ ] Skeleton loader shown during data fetch

---

### P0-F008 — Admin Dashboard

**Description:** Private admin panel for managing courses, students, orders, and comments. Accessible only to the admin role.

**User Story:** As the admin, I want a single dashboard to manage every aspect of the platform without developer assistance.

**Trigger:** Admin logs in with admin credentials.

**Pre-conditions:** User has `role: admin`.

**Post-conditions:** Admin can view and manage all platform data.

**Main Flow:**
1. Admin logs in → redirected to /admin
2. Summary cards: total published courses, total students, pending orders count, recent comments count
3. Navigation: Courses | Orders | Students | Comments
4. **Courses:** List of all courses (draft and published). Actions: Create, Edit, Publish, Unpublish, Delete
5. **Course Editor:** Create/edit course with: title, description (rich text), thumbnail, price, status. Add/edit/delete sections and lessons within course
6. **Orders:** List of all orders, filterable by status. Click order → Order Detail View with proof image, approve/reject actions
7. **Students:** Read-only list of all registered students with name, email, enrollment count, join date
8. **Comments:** List of all comments across all lessons, orderable by date. Delete action per comment

**Alternate Flows:**
- Non-admin user accesses /admin → redirect to /dashboard with 403 toast
- Admin deletes course with active enrollments → warning dialog: unpublish or cancel
- Network failure during approve/reject → error toast, order status unchanged

**Definition of Done:**
- [ ] /admin routes return 403 for non-admin roles
- [ ] Admin can create course with all fields and publish it
- [ ] Admin can add sections and lessons to a course
- [ ] Admin can publish and unpublish courses
- [ ] Admin can view all orders filtered by status
- [ ] Admin can view proof image in order detail (full-size view)
- [ ] Admin approve creates enrollment immediately
- [ ] Admin reject stores reason and updates order status
- [ ] Admin can delete any comment
- [ ] Admin can view all registered students
- [ ] Delete course with enrollments shows warning dialog
- [ ] All admin actions logged with timestamp and admin ID

---

### P0-F009 — RTL Support

**Definition of Done:**
- [ ] `dir="rtl"` set on `<html>` element
- [ ] All layouts use CSS logical properties
- [ ] Directional icons mirrored for RTL
- [ ] Text inputs accept and display Arabic correctly
- [ ] RTL validated on Chrome, Safari, Firefox, Edge

---

### P0-F010 — Arabic Translation

**Definition of Done:**
- [ ] All UI strings externalized to Arabic translation file
- [ ] No untranslated English strings visible to end users
- [ ] Error messages in Arabic, specific, and actionable
- [ ] i18n library configured (react-i18next or equivalent)
- [ ] Translation covers: navigation, buttons, forms, errors, empty states, toasts, confirmation dialogs

---

### P0-F011 — Dark / Light Mode

**Definition of Done:**
- [ ] Theme toggle in navigation bar on all pages
- [ ] Dark mode class applied to `<html>` element
- [ ] All colors use CSS variables — no hardcoded values
- [ ] Theme preference stored in `localStorage` and applied before first paint
- [ ] Both themes pass WCAG AA contrast ratio
- [ ] Dark/light mode consistent across all pages and both dashboards

---

### P1-F001 — Course Search and Filter

**Definition of Done:**
- [ ] Search bar on /courses filters by title and description keywords
- [ ] Category filter narrows results to selected category
- [ ] Price range filter works with min/max inputs
- [ ] Filters work in combination
- [ ] Empty results show Arabic empty state message
- [ ] Search results update without full page reload

---

### P1-F002 — Order History

**Definition of Done:**
- [ ] Dedicated section in student dashboard lists all orders (pending, approved, rejected)
- [ ] Each order shows: course name, submission date, status, rejection reason if applicable
- [ ] Rejected orders have "إعادة الإرسال" action

---

### P1-F003 — Email Notifications

**Definition of Done:**
- [ ] Approval email sent to student automatically on order approval
- [ ] Rejection email sent to student automatically on order rejection
- [ ] Approval email contains course name and direct link to course
- [ ] Rejection email contains reason if admin provided one
- [ ] Emails written in Arabic
- [ ] Email service configured (Resend or SendGrid)

---

### P1-F004 — Lesson Progress Indicator

**Definition of Done:**
- [ ] Lesson marked as "watched" when student reaches 80% of video duration
- [ ] Watched lessons show checkmark in lesson list
- [ ] Progress persists across sessions per student per course
- [ ] "متابعة التعلم" on dashboard links to first unwatched lesson

---

## Section 10 — API Design

All endpoints versioned under `/api/v1/`. All responses in JSON. Authentication via Bearer JWT in Authorization header.

### Error Handling Standard

All API errors must follow this shape:

```json
{
  "code": "STRING_CONSTANT",
  "message": "human readable",
  "details": {}
}
```

Rules:
- `code` is stable and machine-readable (example: `INVALID_CREDENTIALS`, `ORDER_ALREADY_EXISTS`)
- `message` is a human-readable summary intended for UI/error logging
- `details` is optional and reserved for structured context such as field validation errors, retry metadata, or rate-limit info
- 4xx responses are used for client/input/auth/business-rule errors; 5xx responses are used for unexpected server failures
- Frontend must map API errors to the Section 8 UX states: inline validation when field-specific, banner/toast for network/server failures, and preserved form state on failure

Rate limiting and abuse protection:
- Login rate limit: 5 attempts per 5 minutes per IP
- Comment spam detection: basic throttling on comment creation per authenticated user and IP
- Upload abuse protection: maximum uploads per hour per user and IP, with `429 Too Many Requests` on violation

**Standard error examples**
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "details": {
    "fields": {
      "email": "Invalid email format"
    }
  }
}
```

```json
{
  "code": "RATE_LIMITED",
  "message": "Too many attempts. Please try again later.",
  "details": {
    "retryAfterSeconds": 300
  }
}
```

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/v1/auth/register | None | Register new student account |
| POST | /api/v1/auth/login | None | Login, receive access + refresh tokens |
| POST | /api/v1/auth/logout | Student | Invalidate refresh token |
| POST | /api/v1/auth/refresh | None | Exchange refresh token for new access token |

**POST /api/v1/auth/register**
```
Request:  { name, email, password }
Response 201: { user: { id, name, email }, accessToken, refreshToken }
Response 409: { code: "EMAIL_ALREADY_EXISTS", message: "Email is already registered" }
Response 422: { code: "VALIDATION_ERROR", message: "Request validation failed", details: { fields: { email?, password? } } }
```

**POST /api/v1/auth/login**
```
Request:  { email, password }
Response 200: { user: { id, name, email, role }, accessToken, refreshToken }
Response 401: { code: "INVALID_CREDENTIALS", message: "Email or password is incorrect" }
Response 429: { code: "RATE_LIMITED", message: "Too many login attempts. Please try again later.", details: { retryAfterSeconds: 300 } }
```

### Courses (Public)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/v1/courses | None | List all published courses |
| GET | /api/v1/courses/:slug | None | Get course detail + lesson list |
| GET | /api/v1/courses/:slug/lessons/:id | Conditional | Get lesson (auth required if lesson > 5) |

**GET /api/v1/courses**
```
Response 200: {
  courses: [{
    id, slug, title, description, thumbnailUrl,
    price, lessonsCount, createdAt
  }]
}
```

**GET /api/v1/courses/:slug/lessons/:id**
```
Response 200: {
  lesson: { id, title, videoUrl, description, index, isFreePreview },
  enrollment: { enrolled: bool }
}
Response 403: { code: "ENROLLMENT_REQUIRED", message: "Enrollment is required to access this lesson" }  // lesson > 5 and not enrolled
```

### Courses (Admin)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/v1/admin/courses | Admin | Create new course |
| PUT | /api/v1/admin/courses/:id | Admin | Update course |
| DELETE | /api/v1/admin/courses/:id | Admin | Delete course |
| POST | /api/v1/admin/courses/:id/publish | Admin | Publish course |
| POST | /api/v1/admin/courses/:id/unpublish | Admin | Unpublish course |
| POST | /api/v1/admin/courses/:id/sections | Admin | Add section |
| POST | /api/v1/admin/sections/:id/lessons | Admin | Add lesson |
| PUT | /api/v1/admin/lessons/:id | Admin | Update lesson |
| DELETE | /api/v1/admin/lessons/:id | Admin | Delete lesson |

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/v1/orders | Student | Create order (with proof upload) |
| GET | /api/v1/orders/my | Student | Get current student's orders |
| GET | /api/v1/admin/orders | Admin | List all orders (filterable by status) |
| GET | /api/v1/admin/orders/:id | Admin | Get order detail |
| POST | /api/v1/admin/orders/:id/approve | Admin | Approve order, create enrollment |
| POST | /api/v1/admin/orders/:id/reject | Admin | Reject order with optional reason |

**POST /api/v1/orders**
```
Request:  multipart/form-data { courseId, proofFile }
Response 201: { order: { id, courseId, status: "pending_review", createdAt } }
Response 409: { code: "ORDER_ALREADY_EXISTS", message: "A pending order already exists for this course" }  // pending order exists
Response 409: { code: "ALREADY_ENROLLED", message: "Student is already enrolled in this course" }
Response 422: { code: "INVALID_FILE_TYPE", message: "Only JPG, PNG, and PDF files are allowed" }
Response 422: { code: "FILE_TOO_LARGE", message: "File exceeds the maximum size of 5MB" }
Response 429: { code: "UPLOAD_RATE_LIMITED", message: "Upload limit reached. Please try again later.", details: { retryAfterSeconds: 3600 } }
```

**POST /api/v1/admin/orders/:id/approve**
```
Response 200: { order: { id, status: "approved" }, enrollment: { id, courseId, studentId } }
Response 409: { code: "ALREADY_APPROVED", message: "Order has already been approved" }
Response 404: { code: "ORDER_NOT_FOUND", message: "Order was not found" }
```

**POST /api/v1/admin/orders/:id/reject**
```
Request:  { reason?: string }
Response 200: { order: { id, status: "rejected", reason } }
```

### Enrollments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/v1/enrollments/my | Student | Get current student's enrollments |

### Comments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/v1/lessons/:id/comments | None | List comments for a lesson |
| POST | /api/v1/lessons/:id/comments | Student (enrolled) | Post comment |
| DELETE | /api/v1/admin/comments/:id | Admin | Delete any comment |

**POST /api/v1/lessons/:id/comments**
```
Request:  { content }
Response 201: { comment: { id, content, author: { name }, createdAt } }
Response 403: { code: "ENROLLMENT_REQUIRED", message: "Enrollment is required to comment on this lesson" }
Response 422: { code: "EMPTY_CONTENT", message: "Comment content cannot be empty" }
Response 429: { code: "COMMENT_RATE_LIMITED", message: "Too many comments submitted in a short time.", details: { retryAfterSeconds: 60 } }
```

### Students (Admin)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/v1/admin/students | Admin | List all students |
| GET | /api/v1/admin/students/:id | Admin | Get student detail with enrollments |

---

## Section 11 — Data Model

### Entity Relationship Overview

```
Users
  ├── Orders (userId → courseId)
  │     └── Enrollments (created on order approval)
  └── Comments (userId → lessonId)

Courses
  └── Sections
        └── Lessons
              └── Comments
```

### Users

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | Auto-generated |
| name | VARCHAR(100) | NOT NULL | Display name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Lowercase, trimmed |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt, cost 12 |
| role | ENUM('admin','student') | NOT NULL, DEFAULT 'student' | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |
| updated_at | TIMESTAMPTZ | NOT NULL | Auto-updated |

### Courses

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| slug | VARCHAR(255) | NOT NULL, UNIQUE | URL-safe, Arabic-transliterated |
| title | VARCHAR(255) | NOT NULL | Arabic |
| description | TEXT | NOT NULL | Rich text (HTML) |
| thumbnail_url | VARCHAR(500) | NOT NULL | Hosted image URL |
| price | DECIMAL(10,2) | NOT NULL | EGP |
| status | ENUM('draft','published') | NOT NULL, DEFAULT 'draft' | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

### Sections

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| course_id | UUID | FK → Courses.id, CASCADE DELETE | |
| title | VARCHAR(255) | NOT NULL | Arabic |
| order_index | INTEGER | NOT NULL | Display order |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |

### Lessons

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| section_id | UUID | FK → Sections.id, CASCADE DELETE | |
| title | VARCHAR(255) | NOT NULL | Arabic |
| video_url | VARCHAR(500) | NOT NULL | External video host URL |
| description | TEXT | | Rich text (HTML), nullable |
| order_index | INTEGER | NOT NULL | Global index within course (1, 2, 3...) used for free preview check |
| is_free_preview | BOOLEAN | NOT NULL, DEFAULT false | True when order_index ≤ 5 — computed on creation |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |

### Orders

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| student_id | UUID | FK → Users.id | |
| course_id | UUID | FK → Courses.id | |
| proof_url | VARCHAR(500) | NOT NULL | Secure storage URL |
| status | ENUM('pending_review','approved','rejected') | NOT NULL, DEFAULT 'pending_review' | |
| rejection_reason | TEXT | | Nullable |
| reviewed_at | TIMESTAMPTZ | | Nullable — set on approve/reject |
| reviewed_by | UUID | FK → Users.id | Admin user ID |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |

**Unique constraint:** `(student_id, course_id)` WHERE `status = 'pending_review'` — enforced at DB level to prevent duplicate pending orders.

### Enrollments

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| student_id | UUID | FK → Users.id | |
| course_id | UUID | FK → Courses.id | |
| order_id | UUID | FK → Orders.id, UNIQUE | One enrollment per order |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |

**Unique constraint:** `(student_id, course_id)` — a student can only be enrolled in a course once.

### Comments

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| lesson_id | UUID | FK → Lessons.id, CASCADE DELETE | |
| student_id | UUID | FK → Users.id | |
| content | TEXT | NOT NULL | Min 1 character |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |
| deleted_at | TIMESTAMPTZ | | Soft delete by admin (nullable) |

### LessonProgress (P1-F004)

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| student_id | UUID | FK → Users.id | |
| lesson_id | UUID | FK → Lessons.id | |
| watched_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Set when student reaches 80% of video |

**Unique constraint:** `(student_id, lesson_id)`

---

## Section 12 — Non-Functional Requirements

### Performance

| Requirement | Target | Measurement |
|---|---|---|
| Page load time (P75) | < 2 seconds | Lighthouse / Real User Monitoring |
| API response time (P95) | < 500ms | Server-side request logging |
| Video playback start | < 3 seconds | Dependent on video host CDN |
| Concurrent users (v1) | 500 without degradation | Load test before launch |

### Security

- All API endpoints require auth except: `GET /courses`, `GET /courses/:slug`, `GET /lessons/:id` (free preview only), `POST /auth/register`, `POST /auth/login`
- All inputs validated and sanitized server-side — never trust client
- Uploaded proof files validated by MIME type (not extension only)
- Proof files stored with non-guessable URLs (UUID-based paths in private storage bucket)
- All data in transit: TLS 1.3
- All data at rest: AES-256
- Passwords hashed: bcrypt, cost factor 12
- JWT access token expiry: 15 minutes
- Refresh token expiry: 7 days; rotation on each use
- Admin routes protected by role middleware — return 403 for non-admin
- All admin actions logged: timestamp, admin ID, action type, target entity ID
- Login rate limit: 5 attempts per 5 minutes per IP
- Comment spam detection via basic throttling per authenticated user and IP
- Upload abuse protection via per-user and per-IP hourly upload limits

### Availability and Reliability

- Target uptime: 99.9% monthly (excluding scheduled maintenance)
- Daily automated database backups with 30-day retention
- Scheduled maintenance communicated 24 hours in advance

### Accessibility

- WCAG 2.1 Level AA compliance on all pages
- All images include descriptive Arabic alt text
- All interactive elements keyboard navigable with visible focus ring
- Color contrast ratios meet WCAG AA minimums in both dark and light modes

### Browser and Device Compatibility

- Desktop: Chrome 100+, Safari 15+, Firefox 100+, Edge 100+
- Mobile viewports: 320px minimum width
- Responsive breakpoints: mobile (< 768px), tablet (768px–1279px), desktop (≥ 1280px)
- RTL layout validated on all supported browsers

### Observability

- Structured JSON logging for all server-side events
- Log fields: timestamp, level, requestId, userId, method, path, statusCode, durationMs
- Error rate > 1% in any 5-minute window triggers alert
- All critical admin actions logged to audit log table
- Uptime monitoring with alerting on downtime > 2 minutes

### Data and Compliance

- Student personal data handled per GDPR principles
- Payment proof images deleted 90 days after order resolution
- No plaintext passwords stored at any point

### Analytics Events

- `course_viewed`
- `lesson_started`
- `lesson_completed`
- `order_submitted`
- `order_approved`

### Scalability Notes

- Move video delivery to CDN (already partially there)
- Add pagination for courses and comments
- Prepare for multi-instructor support in a future version

### Background Jobs

- Email sending runs through a queue-based worker
- Order approval notifications run asynchronously
- Cleanup tasks delete payment proof images 90 days after resolution

### Versioning Strategy

- No breaking changes in v1
- New features ship as v1 minor updates
- Breaking changes require v2

---

## Section 13 — Technical Architecture

### Frontend

- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS with CSS variables for theming
- **RTL:** `dir="rtl"` on `<html>`; CSS logical properties throughout; no hardcoded `left`/`right`
- **i18n:** react-i18next with Arabic as default locale
- **Theme:** Tailwind dark mode (`class` strategy); theme class on `<html>`; localStorage persistence
- **Routing:** React Router v6; protected routes for `/dashboard` and `/admin`
- **State:** React Query for server state; Zustand or Context for UI state (theme, auth)
- **Forms:** React Hook Form + Zod for validation
- **File Upload:** Axios with multipart/form-data and upload progress tracking

### Backend

- **Runtime:** Node.js 20 + TypeScript
- **Framework:** Express.js
- **ORM:** Prisma with PostgreSQL
- **Auth:** JWT (access + refresh token pattern); tokens issued on login, rotated on refresh
- **File Handling:** Multer for upload parsing; file stored to S3-compatible bucket
- **Validation:** Zod on all request bodies
- **API Style:** REST, versioned `/api/v1/`
- **Logging:** Pino (structured JSON)
- **Testing:** Vitest (unit), Supertest (integration)

### Database

- **Primary:** PostgreSQL 15
- **Cache:** Redis (session management, rate limiting)
- **Migrations:** Prisma Migrate
- **Connection pooling:** PgBouncer or Prisma connection pool

### Infrastructure

- **Frontend hosting:** Vercel
- **Backend hosting:** Railway or Render
- **Database hosting:** Supabase or Railway PostgreSQL
- **File storage:** Cloudflare R2 or AWS S3 (private bucket, signed URLs for proof images)
- **Video hosting:** Bunny.net or Vimeo (decision required Phase 1, Week 1)
- **Email service:** Resend or SendGrid (for P1-F003)
- **CI/CD:** GitHub Actions — lint → test → build → deploy to staging on PR merge; manual promote to production

### Auth and Authorization Design

```
Request arrives at API
    ↓
Auth middleware: extract Bearer token from Authorization header
    ↓
Verify JWT signature + expiry
    ↓
If expired: return 401 → client uses refresh token → new access token issued
    ↓
Attach user { id, role } to request context
    ↓
Route handler checks role:
  - Admin routes: if role !== 'admin' → return 403
  - Student routes: if !user → return 401
  - Public routes: pass through
```

---

## Section 14 — Build Order and Execution Sequence

The following sequence ensures no team blocks another. Each phase has a strict entry gate.

### Phase 1 — Foundation (Weeks 1–2)
**Entry gate:** PRD signed off, design assets delivered, video host selected

- [ ] Repository setup: monorepo or separate frontend/backend repos
- [ ] CI/CD pipeline: lint, test, build, deploy to staging
- [ ] Database schema created (Users, Courses, Sections, Lessons)
- [ ] Prisma migrations for core entities
- [ ] Auth API: register, login, logout, refresh (`/api/v1/auth/*`)
- [ ] RTL + i18n baseline: `dir="rtl"`, react-i18next configured, Arabic locale file created
- [ ] Dark/light theme system: CSS variables, Tailwind config, localStorage persistence
- [ ] Course catalog page: `/courses` — fetch and display published courses
- [ ] Course detail page: `/courses/:slug` — lesson list with free/locked labels
- [ ] Lesson player page: `/courses/:slug/lessons/:id` — free preview, no auth required

**Phase 1 validation gate:** A visitor can browse catalog, view course detail, and watch 5 free lessons. RTL and dark/light mode functional. Staging deployment live.

---

### Phase 2 — Enrollment Flow (Weeks 3–4)
**Entry gate:** Phase 1 validation gate passed

- [ ] Database schema: Orders, Enrollments
- [ ] Order API: create order with proof upload, get my orders
- [ ] Proof file upload: Multer + S3 storage, MIME validation, size limit
- [ ] Student registration + login UI
- [ ] Payment instructions page
- [ ] Proof upload form with progress indicator
- [ ] Student dashboard: enrolled courses, order status badges
- [ ] Lesson access control: enforce enrollment on lessons 6+
- [ ] Admin: Orders section — list, filter by status, order detail view with proof image
- [ ] Admin: Approve order action → enrollment creation
- [ ] Admin: Reject order action with reason field
- [ ] Lesson comments: post, display, enrollment check

**Phase 2 validation gate:** A student can register, upload proof, and receive course access after admin approval. Admin can action orders. Comments work for enrolled students.

---

### Phase 3 — Admin Panel and Polish (Weeks 5–6)
**Entry gate:** Phase 2 validation gate passed

- [ ] Admin: Full course CRUD (create, edit, publish, unpublish, delete)
- [ ] Admin: Section and lesson management within course editor
- [ ] Admin: Student list view
- [ ] Admin: Comment moderation (delete)
- [ ] Admin: In-dashboard pending order notification count
- [ ] Audit logging for all admin actions
- [ ] Dark/light mode applied to all remaining pages and admin dashboard
- [ ] RTL validated across all pages: admin dashboard, lesson player, forms
- [ ] Complete Arabic translation: all remaining UI strings
- [ ] Empty states implemented on all screens
- [ ] Edge case handling: all scenarios from Section 7 implemented

**Phase 3 validation gate:** Admin can manage all content without developer help. All pages pass RTL and dark/light mode. All edge cases handled.

---

### Phase 4 — Launch Hardening (Weeks 7–8)
**Entry gate:** Phase 3 validation gate passed

- [ ] P1-F001: Course search and filter
- [ ] P1-F002: Order history page
- [ ] P1-F003: Email notifications (approval/rejection)
- [ ] P1-F004: Lesson progress indicator
- [ ] Full end-to-end QA: all user flows tested
- [ ] Cross-browser testing: Chrome, Safari, Firefox, Edge
- [ ] Mobile responsiveness testing: 320px, 768px, 1280px
- [ ] Security review: input validation, file upload, auth routes, rate limiting
- [ ] Load test: 500 concurrent users
- [ ] Performance audit: Lighthouse score, API response times
- [ ] Database: backup configured, indexes on frequently queried columns
- [ ] Monitoring: uptime alerts, error rate alerts configured
- [ ] Production environment provisioned and configured
- [ ] Production deployment and smoke test

**Phase 4 validation gate:** All P0 and P1 features functional. QA sign-off received. Production smoke test passed. Launch approved by Yousef Abdallah.

---

## Section 15 — User Stories Backlog

### Epic 1 — Authentication

| Story ID | User Story | Priority | Feature | Status |
|---|---|---|---|---|
| US-001 | As a visitor, I want to register so that I can purchase courses | P0 | P0-F001 | TODO |
| US-002 | As a student, I want to log in so that I can access my dashboard | P0 | P0-F001 | TODO |
| US-003 | As a student, I want to log out so that my account is secure | P0 | P0-F001 | TODO |
| US-004 | As a student, I want my session to persist across page refreshes | P0 | P0-F001 | TODO |

### Epic 2 — Course Discovery

| Story ID | User Story | Priority | Feature | Status |
|---|---|---|---|---|
| US-005 | As a visitor, I want to browse all courses without logging in | P0 | P0-F002 | TODO |
| US-006 | As a visitor, I want to see course detail with lesson list | P0 | P0-F002 | TODO |
| US-007 | As a visitor, I want to watch the first 5 lessons free | P0 | P0-F003 | TODO |
| US-008 | As a visitor, I want locked lessons to prompt me to purchase | P0 | P0-F003 | TODO |
| US-009 | As a student, I want to search courses by keyword | P1 | P1-F001 | TODO |
| US-010 | As a student, I want to filter courses by category and price | P1 | P1-F001 | TODO |

### Epic 3 — Learning Experience

| Story ID | User Story | Priority | Feature | Status |
|---|---|---|---|---|
| US-011 | As an enrolled student, I want to watch lesson videos with standard controls | P0 | P0-F004 | TODO |
| US-012 | As an enrolled student, I want to read the lesson description below the video | P0 | P0-F004 | TODO |
| US-013 | As an enrolled student, I want to post a comment on a lesson | P0 | P0-F005 | TODO |
| US-014 | As a visitor, I want to read lesson comments without posting | P0 | P0-F005 | TODO |
| US-015 | As an enrolled student, I want to see which lessons I have watched | P1 | P1-F004 | TODO |

### Epic 4 — Purchase Flow

| Story ID | User Story | Priority | Feature | Status |
|---|---|---|---|---|
| US-016 | As a student, I want to see payment instructions before uploading proof | P0 | P0-F006 | TODO |
| US-017 | As a student, I want to upload my payment screenshot | P0 | P0-F006 | TODO |
| US-018 | As a student, I want to see my order status on my dashboard | P0 | P0-F007 | TODO |
| US-019 | As a student, I want to resubmit proof after rejection | P0 | P0-F006 | TODO |
| US-020 | As a student, I want an email when my order is approved or rejected | P1 | P1-F003 | TODO |
| US-021 | As a student, I want to see my full order history | P1 | P1-F002 | TODO |

### Epic 5 — Admin Operations

| Story ID | User Story | Priority | Feature | Status |
|---|---|---|---|---|
| US-022 | As the admin, I want to create and publish courses with sections and lessons | P0 | P0-F008 | TODO |
| US-023 | As the admin, I want to view and action all pending orders | P0 | P0-F008 | TODO |
| US-024 | As the admin, I want to view the student's proof image before approving | P0 | P0-F006 | TODO |
| US-025 | As the admin, I want to approve an order and grant course access | P0 | P0-F006 | TODO |
| US-026 | As the admin, I want to reject an order with an optional reason | P0 | P0-F006 | TODO |
| US-027 | As the admin, I want to delete inappropriate comments | P0 | P0-F008 | TODO |
| US-028 | As the admin, I want to see a list of all registered students | P0 | P0-F008 | TODO |

### Epic 6 — Localization and Theming

| Story ID | User Story | Priority | Feature | Status |
|---|---|---|---|---|
| US-029 | As a user, I want the entire platform in Arabic | P0 | P0-F010 | TODO |
| US-030 | As a user, I want the layout to be right-to-left | P0 | P0-F009 | TODO |
| US-031 | As a user, I want to toggle dark and light mode | P0 | P0-F011 | TODO |
| US-032 | As a user, I want my theme preference saved across sessions | P0 | P0-F011 | TODO |

---

## Section 16 — Success Metrics and KPIs

### Business Metrics

| Metric | Target | Measurement Method | Review Cadence | Owner |
|---|---|---|---|---|
| Student activation rate (register → enroll ≥ 1 course) | > 60% within 30 days | DB query: enrollments / registrations | 30-day post-launch | Yousef Abdallah |
| Order approval rate | > 80% | DB query: approved / total orders | Weekly | Yousef Abdallah |
| Revenue — Month 1 | [TBD after pricing set] | Order records × course price | Monthly | Yousef Abdallah |
| Course catalog conversion (visitor → order submitted) | > 15% of visitors who watch a free preview | Funnel: preview views → orders | 30-day post-launch | [TBD] |

### Product Metrics

| Metric | Target | Measurement Method | Review Cadence | Owner |
|---|---|---|---|---|
| Average lessons watched per enrolled student (Week 1) | > 5 lessons | Lesson view logs | 1-week post-launch | [TBD] |
| Comment engagement rate | > 1 comment per enrolled student per course | Comment table query | 30-day post-launch | [TBD] |
| Order-to-approval time | < 24 hours median | `reviewed_at - created_at` on orders | Weekly | Yousef Abdallah |

### Technical Metrics

| Metric | Target | Measurement Method | Review Cadence | Owner |
|---|---|---|---|---|
| Page load time (P75) | < 2 seconds | Lighthouse / RUM | Weekly | Tech Lead |
| API response time (P95) | < 500ms | Server logs / APM | Weekly | Tech Lead |
| Error rate | < 0.1% of all requests | Error logging dashboard | Daily | Tech Lead |
| Platform uptime | > 99.9% monthly | Uptime monitoring | Monthly | Tech Lead |

**Tracking Tool:** PostHog (behavioral analytics) + Pino logs (technical)
**Review Schedule:** 1 week post-launch (technical), 2 weeks (product), 30 days (full KPI + v2 planning)

---

## Section 17 — Timeline and Milestones

**Start Date:** 2026-04-01
**Target Public Launch:** 2026-05-27
**Total Duration:** 8 Weeks

| Milestone | Description | Due Date | Status | Owner |
|---|---|---|---|---|
| Kickoff | PRD approved, repository created, team assembled | 2026-04-01 | TODO | Yousef Abdallah |
| PRD Approved | PRD reviewed and signed off | 2026-04-03 | TODO | Yousef Abdallah |
| Video Host Decided | Bunny.net or Vimeo selected and configured | 2026-04-07 | TODO | Yousef Abdallah + Tech Lead |
| Design Assets Delivered | Brand guidelines, component designs, wireframes | 2026-04-07 | TODO | Designer |
| Phase 1 Validation | Catalog, preview, RTL, theme live on staging | 2026-04-15 | TODO | Tech Lead |
| Phase 2 Validation | Full enrollment and payment flow functional on staging | 2026-04-29 | TODO | Tech Lead |
| Phase 3 Validation | Admin panel complete, all polish applied on staging | 2026-05-13 | TODO | Tech Lead |
| Phase 4 / QA Sign-off | P1 features done, QA complete, load test passed | 2026-05-22 | TODO | QA Lead |
| Beta Launch | Soft launch to small group of trusted students | 2026-05-23 | TODO | Yousef Abdallah |
| Public Launch | Platform open to all students | 2026-05-27 | TODO | Yousef Abdallah |

---

## Section 18 — Risk Register

Scores: Likelihood × Impact. High = 3, Medium = 2, Low = 1. Score ≥ 6 = Critical, 4–5 = Moderate, ≤ 3 = Low.

| ID | Risk | Likelihood | Impact | Score | Priority | Mitigation | Owner | Review |
|---|---|---|---|---|---|---|---|---|
| R-001 | Scope creep — new features requested mid-build | High (3) | High (3) | 9 | 🔴 Critical | All new requests go to v2 backlog without exception; Yousef confirms freeze at PRD sign-off | Yousef Abdallah | Every sprint |
| R-002 | Video host not selected — blocks lesson player development | Medium (2) | High (3) | 6 | 🔴 Critical | Decision required by 2026-04-07; fallback: Vimeo free tier for Phase 1 testing | Yousef Abdallah | 2026-04-07 |
| R-003 | Key person dependency — single dev owns critical component | Medium (2) | High (3) | 6 | 🔴 Critical | Architecture decisions documented in /docs/ADR; standard patterns used; no tribal knowledge | Tech Lead | Phase 1 end |
| R-004 | RTL complexity extends frontend timeline | Medium (2) | Medium (2) | 4 | 🟡 Moderate | RTL implemented from day 1 using logical properties; validated every sprint | Frontend Dev | Weekly |
| R-005 | Admin unavailability delays order approvals post-launch | Medium (2) | Medium (2) | 4 | 🟡 Moderate | Set 24-hour approval SLA in student-facing UI; document admin workflow before launch | Yousef Abdallah | Launch week |
| R-006 | Payment proof fraud (fake screenshots) | Low (1) | High (3) | 3 | 🟢 Low | Manual review by admin; implement rejection policy; add watermark guideline for receipts | Yousef Abdallah | Monthly |
| R-007 | Low conversion despite free preview | Low (1) | Medium (2) | 2 | 🟢 Low | Monitor funnel metrics week 1; A/B price points in v1.1; improve course descriptions | Yousef Abdallah | 30-day review |

---

## Section 19 — Cross-Team Handoff and Execution Pipeline

### PM → Design Handoff

**Trigger:** PRD signed off (2026-04-03)
**Deliverables Designer must produce before Phase 1 dev starts:**
- [ ] Brand color tokens (primary, secondary, neutral, error, success) for both dark and light themes
- [ ] Typography scale in Arabic (heading 1–4, body, caption)
- [ ] Component library: buttons, inputs, cards, modals, toasts, badges, navigation
- [ ] Wireframes for: homepage, course catalog, course detail, lesson player, student dashboard, admin dashboard
- [ ] RTL layout direction confirmed in all wireframes
- [ ] Dark and light mode variants for all key screens

**Handoff format:** Figma file shared with dev team. Developer access confirmed before Phase 1 start.

### PM → Dev Handoff

**Trigger:** Design assets delivered + PRD signed off
**Deliverables PM must confirm before dev starts:**
- [ ] All feature acceptance criteria confirmed (Section 9)
- [ ] API contracts confirmed (Section 10)
- [ ] Data model confirmed (Section 11)
- [ ] Build order confirmed (Section 14)
- [ ] Video host account credentials shared with Tech Lead
- [ ] Storage bucket created and access keys shared
- [ ] Staging environment provisioned

### Dev → QA Handoff (per phase)

**Trigger:** Phase validation gate passed by Tech Lead
**Deliverables Dev must provide before QA tests:**
- [ ] Feature branch merged to staging
- [ ] Staging URL confirmed stable
- [ ] List of all changes in the phase (changelog)
- [ ] Known issues or deferred edge cases documented
- [ ] Test accounts created: 1 admin, 3 student accounts with varied states

**QA test plan covers:**
- Happy path for all user flows in Section 6
- All edge cases and failure scenarios in Section 7
- UX behavior rules in Section 8 (validation, loading, error states)
- RTL layout on Chrome and Safari
- Dark and light mode on all screens
- Mobile responsiveness at 320px, 768px, 1280px

### QA → Launch Handoff

**Trigger:** Phase 4 QA sign-off
**Deliverables QA must confirm before launch:**
- [ ] All P0 acceptance criteria passed (no open P0 bugs)
- [ ] All P1 acceptance criteria passed (no open P1 bugs)
- [ ] Load test: 500 concurrent users — no degradation
- [ ] Security review: no open high or critical findings
- [ ] Browser testing: Chrome, Safari, Firefox, Edge — all pass
- [ ] Mobile testing: 320px, 768px — all pass
- [ ] QA sign-off document signed and shared with Yousef Abdallah

---

## Section 20 — Stakeholders and Approvals

### Stakeholders

| Name | Role | Involvement | Contact |
|---|---|---|---|
| Yousef Abdallah | Owner, PM, Admin | Final decision maker on all product, business, and launch decisions | [TBD] |
| Frontend Developer | Frontend Engineer | Implements UI, RTL, i18n, theme | [TBD] |
| Backend Developer | Backend Engineer | Implements API, database, auth, file handling | [TBD] |
| Designer | UI/UX | Delivers wireframes, component designs, brand assets | [TBD] |
| QA Engineer | Quality Assurance | Executes test plans, validates acceptance criteria | [TBD] |

### Approval Gates

| Gate | Approver | Required By | Status |
|---|---|---|---|
| PRD Sign-off | Yousef Abdallah | 2026-04-03 | Pending |
| Design Assets Sign-off | Yousef Abdallah | 2026-04-07 | Pending |
| Video Host Decision | Yousef Abdallah | 2026-04-07 | Pending |
| Phase 1 Staging Approval | Yousef Abdallah | 2026-04-15 | Pending |
| Phase 2 Staging Approval | Yousef Abdallah | 2026-04-29 | Pending |
| Phase 3 Staging Approval | Yousef Abdallah | 2026-05-13 | Pending |
| QA Sign-off | QA Engineer | 2026-05-22 | Pending |
| Production Launch Approval | Yousef Abdallah | 2026-05-27 | Pending |

---

## Section 21 — References and Links

| Resource | Link |
|---|---|
| Design Files (Figma) | [TBD] |
| Repository | [TBD] |
| API Documentation | [TBD] |
| Architecture Decision Records | docs/ADR/ |
| Staging Environment | [TBD] |
| Production Environment | [TBD] |
| CI/CD Pipeline | [TBD] |
| Monitoring Dashboard | [TBD] |
| Video Hosting Dashboard | [TBD] |
| Email Service Dashboard | [TBD] |
| File Storage Dashboard | [TBD] |
| Communication Channel | [TBD] |
| Meeting Notes | [TBD] |

---

## Section 22 — Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0 | 2026-04-01 | Yousef Abdallah | Initial PRD created |
| v1.1 | 2026-04-01 | Yousef Abdallah | Upgraded to execution-ready: added user flows, edge cases, API design, data model, UX rules, build order, cross-team handoff pipeline |
