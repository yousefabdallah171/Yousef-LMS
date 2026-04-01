# Data Model: Yousef LMS v1.0

**Created**: 2026-04-01  
**Status**: Phase 1 Design (ready for Prisma schema generation)

---

## Entity Relationship Diagram

```
Users
  ├── Orders (userId → courseId)
  │     └── Enrollments (created on order approval)
  ├── Comments (userId → lessonId)
  └── RefreshTokens (userId, for revocation)

Courses (published/draft status)
  └── Sections (order_index for display order)
        └── Lessons (order_index global within course for free preview logic)
              └── Comments (student_id, lesson_id)

AuditLogs (admin_id, action_type, target_entity_id, timestamp)
```

---

## Entities

### Users

**Purpose**: Student and admin account registration and authentication

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| name | VARCHAR(100) | NOT NULL | Display name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Lowercase, trimmed on insert |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt cost 12; never stored plaintext |
| role | ENUM('admin','student') | NOT NULL, DEFAULT 'student' | Role determines authorization |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ISO 8601 |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Auto-updated on mutation |

**Relationships**:
- Has many Orders (1:N)
- Has many Comments (1:N)
- Has many RefreshTokens (1:N, for revocation)

**Validation Rules**:
- Email: Valid format (RFC 5322), unique at DB level
- Name: 1–100 characters, non-empty
- Password: Minimum 8 characters (checked at registration)
- Role: Only 'admin' or 'student' (default 'student')

**State Transitions**:
- Created: role = 'student'
- No state changes post-creation (role cannot be changed via API)

---

### Courses

**Purpose**: Instructional content with pricing and publication status

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| slug | VARCHAR(255) | NOT NULL, UNIQUE | URL-safe, Arabic transliterated (e.g., "python-ai") |
| title | VARCHAR(255) | NOT NULL | Arabic, e.g., "تعلم Python مع AI" |
| description | TEXT | NOT NULL | Rich HTML, Arabic |
| thumbnail_url | VARCHAR(500) | NOT NULL | Image URL (JPG/PNG) |
| price | DECIMAL(10,2) | NOT NULL | Egyptian Pound (EGP) |
| status | ENUM('draft','published') | NOT NULL, DEFAULT 'draft' | Draft hidden from public catalog |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Auto-updated |

**Relationships**:
- Has many Sections (1:N, CASCADE DELETE)
- Has many Orders (1:N)
- Has many Enrollments (1:N)

**Validation Rules**:
- Title: 1–255 characters, Arabic, non-empty
- Slug: 1–255 characters, URL-safe, unique
- Price: ≥ 0, currency is EGP
- Status: 'draft' or 'published'

**State Transitions**:
- Created: status = 'draft'
- Draft → Published (via admin publish action)
- Published → Draft (via admin unpublish action)
- Deleted: Only if no active enrollments (admin receives warning)

---

### Sections

**Purpose**: Organize lessons into curriculum sections

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| course_id | UUID | FK → Courses.id, NOT NULL, CASCADE DELETE | |
| title | VARCHAR(255) | NOT NULL | Arabic, e.g., "أساسيات Python" |
| order_index | INTEGER | NOT NULL | Display order (1, 2, 3...) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |

**Relationships**:
- Belongs to Course (N:1)
- Has many Lessons (1:N, CASCADE DELETE)

**Validation Rules**:
- Title: 1–255 characters, Arabic, non-empty
- order_index: ≥ 1

**Uniqueness**: (course_id, order_index) — no duplicate order within course

---

### Lessons

**Purpose**: Individual video content with preview logic

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| section_id | UUID | FK → Sections.id, NOT NULL, CASCADE DELETE | |
| title | VARCHAR(255) | NOT NULL | Arabic, e.g., "الدرس الأول: المتغيرات" |
| video_url | VARCHAR(500) | NOT NULL | External video host URL (Bunny.net or Vimeo) |
| description | TEXT | | Rich HTML, Arabic, optional |
| order_index | INTEGER | NOT NULL | Global index within course (1, 2, 3..., used for free preview check) |
| is_free_preview | BOOLEAN | NOT NULL, DEFAULT false | Computed: true when order_index ≤ 5 within course |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |

**Relationships**:
- Belongs to Section (N:1)
- Has many Comments (1:N, CASCADE DELETE when comment deleted)

**Validation Rules**:
- Title: 1–255 characters, Arabic, non-empty
- video_url: Valid URL, non-empty
- order_index: ≥ 1
- is_free_preview: Computed at creation; true if order_index ≤ 5

