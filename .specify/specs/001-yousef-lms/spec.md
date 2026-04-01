# Feature Specification: Yousef LMS v1.0 — Complete Platform

**Feature Branch**: `001-yousef-lms`  
**Created**: 2026-04-01  
**Status**: Draft  
**Input**: Build a professional Arabic-first Learning Management System called Yousef LMS where a single instructor (Yousef Abdallah) can host and sell his programming and AI courses directly to students without relying on third-party platforms.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitor Browses Courses Without Login (Priority: P1)

A visitor lands on the homepage and browses the public course catalog. They can see all published courses with thumbnails, titles, descriptions, and prices, without creating an account. This is the entry point to the platform and the foundation for the free preview funnel.

**Why this priority**: This is the first impression and the primary discovery mechanism. Without a working catalog, students cannot evaluate courses or decide to purchase. This is the critical starting point of the entire sales funnel.

**Independent Test**: Can be fully tested by visiting the homepage, viewing the catalog, and verifying all published courses are displayed with correct details. No registration or login required.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the homepage, **When** they navigate to the course catalog, **Then** all published courses are displayed with thumbnail, title, short description, and price in Arabic, right-to-left layout, and selectable dark/light mode
2. **Given** a visitor is viewing the catalog, **When** they click a course card, **Then** they are navigated to the course detail page showing the full lesson list
3. **Given** no courses have been published yet, **When** a visitor navigates to the catalog, **Then** an Arabic empty state message is displayed: "لا توجد دورات متاحة حالياً"

---

### User Story 2 — Visitor Previews First 5 Lessons Free (Priority: P1)

A visitor can watch the first 5 lessons of any course without registering or logging in. Lessons 6 and beyond are visually locked with a clear prompt to purchase. This free preview removes the primary barrier to purchase (uncertainty about course quality) and drives conversion.

**Why this priority**: The 5-lesson free preview is the core value proposition and sales mechanism. Without this, students have no way to evaluate course quality before committing payment. This directly drives conversion and builds trust.

**Independent Test**: Can be fully tested by accessing a course with more than 5 lessons, verifying lessons 1–5 are playable without login, verifying lesson 6 shows locked state and purchase prompt, and playing a free lesson video to completion.

**Acceptance Scenarios**:

1. **Given** a visitor opens a course with 6+ lessons, **When** they view the lesson list, **Then** lessons 1–5 are labeled "مجاني" (free) with play icons, and lessons 6+ are labeled "مقفل" (locked) with lock icons
2. **Given** a visitor clicks on lesson 3, **When** they are not logged in, **Then** the video player loads and plays without requiring authentication
3. **Given** a visitor clicks on lesson 7, **When** they are not logged in, **Then** a modal appears prompting them to "اشترِ الدورة الآن" (buy the course now) with options to register or login
4. **Given** a course has fewer than 5 lessons, **When** a visitor views the lesson list, **Then** all lessons are labeled "مجاني" (free) with no locked lessons
5. **Given** a visitor is watching a free lesson, **When** they view the page, **Then** video description displays in Arabic, RTL layout is correct, and both dark and light mode themes work correctly

---

### User Story 3 — Student Registers and Logs In (Priority: P1)

A student creates an account with name, email, and password. They can then log in with their credentials. Session persists across page refreshes via JWT refresh token. This enables student-specific features like personal dashboard and order management.

**Why this priority**: Registration and login are required gates for the entire student workflow—enrollment, orders, dashboard, comments. Without authentication, students cannot purchase or track their learning.

**Independent Test**: Can be fully tested by registering a new account with valid email and password, verifying account is created, logging in with those credentials, verifying session persists across refresh, and logging out.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to /register, **When** they enter name, valid email, and password (8+ characters), **Then** account is created and they are logged in and redirected to /dashboard
2. **Given** a visitor attempts to register with an email that already exists, **When** they submit the form, **Then** an inline error displays in Arabic: "هذا البريد الإلكتروني مسجل بالفعل"
3. **Given** a student is logged in, **When** they refresh the page, **Then** their session persists and they remain logged in
4. **Given** a student is logged in, **When** they click logout, **Then** they are redirected to the homepage and their session is cleared
5. **Given** a logged-in student, **When** they access /admin, **Then** they are redirected to /dashboard with a 403 error toast: "لا تملك صلاحية الوصول"

