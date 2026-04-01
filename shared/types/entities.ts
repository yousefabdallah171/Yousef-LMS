export type UserRole = 'admin' | 'student'

export interface UserEntity {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface CourseEntity {
  id: string
  slug: string
  title: string
  description: string
  thumbnailUrl: string
  price: number
}