**Uniqueness**: (section_id, order_index) — no duplicate order within section

**Business Logic**:
- On lesson creation: Compute order_index globally within course, set is_free_preview = (order_index ≤ 5)
- On lesson deletion: Cascade delete all comments

---

### Orders

**Purpose**: Student purchase requests with manual admin fulfillment

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| student_id | UUID | FK → Users.id, NOT NULL | |
| course_id | UUID | FK → Courses.id, NOT NULL | |
| proof_url | VARCHAR(500) | NOT NULL | Signed Cloudflare R2 URL (non-guessable, short-lived) |
| status | ENUM('pending_review','approved','rejected') | NOT NULL, DEFAULT 'pending_review' | |
| rejection_reason | TEXT | | Optional, only set when status = 'rejected' |
| reviewed_at | TIMESTAMPTZ | | Set when admin approves/rejects |
| reviewed_by | UUID | FK → Users.id | Admin user ID who reviewed |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |

**Relationships**:
- Belongs to User (N:1)
- Belongs to Course (N:1)
- Has one Enrollment (1:1, created on approval)

**Validation Rules**:
- student_id, course_id: Not null, valid UUIDs
- status: 'pending_review', 'approved', or 'rejected'
- rejection_reason: Only set when status = 'rejected'
- reviewed_at, reviewed_by: Only set when status ≠ 'pending_review'

**Uniqueness Constraints**:
- **Partial Unique Index**: (student_id, course_id) WHERE status = 'pending_review' — enforced at DB level
  - Prevents duplicate pending orders for same student/course
  - Allows multiple rejected/approved orders in history (same student can resubmit after rejection)

**State Transitions**:
- Created: status = 'pending_review'
- pending_review → approved (admin action) → Enrollment created
- pending_review → rejected (admin action, optional reason)
- No further transitions; rejected orders remain in history

**Business Logic**:
- On approval: Create Enrollment record, set status = 'approved', set reviewed_at and reviewed_by
- On rejection: Set status = 'rejected', set rejection_reason (if provided), set reviewed_at and reviewed_by
- On creation: Validate no other pending order exists for (student_id, course_id)

---

### Enrollments

**Purpose**: Student course access record (created when order is approved)

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| student_id | UUID | FK → Users.id, NOT NULL | |
| course_id | UUID | FK → Courses.id, NOT NULL | |
| order_id | UUID | FK → Orders.id, UNIQUE, NOT NULL | One enrollment per order |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Set when order approved |

**Relationships**:
- Belongs to User (N:1)
- Belongs to Course (N:1)
- Belongs to Order (N:1, one-to-one via unique constraint)

**Validation Rules**:
- All fields not null, valid UUIDs

**Uniqueness Constraints**:
- **Unique Index**: (student_id, course_id) — enforced at DB level
  - Student can only be enrolled in a course once
  - Prevents duplicate enrollments

**Business Logic**:
- Created automatically when order is approved (no direct API endpoint to create)
- Grants student full access to all lessons (1 through ∞) in the course
- Persists even if admin unpublishes the course (student retains access)

---

### Comments

**Purpose**: Student engagement on lessons (post-comment discussion)

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| lesson_id | UUID | FK → Lessons.id, NOT NULL, CASCADE DELETE | |
| student_id | UUID | FK → Users.id, NOT NULL | |
| content | TEXT | NOT NULL | Minimum 1 character, Arabic bidirectional text |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |
| deleted_at | TIMESTAMPTZ | | Null for active, set for soft-deleted (admin delete) |

**Relationships**:
- Belongs to Lesson (N:1)
- Belongs to User (N:1)

**Validation Rules**:
- content: Minimum 1 character, non-empty
- student_id: Must have enrollment in course of the lesson
- deleted_at: Null for active, set only by admin (soft delete)

**Business Logic**:
- Only enrolled students can post comments
- All visitors (enrolled or not) can view non-deleted comments
- Admin can soft-delete any comment (deleted_at set, but record remains for audit)
- Deleted comments hidden from lesson page (WHERE deleted_at IS NULL)

---

### LessonProgress (Phase 2, P1 Feature)

**Purpose**: Track which lessons a student has watched

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| student_id | UUID | FK → Users.id, NOT NULL | |
| lesson_id | UUID | FK → Lessons.id, NOT NULL | |
| watched_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Set when student reaches 80% of video |

**Relationships**:
- Belongs to User (N:1)
- Belongs to Lesson (N:1)

**Validation Rules**:
- watched_at: Timestamp, not null