---

### User Story 4 — Student Initiates Purchase & Uploads Payment Proof (Priority: P1)

A logged-in student who is not enrolled in a course can click "اشتري الدورة" (buy course). They see payment instructions (bank transfer or mobile wallet details), complete payment externally, return to the platform, and upload a screenshot of their receipt. This manual workflow lets the platform launch immediately without payment gateway integration.

**Why this priority**: The manual payment workflow is the entire revenue model for v1. Without this, the platform cannot generate revenue. This is business-critical functionality.

**Independent Test**: Can be fully tested by logged-in student completing the full flow: navigating to a locked lesson, clicking buy, seeing payment instructions, uploading a valid proof image (JPG/PNG/PDF, max 5MB), and verifying order is created with "pending_review" status on their dashboard.

**Acceptance Scenarios**:

1. **Given** a logged-in student viewing a locked lesson, **When** they click "اشتري الدورة"، **Then** they are navigated to the payment instructions page showing bank account or mobile wallet details in Arabic
2. **Given** a student on the payment instructions page, **When** they have completed external payment, **Then** they can click "رفع إثبات الدفع" (upload payment proof) to proceed to the file upload form
3. **Given** a student on the proof upload form, **When** they select a JPG file under 5MB, **Then** the file preview is shown and they can click "إرسال الطلب" (submit order)
4. **Given** a student attempts to upload a file larger than 5MB, **When** they select the file, **Then** a client-side error displays: "الحد الأقصى لحجم الملف 5MB"
5. **Given** a student attempts to upload a non-image file (e.g., .exe), **When** they select the file, **Then** a client-side error displays: "يُسمح فقط بملفات JPG, PNG, PDF"
6. **Given** a student submits a valid proof file, **When** the upload completes, **Then** an order is created with status "pending_review" and they are redirected to their dashboard
7. **Given** a student already has a pending order for a course, **When** they try to purchase the same course again, **Then** the purchase button is disabled with tooltip: "لديك طلب قيد المراجعة لهذه الدورة"

---

### User Story 5 — Student Tracks Orders on Dashboard (Priority: P1)

A logged-in student can view their personal dashboard showing all enrolled courses, all pending/approved/rejected orders with status badges, and their full order history. This gives students visibility into their purchase status and reduces support queries to the admin.

**Why this priority**: The student dashboard is critical for user experience and trust. Students must see their orders and understand their status to avoid confusion and support tickets. This directly supports Yousef's ability to scale without overwhelming admin work.

**Independent Test**: Can be fully tested by logged-in student viewing dashboard, verifying all enrolled courses display with "متابعة التعلم" link, verifying all orders display with correct status badges (قيد المراجعة, مقبول, مرفوض), and verifying rejection reason displays if order was rejected.

**Acceptance Scenarios**:

1. **Given** a logged-in student, **When** they navigate to /dashboard, **Then** they see two sections: "دوراتي" (my courses) and "طلباتي" (my orders)
2. **Given** a student with enrolled courses, **When** they view the dashboard, **Then** each enrolled course displays with thumbnail, title, and "متابعة التعلم" (continue learning) link
3. **Given** a student with orders, **When** they view the dashboard, **Then** each order displays course name, submission date, status badge (قيد المراجعة/مقبول/مرفوض), and rejection reason if applicable
4. **Given** a student with no enrollments, **When** they view the dashboard, **Then** the courses section shows empty state: "لم تنضم إلى أي دورة بعد — [تصفح الدورات]"
5. **Given** a student with no orders, **When** they view the dashboard, **Then** the orders section shows empty state: "لا توجد طلبات سابقة"
6. **Given** a student on the dashboard, **When** they toggle between dark and light mode, **Then** the theme persists across refreshes
7. **Given** a student on the dashboard, **When** they scroll right-to-left, **Then** layout direction is correct with all elements properly aligned for RTL

---

