export interface ApiErrorResponse {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface HealthResponse {
  status: 'ok'
}

export interface AuthUserDto {
  id: string
  name: string
  email: string
  role: 'admin' | 'student'
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse extends AuthTokens {
  user: AuthUserDto
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export type RefreshTokenResponse = AuthTokens

export interface LogoutResponse {
  message: string
}

export interface CourseListItemDto {
  id: string
  slug: string
  title: string
  description: string
  thumbnailUrl: string
  price: number
  lessonsCount: number
  freePreviewLessonsCount: number
  createdAt: string
}

export interface CourseListResponse {
  courses: CourseListItemDto[]
}

export interface LessonDto {
  id: string
  sectionId?: string
  title: string
  orderIndex: number
  isFreePreview: boolean
  videoUrl?: string
  description?: string | null
  watchedAt?: string | null
}

export interface SectionDto {
  id: string
  title: string
  orderIndex: number
  lessons: LessonDto[]
}

export interface CourseDetailDto {
  id: string
  slug: string
  title: string
  description: string
  thumbnailUrl: string
  price: number
  status: 'draft' | 'published'
  sections: SectionDto[]
}

export interface CourseDetailResponse {
  course: CourseDetailDto
  enrollment: {
    enrolled: boolean
    enrollmentId: string | null
  }
}

export interface CourseLessonResponse {
  course: CourseDetailDto
  lesson: LessonDto & {
    sectionId: string
  }
  enrollment: {
    enrolled: boolean
    enrollmentId: string | null
  }
}

export interface LessonProgressResponse {
  progress: {
    lessonId: string
    watchedAt: string
  }
}

export interface OrderCreateRequest {
  courseId: string
}

export interface OrderSummaryDto {
  id: string
  courseId: string
  status: 'pending_review' | 'approved' | 'rejected'
  createdAt: string
}

export interface OrderCreateResponse {
  order: OrderSummaryDto
}

export interface StudentOrderDto extends OrderSummaryDto {
  courseName: string
  rejectionReason: string | null
  reviewedAt: string | null
}

export interface StudentOrdersResponse {
  orders: StudentOrderDto[]
}

export interface EnrollmentDto {
  id: string
  courseId: string
  courseSlug: string
  courseName: string
  courseThumbnail: string
  price: number
  enrolledAt: string
  lessonsCount: number
  lessonsWatched: number
  continueLessonId: string | null
}

export interface EnrollmentResponse {
  enrollments: EnrollmentDto[]
}

export interface PaginationDto {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AdminOrderDto {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  courseId: string
  courseName: string
  status: 'pending_review' | 'approved' | 'rejected'
  proofUrl: string
  rejectionReason: string | null
  createdAt: string
  reviewedAt: string | null
  reviewedBy: string | null
}

export interface AdminOrdersResponse {
  orders: AdminOrderDto[]
  pagination: PaginationDto
}

export interface OrderDetailResponse {
  order: AdminOrderDto
}

export interface OrderReviewRequest {
  reason?: string
}

export interface OrderApprovalResponse {
  order: {
    id: string
    status: 'approved'
    reviewedAt: string
  }
  enrollment: {
    id: string
    courseId: string
    studentId: string
  }
}

export interface OrderRejectionResponse {
  order: {
    id: string
    status: 'rejected'
    rejectionReason: string | null
    reviewedAt: string
  }
}

export interface CommentDto {
  id: string
  authorName: string
  content: string
  createdAt: string
}

export interface CommentsResponse {
  comments: CommentDto[]
}

export interface CreateCommentRequest {
  content: string
}

export interface CreateCommentResponse {
  comment: CommentDto
}

export interface DeleteCommentResponse {
  message: string
}

export interface AdminCommentDto {
  id: string
  studentName: string
  studentEmail: string
  courseTitle: string
  courseSlug: string
  lessonTitle: string
  content: string
  createdAt: string
}

export interface AdminCommentsResponse {
  comments: AdminCommentDto[]
  pagination: PaginationDto
}

export interface AdminStudentListItemDto {
  id: string
  name: string
  email: string
  enrollmentCount: number
  joinedAt: string
}

export interface AdminStudentsResponse {
  students: AdminStudentListItemDto[]
  pagination: PaginationDto
}

export interface AdminStudentDetailResponse {
  student: {
    id: string
    name: string
    email: string
    joinedAt: string
    enrollments: Array<{
      courseId: string
      courseSlug: string
      courseName: string
      courseThumbnail: string
      enrolledAt: string
      lessonsWatched: number
    }>
  }
}

export interface AdminCourseLessonDto {
  id: string
  sectionId: string
  title: string
  videoUrl: string
  description: string | null
  orderIndex: number
  isFreePreview: boolean
  createdAt: string
}

export interface AdminCourseSectionDto {
  id: string
  courseId: string
  title: string
  orderIndex: number
  createdAt: string
  lessons: AdminCourseLessonDto[]
}

export interface AdminCourseListItemDto {
  id: string
  slug: string
  title: string
  description: string
  thumbnailUrl: string
  price: number
  status: 'draft' | 'published'
  sectionsCount: number
  lessonsCount: number
  enrollmentsCount: number
  createdAt: string
  updatedAt: string
}

export interface AdminCoursesResponse {
  courses: AdminCourseListItemDto[]
  summary: {
    total: number
    published: number
    draft: number
  }
  pagination: PaginationDto
}

export interface AdminCourseDetailDto {
  id: string
  slug: string
  title: string
  description: string
  thumbnailUrl: string
  price: number
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  sectionsCount: number
  lessonsCount: number
  enrollmentsCount: number
  sections: AdminCourseSectionDto[]
}

export interface AdminCourseDetailResponse {
  course: AdminCourseDetailDto
}

export interface AdminCourseRequest {
  title: string
  description: string
  thumbnailUrl: string
  price: number
}

export interface AdminSectionRequest {
  title: string
  orderIndex: number
}

export interface AdminLessonRequest {
  title: string
  videoUrl: string
  description?: string
}

export interface DeleteCourseResponse {
  message: string
}