**Uniqueness Constraints**:
- **Unique Index**: (student_id, lesson_id) — student can only mark a lesson watched once

**Business Logic**:
- Created when student video playback reaches 80% duration
- Used to display progress indicator on student dashboard and lesson list
- "Continue Learning" link on dashboard goes to first unwatched lesson

---

### RefreshTokens

**Purpose**: Store refresh tokens for revocation and rotation

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| user_id | UUID | FK → Users.id, NOT NULL, CASCADE DELETE | |
| token_hash | VARCHAR(255) | NOT NULL, UNIQUE | Hashed refresh token (never store plaintext) |
| expires_at | TIMESTAMPTZ | NOT NULL | 7 days from issuance |
| revoked_at | TIMESTAMPTZ | | Null for active, set if revoked (logout) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |

**Relationships**:
- Belongs to User (N:1)

**Validation Rules**:
- token_hash: Hashed (bcrypt or similar), unique
- expires_at: Timestamp ≥ now + 7 days
- revoked_at: Null for active, timestamp if revoked

**Business Logic**:
- On login: Create new refresh token, hash it, store in DB
- On refresh: Verify token not expired and not revoked, rotate (delete old, create new)
- On logout: Set revoked_at = now()
- Cleanup: Delete expired tokens (revoked_at < now or expires_at < now) nightly via node-cron

---

### AuditLogs

**Purpose**: Track all admin actions for security and accountability

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| admin_id | UUID | FK → Users.id, NOT NULL | Admin user who performed action |
| action_type | VARCHAR(50) | NOT NULL | e.g., "order_approve", "order_reject", "comment_delete" |
| target_entity | VARCHAR(50) | NOT NULL | e.g., "order", "comment", "course" |
| target_id | UUID | NOT NULL | ID of entity being modified |
| details | JSONB | | Optional contextual data (rejection reason, etc.) |
| timestamp | TIMESTAMPTZ | NOT NULL, DEFAULT now() | When action occurred |

**Relationships**:
- Belongs to User (N:1, admin)

**Validation Rules**:
- admin_id: Valid UUID, user with role = 'admin'
- action_type: Predefined list (order_approve, order_reject, order_create, comment_delete, course_create, course_update, course_delete, course_publish, course_unpublish, section_create, lesson_create, lesson_delete)
- target_entity: Predefined list (order, comment, course, section, lesson, user)
- target_id: Valid UUID
- details: Optional JSON object

**Business Logic**:
- Every admin write action (approve, reject, delete, publish, unpublish) creates audit log entry
- Entries are immutable (never updated or deleted)
- Used for compliance, debugging, and accountability tracking

---

## Database Indexes

**Performance-critical indexes** (in addition to primary keys and foreign keys):

| Table | Columns | Type | Rationale |
|-------|---------|------|-----------|
| orders | status | B-tree | Filter orders by status (pending, approved, rejected) |
| orders | (student_id, course_id) WHERE status = 'pending_review' | Partial Unique | Enforce one pending order per student/course |
| orders | student_id | B-tree | Fetch student's orders quickly |
| orders | course_id | B-tree | Fetch orders for a course |
| enrollments | (student_id, course_id) | Unique | Enforce one enrollment per student/course |
| enrollments | student_id | B-tree | Fetch student's enrollments |
| lessons | section_id | B-tree | Fetch lessons in a section |
| lessons | order_index | B-tree | Order lessons within course for free preview computation |
| comments | lesson_id | B-tree | Fetch comments for a lesson |
| courses | status | B-tree | Filter published courses for catalog |
| users | email | Unique | Enforce email uniqueness |

---

## Constraints Summary

| Constraint | Scope | Enforcement |
|-----------|-------|-------------|
| One pending order per (student_id, course_id) | Orders table | Partial unique index (status = 'pending_review') |
| One enrollment per (student_id, course_id) | Enrollments table | Unique index |
| Email uniqueness | Users table | Unique index |
| Foreign key referential integrity | All FKs | ON DELETE CASCADE where noted, ON DELETE RESTRICT for users |
| Proof image auto-delete after 90 days | Orders table | Nightly cleanup job (node-cron) |
| Refresh token expiry | RefreshTokens table | Query filter (expires_at > now), nightly cleanup |

---

## Prisma Schema Generation

This data model will be directly translated into Prisma schema:
- Each entity → Prisma model
- Each field → Prisma field with type, constraints, relationships
- Indexes → Prisma @index/@unique/@db.ObjectId directives
- Relationships → Prisma @relation fields

**Output**: `prisma/schema.prisma` (ready for `prisma db push` and migrations)