### User Story 6 — Student Accesses Paid Lessons After Enrollment (Priority: P1)

After the admin approves an order, the student is enrolled in the course and gains access to all lessons (1–∞). They can watch any lesson, read the description, and post comments. This is the primary learning experience.

**Why this priority**: This is the core value delivery to the student. Without access to paid lessons, the entire revenue model fails. This must work flawlessly.

**Independent Test**: Can be fully tested by admin approving an order, then logged-in student verifying they can access and watch lesson 6+ from that course, and post comments on any lesson.

**Acceptance Scenarios**:

1. **Given** a student whose order has been approved, **When** they navigate to lesson 6 of that course, **Then** the video player loads and they can watch the full lesson without enrollment prompts
2. **Given** an enrolled student, **When** they scroll the lesson list, **Then** all lessons (1–∞) show as unlocked with play icons (no locks)
3. **Given** an enrolled student viewing a lesson, **When** they scroll below the video, **Then** the lesson description displays in Arabic with rich text formatting
4. **Given** an enrolled student viewing a lesson, **When** they scroll below the description, **Then** a comments section is displayed with existing comments and a text area to post new comments

---

### User Story 7 — Enrolled Students Post and View Comments (Priority: P1)

Only enrolled students can post comments on lessons. All visitors (enrolled or not) can read comments. Comments enable community engagement and reduce student support queries. Admin can delete inappropriate comments.

**Why this priority**: Comments drive engagement and create a learning community, which improves course perceived value and student retention. Moderation capability ensures content quality.

**Independent Test**: Can be fully tested by enrolled student posting comment on lesson, non-enrolled visitor viewing comment in read-only mode, and admin deleting comment from admin dashboard.

**Acceptance Scenarios**:

1. **Given** an enrolled student on a lesson page, **When** they view the comments section, **Then** a text area appears with placeholder "أضف تعليقاً..." and a "نشر" (post) button
2. **Given** an enrolled student, **When** they type a comment and click "نشر"، **Then** the comment is saved and displayed immediately with their name and timestamp in Arabic
3. **Given** a non-enrolled visitor on a lesson page, **When** they view the comments section, **Then** existing comments are displayed in read-only mode and the text area is replaced with "اشترِ الدورة لتتمكن من التعليق" (buy course to comment)
4. **Given** a student attempts to post an empty comment, **When** they click "نشر"، **Then** nothing happens and the button remains disabled until they type content
5. **Given** an admin, **When** they view a lesson comment in the admin dashboard, **Then** they can click delete and the comment is removed immediately

---

### User Story 8 — Admin Creates and Publishes Courses (Priority: P1)

The admin (Yousef) can create a course by entering title, description, thumbnail image, and price. They can organize lessons into sections and add lessons to each section. They can publish or unpublish courses at any time. Published courses appear on the public catalog.

**Why this priority**: This is the core admin workflow. Without the ability to create and publish content, there is nothing for students to learn or purchase. This is the supply side of the platform.

**Independent Test**: Can be fully tested by admin creating new course with all required fields, adding sections and lessons, publishing course, verifying course appears on public catalog, and unpublishing course to verify it disappears from catalog.

**Acceptance Scenarios**:

1. **Given** the admin on /admin dashboard, **When** they click "دورة جديدة" (new course), **Then** a form appears with fields: title (Arabic), description (rich text, Arabic), thumbnail image upload, price (EGP), and status dropdown (draft/published)
2. **Given** the admin filling the course form, **When** they click "حفظ كمسودة" (save as draft), **Then** the course is created with status = draft and they are redirected to the course detail page
3. **Given** the admin viewing a draft course, **When** they click "إضافة قسم" (add section), **Then** a section form appears where they can enter section title
4. **Given** the admin on a section, **When** they click "إضافة درس" (add lesson), **Then** a lesson form appears with fields: title, video URL (from external host), description (rich text)
5. **Given** the admin with lessons added to a course, **When** they click "نشر الدورة" (publish course), **Then** the course status changes to published and appears on the public catalog immediately
6. **Given** the admin viewing a published course, **When** they click "إلغاء النشر" (unpublish), **Then** the course is hidden from the public catalog but students already enrolled retain access

