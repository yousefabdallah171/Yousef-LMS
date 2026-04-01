-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STUDENT');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail_url" VARCHAR(500) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "video_url" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "order_index" INTEGER NOT NULL,
    "is_free_preview" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "proof_url" VARCHAR(500) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "rejection_reason" TEXT,
    "reviewed_at" TIMESTAMPTZ(6),
    "reviewed_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_progress" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "watched_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "action_type" VARCHAR(50) NOT NULL,
    "target_entity" VARCHAR(50) NOT NULL,
    "target_id" UUID NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_status_idx" ON "courses"("status");

-- CreateIndex
CREATE UNIQUE INDEX "sections_course_id_order_index_key" ON "sections"("course_id", "order_index");

-- CreateIndex
CREATE INDEX "lessons_section_id_idx" ON "lessons"("section_id");

-- CreateIndex
CREATE INDEX "lessons_order_index_idx" ON "lessons"("order_index");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_section_id_order_index_key" ON "lessons"("section_id", "order_index");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_student_id_idx" ON "orders"("student_id");

-- CreateIndex
CREATE INDEX "orders_course_id_idx" ON "orders"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_student_id_course_id_pending_review_key"
ON "orders"("student_id", "course_id")
WHERE "status" = 'PENDING_REVIEW';

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_order_id_key" ON "enrollments"("order_id");

-- CreateIndex
CREATE INDEX "enrollments_student_id_idx" ON "enrollments"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_student_id_course_id_key" ON "enrollments"("student_id", "course_id");

-- CreateIndex
CREATE INDEX "comments_lesson_id_idx" ON "comments"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progress_student_id_lesson_id_key" ON "lesson_progress"("student_id", "lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
