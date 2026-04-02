export type UserRole = 'admin' | 'student'
export type CourseStatus = 'draft' | 'published'
export type OrderStatus = 'pending_review' | 'approved' | 'rejected'

export interface UserEntity {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt?: string
  updatedAt?: string
}

export interface CourseEntity {
  id: string
  slug: string
  title: string
  description: string
  thumbnailUrl: string
  price: number
  status: CourseStatus
  createdAt?: string
  updatedAt?: string
}

export type Course = CourseEntity

export interface SectionEntity {
  id: string
  courseId: string
  title: string
  orderIndex: number
  createdAt?: string
}

export type Section = SectionEntity

export interface LessonEntity {
  id: string
  sectionId: string
  title: string
  videoUrl: string
  description?: string | null
  orderIndex: number
  isFreePreview: boolean
  createdAt?: string
}

export type Lesson = LessonEntity

export interface OrderEntity {
  id: string
  studentId: string
  courseId: string
  proofUrl: string
  status: OrderStatus
  rejectionReason?: string | null
  reviewedAt?: string | null
  reviewedBy?: string | null
  createdAt?: string
}

export interface EnrollmentEntity {
  id: string
  studentId: string
  courseId: string
  orderId: string
  createdAt?: string
}

export interface CommentEntity {
  id: string
  lessonId: string
  studentId: string
  content: string
  createdAt?: string
  deletedAt?: string | null
}

export interface LessonProgressEntity {
  id: string
  studentId: string
  lessonId: string
  watchedAt?: string
}

export interface RefreshTokenEntity {
  id: string
  userId: string
  tokenHash: string
  expiresAt: string
  revokedAt?: string | null
  createdAt?: string
}

export interface AuditLogEntity {
  id: string
  adminId: string
  actionType: string
  targetEntity: string
  targetId: string
  details?: Record<string, unknown> | null
  timestamp?: string
}