---

### User Story 9 — Admin Reviews and Approves Orders (Priority: P1)

The admin sees a list of all pending purchase orders with student name, course requested, submission timestamp, and proof image. They can open the image full-size, then approve (granting instant enrollment) or reject (with optional reason). This is the fulfillment mechanism for the manual payment workflow.

**Why this priority**: Order fulfillment is the critical business operation. Without the ability to approve/reject orders, revenue cannot be realized. The admin must complete this in minimal clicks (< 5) to be sustainable.

**Independent Test**: Can be fully tested by student submitting order, admin viewing pending orders list, opening proof image, approving order, and verifying student immediately gains course access.

**Acceptance Scenarios**:

1. **Given** the admin on /admin dashboard, **When** they click "الطلبات" (orders), **Then** all orders are listed filtered by status (الكل/قيد المراجعة/مقبول/مرفوض)
2. **Given** the admin viewing pending orders, **When** they click on an order, **Then** the order detail page opens showing: student name, email, course name, submission timestamp, and proof image
3. **Given** the admin viewing an order detail, **When** they click on the proof image, **Then** a full-size image modal appears with close button
4. **Given** the admin reviewing a valid proof, **When** they click "قبول" (approve), **Then** a confirmation dialog appears: "هل تريد منح [Student Name] الوصول الكامل إلى [Course Name]؟"
5. **Given** the admin confirms approval, **When** the action completes, **Then** enrollment is created immediately and order status changes to "مقبول" and a success toast displays
6. **Given** the admin reviewing invalid proof, **When** they click "رفض" (reject), **Then** a rejection form appears with optional reason text field
7. **Given** the admin submitting a rejection with reason, **When** the action completes, **Then** order status changes to "مرفوض" with reason stored and student sees reason on their dashboard

---

### User Story 10 — Admin Views Students and Manages Comments (Priority: P2)

The admin can view all registered students with enrollment count and join date. The admin can view all comments across all lessons and delete inappropriate comments. This enables the admin to manage platform health and moderation without developer help.

**Why this priority**: Student management and comment moderation are secondary to order fulfillment but critical for platform health. These enable the admin to scale to larger student bases without losing control of quality.

**Independent Test**: Can be fully tested by admin viewing students list, viewing comments list, and deleting a comment.

**Acceptance Scenarios**:

1. **Given** the admin on /admin dashboard, **When** they click "الطلاب" (students), **Then** all registered students are listed with name, email, enrollment count, and join date
2. **Given** the admin clicking on a student, **When** the student detail page loads, **Then** all courses they are enrolled in are displayed
3. **Given** the admin on /admin dashboard, **When** they click "التعليقات" (comments), **Then** all comments across all lessons are listed with student name, lesson name, comment excerpt, and date
4. **Given** the admin viewing a comment, **When** they click delete, **Then** a confirmation dialog appears: "هل تريد حذف هذا التعليق؟"
5. **Given** the admin confirms deletion, **When** the comment is deleted, **Then** it is immediately removed from the lesson page and a success toast displays

---

### Edge Cases

- What happens when a student tries to access /admin while logged in as a student? → Redirect to /dashboard with 403 toast
- How does the system handle a network failure during proof upload? → Progress bar stops, error toast displayed, form data preserved
- What happens when an admin approves an order that was already approved (duplicate action)? → 409 response with toast: "تم قبول هذا الطلب مسبقاً"
- How does the system handle a student trying to access lesson 6 directly via URL without enrollment? → Redirect to course detail page with purchase CTA
- What happens when an admin deletes a course that has active enrollments? → Warning dialog: "هذه الدورة بها [N] طالب مسجل. هل تريد إلغاء نشرها؟" with options to unpublish or cancel
- What happens when a student resubmits proof after rejection? → New order is created with status "pending_review" (old rejected order remains in history)
- How does the system handle RTL text input in comments? → Text input field supports Arabic bidirectional text, displays correctly in RTL layout
- What happens when video fails to load on lesson player? → Error state with retry button and message: "تعذر تحميل الفيديو، حاول مرة أخرى"

---

