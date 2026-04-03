import { useQuery } from '@tanstack/react-query'

import { apiClient } from '../services/apiClient'

export type StudentEnrollment = {
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

type StudentEnrollmentsResponse = {
  enrollments: StudentEnrollment[]
}

async function fetchMyEnrollments() {
  const response = await apiClient.get<StudentEnrollmentsResponse>('/enrollments/my')
  return response.data
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: ['enrollments', 'my'],
    queryFn: fetchMyEnrollments,
  })
}
