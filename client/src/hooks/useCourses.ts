import { useQuery } from '@tanstack/react-query'

import { apiClient } from '../services/apiClient'

type CourseListItem = {
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

type CourseListResponse = {
  courses: CourseListItem[]
}

async function fetchCourses() {
  const response = await apiClient.get<CourseListResponse>('/courses')

  return response.data
}

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })
}