## Requirements *(mandatory)*

### Functional Requirements

**Authentication & Authorization**

- **FR-001**: System MUST allow visitors to register with name, email, and password (minimum 8 characters)
- **FR-002**: System MUST validate email format and uniqueness at registration time
- **FR-003**: System MUST prevent duplicate email registration with clear inline error message in Arabic
- **FR-004**: System MUST allow registered users to log in with email and password
- **FR-005**: System MUST return non-enumerable error message on failed login: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
- **FR-006**: System MUST establish authenticated session using JWT with 15-minute access token and 7-day refresh token
- **FR-007**: System MUST persist session across page refreshes using refresh token rotation
- **FR-008**: System MUST support logout by clearing both access and refresh tokens
- **FR-009**: System MUST have pre-seeded admin account for Yousef Abdallah (not publicly registerable)
- **FR-010**: System MUST return 403 Forbidden when non-admin user accesses /admin routes
- **FR-011**: System MUST return 401 Unauthorized when unauthenticated user accesses protected student routes

**Course Catalog & Preview**

- **FR-012**: System MUST display all published courses on /courses with thumbnail, title, description, and price in Arabic, RTL layout
- **FR-013**: System MUST not display draft courses to non-admin users
- **FR-014**: System MUST show empty state "لا توجد دورات متاحة حالياً" when no courses are published
- **FR-015**: System MUST allow visitors to view course detail page with full lesson list without login
- **FR-016**: System MUST label lessons 1–5 as "مجاني" (free) and lessons 6+ as "مقفل" (locked) on lesson list
- **FR-017**: System MUST allow visitors to play lessons 1–5 without authentication
- **FR-018**: System MUST block access to lessons 6+ for non-enrolled users, showing purchase modal
- **FR-019**: System MUST display all lessons as free when a course has fewer than 5 lessons
- **FR-020**: System MUST compute is_free_preview based on lesson order_index ≤ 5 within course

**Lesson Player & Comments**

- **FR-021**: System MUST embed and play video from external host (Bunny.net or Vimeo URL)
- **FR-022**: System MUST display lesson title, description (rich text, Arabic), and comments section below video
- **FR-023**: System MUST show video error state with retry button if video fails to load
- **FR-024**: System MUST display comments from all users in read-only mode (no login required)
- **FR-025**: System MUST allow enrolled students to post comments with text content, name, and timestamp
- **FR-026**: System MUST prevent comment posting from non-enrolled users, showing enrollment CTA instead
- **FR-027**: System MUST validate comment content is not empty before submission
- **FR-028**: System MUST allow admin to delete any comment from admin dashboard

**Manual Payment Workflow**

- **FR-029**: System MUST prevent student from initiating order if one pending order already exists for same (student_id, course_id)
- **FR-030**: System MUST enforce unique constraint at database level: (student_id, course_id) WHERE status = 'pending_review'
- **FR-031**: System MUST display payment instructions page with bank account and mobile wallet details in Arabic
- **FR-032**: System MUST allow file upload with support for JPG, PNG, PDF formats only
- **FR-033**: System MUST validate file size maximum of 5MB at client-side and reject larger files before upload attempt
- **FR-034**: System MUST validate MIME type (not extension only) for uploaded proof files
- **FR-035**: System MUST show inline progress bar during file upload with percentage
- **FR-036**: System MUST create order with status "pending_review" after successful proof upload
- **FR-037**: System MUST store proof image with non-guessable UUID-based URL on S3-compatible storage
- **FR-038**: System MUST delete proof images automatically 90 days after order resolution (approved or rejected)
- **FR-039**: System MUST prevent duplicate order submission returning 409 error with message "لديك طلب قيد المراجعة لهذه الدورة"
- **FR-040**: System MUST disable purchase button for students with pending order for same course with tooltip explaining reason

**Order Management (Admin)**

- **FR-041**: System MUST display list of all orders filterable by status (pending_review, approved, rejected)
- **FR-042**: System MUST display pending order count as notification badge on admin dashboard
- **FR-043**: System MUST show student name, email, course name, submission timestamp, and proof image on order detail
- **FR-044**: System MUST allow full-size viewing of proof image in modal
- **FR-045**: System MUST create enrollment immediately when admin approves order
- **FR-046**: System MUST grant enrolled student full access to all course lessons after approval
- **FR-047**: System MUST return 409 Conflict if admin attempts to approve already-approved order with message "تم قبول هذا الطلب مسبقاً"
- **FR-048**: System MUST allow optional rejection reason when rejecting order
- **FR-049**: System MUST store rejection reason on rejected order
- **FR-050**: System MUST display rejection reason on student's dashboard for rejected orders
- **FR-051**: System MUST allow student to resubmit proof after rejection (creating new order, keeping old rejected order in history)

**Student Dashboard**

- **FR-052**: System MUST display enrolled courses section with thumbnail, title, and "متابعة التعلم" (continue learning) link
- **FR-053**: System MUST display orders section with course name, submission date, status badge, and rejection reason if applicable
- **FR-054**: System MUST show empty state on courses section: "لم تنضم إلى أي دورة بعد — [تصفح الدورات]"
- **FR-055**: System MUST show empty state on orders section: "لا توجد طلبات سابقة"
- **FR-056**: System MUST display order status badges in Arabic: قيد المراجعة, مقبول, مرفوض

**Admin Dashboard - Courses**

- **FR-057**: System MUST allow admin to create course with title (Arabic), description (rich text), thumbnail image, and price
- **FR-058**: System MUST allow admin to add sections to course with title and display order
- **FR-059**: System MUST allow admin to add lessons to section with title, video URL, and description (rich text)
- **FR-060**: System MUST allow admin to publish draft course (status = published)
- **FR-061**: System MUST allow admin to unpublish published course (status = draft)
- **FR-062**: System MUST hide unpublished courses from public catalog but preserve enrollments for already-enrolled students
- **FR-063**: System MUST warn admin before deleting course with active enrollments with option to unpublish instead
- **FR-064**: System MUST compute lesson order_index globally within course (1, 2, 3...) used for free preview logic
- **FR-065**: System MUST auto-compute is_free_preview = true for lessons where order_index ≤ 5

**Admin Dashboard - Students**

- **FR-066**: System MUST display list of all registered students with name, email, enrollment count, and join date
- **FR-067**: System MUST allow admin to view student detail with all enrolled courses listed

**Admin Dashboard - Comments**

- **FR-068**: System MUST display list of all comments across all lessons with student name, lesson name, content excerpt, and date
- **FR-069**: System MUST allow admin to delete any comment
- **FR-070**: System MUST immediately remove deleted comment from lesson page

**RTL & Localization**

- **FR-071**: System MUST set `dir="rtl"` on `<html>` element on every page
- **FR-072**: System MUST use CSS logical properties throughout (margin-inline-start, padding-inline-end, text-align: start, etc.)
- **FR-073**: System MUST mirror directional icons (arrows, chevrons) for RTL layout
- **FR-074**: System MUST support Arabic bidirectional text input in all form fields
- **FR-075**: System MUST translate all UI strings, buttons, error messages, empty states, and toasts to Arabic
- **FR-076**: System MUST not display any untranslated English strings to end users
- **FR-077**: System MUST display error messages in Arabic, specific, and actionable (not generic)

**Dark & Light Mode**

- **FR-078**: System MUST support dark and light mode toggle accessible from navigation bar
- **FR-079**: System MUST apply theme via `class="dark"` on `<html>` element
- **FR-080**: System MUST store theme preference in `localStorage` under key "theme" with values "light" or "dark"
- **FR-081**: System MUST apply stored theme before first paint to prevent flash
- **FR-082**: System MUST use CSS variables for all colors with no hardcoded color values
- **FR-083**: System MUST ensure both themes pass WCAG 2.1 AA contrast ratio on all pages

**Form Validation & UX**

- **FR-084**: System MUST validate all form inputs on blur and on submit
- **FR-085**: System MUST display validation errors inline below the relevant field in Arabic
- **FR-086**: System MUST highlight fields with errors with red border
- **FR-087**: System MUST clear error state when user corrects input (on input event)
- **FR-088**: System MUST show loading spinner and disable button during async operations
- **FR-089**: System MUST show skeleton loader matching content layout during page data fetches
- **FR-090**: System MUST display success toast notification in top-left (RTL) corner, auto-dismiss after 4 seconds
- **FR-091**: System MUST display network errors as full-width banner with retry option, never as blank page
- **FR-092**: System MUST preserve form data on submission failure

**Admin Actions Logging**

- **FR-093**: System MUST log all admin actions with timestamp, admin ID, action type, and target entity ID
- **FR-094**: System MUST store audit logs for: course create/update/delete, publish/unpublish, section/lesson CRUD, order approve/reject, comment delete

### Key Entities

- **Users**: id, name, email, password_hash (bcrypt), role (admin|student), created_at, updated_at
- **Courses**: id, slug, title (Arabic), description (rich text), thumbnail_url, price (EGP), status (draft|published), created_at, updated_at
- **Sections**: id, course_id (FK), title (Arabic), order_index, created_at
- **Lessons**: id, section_id (FK), title (Arabic), video_url, description (rich text), order_index (global within course), is_free_preview (computed), created_at
- **Orders**: id, student_id (FK), course_id (FK), proof_url, status (pending_review|approved|rejected), rejection_reason, reviewed_at, reviewed_by (FK → admin), created_at
- **Enrollments**: id, student_id (FK), course_id (FK), order_id (FK, unique), created_at
- **Comments**: id, lesson_id (FK), student_id (FK), content (text), created_at, deleted_at (soft delete)
- **AuditLogs**: id, admin_id (FK), action_type (string), target_entity (string), target_id (UUID), timestamp, details (JSON)

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A student can complete the full flow (browse → free preview → register → upload proof → admin approval) within **24 hours** of initial landing, with **zero developer intervention** after proof upload
- **SC-002**: Admin can approve a pending order in **< 5 clicks** from the orders list to approval completion
- **SC-003**: Admin can create a new course with sections and lessons in **< 10 minutes** from course creation to publish
- **SC-004**: Page load time (P75) is **< 2 seconds** for all key pages (catalog, course detail, lesson player, dashboards)
- **SC-005**: API response time (P95) is **< 500ms** for all endpoints
- **SC-006**: Platform error rate is **< 0.1%** of all requests
- **SC-007**: All pages pass **WCAG 2.1 Level AA** accessibility standards
- **SC-008**: Both dark and light mode themes pass **WCAG AA contrast ratio** on all elements
- **SC-009**: RTL layout is correct on **100% of pages** (no text overflow, no reversed icons, proper alignment)
- **SC-010**: Platform supports **500 concurrent users** without degradation (measured on staging)
- **SC-011**: System can handle **1000 enrollments per day** during launch week without performance impact
- **SC-012**: **100% of P0 user stories** are independently testable and deliver measurable value

---

## Assumptions

- **User Base**: Students have stable internet connectivity and modern browsers (Chrome 100+, Safari 15+, Firefox 100+, Edge 100+)
- **Video Hosting**: External video host (Bunny.net or Vimeo) will be selected and configured by 2026-04-07. Lesson player implementation depends on this decision
- **Payment Method**: Students pay via external methods (bank transfer, mobile wallet, etc.) and upload screenshot as proof. Admin verifies manually. No automated payment processing in v1
- **Content Language**: All course content authored in Arabic. Platform is Arabic-first; RTL is default
- **Admin Availability**: Yousef Abdallah is the sole admin and available to approve orders within 24 hours during business hours
- **Team Size**: 2–3 developers available for 8-week timeline to v1 launch
- **Out of Scope for v1**: No automated payment gateways, certificates, progress tracking, native mobile app, multi-instructor support, detailed video analytics, or email notifications (unless included in Phase 4 P1 completion)
- **Compliance**: Student data handled per GDPR principles. Proof images deleted 90 days post-resolution
- **Browser Support**: Desktop browsers (Chrome, Safari, Firefox, Edge 100+) and mobile viewports (320px minimum width)
- **Mobile Design**: Responsive design for mobile, but no native mobile app in v1
