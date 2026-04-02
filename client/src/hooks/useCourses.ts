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

function normalizeCourseListItem(course: Partial<CourseListItem>): CourseListItem {
  const parsedPrice =
    typeof course.price === 'number' ? course.price : Number(course.price)

  return {
    id: typeof course.id === 'string' ? course.id : '',
    slug: typeof course.slug === 'string' ? course.slug : '',
    title: typeof course.title === 'string' ? course.title : '',
    description: typeof course.description === 'string' ? course.description : '',
    thumbnailUrl: typeof course.thumbnailUrl === 'string' ? course.thumbnailUrl : '',
    price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
    lessonsCount:
      typeof course.lessonsCount === 'number' ? course.lessonsCount : 0,
    freePreviewLessonsCount:
      typeof course.freePreviewLessonsCount === 'number'
        ? course.freePreviewLessonsCount
        : 0,
    createdAt:
      typeof course.createdAt === 'string'
        ? course.createdAt
        : new Date(0).toISOString(),
  }
}

async function fetchCourses() {
  const response = await apiClient.get<CourseListResponse>('/courses')

  return {
    courses: Array.isArray(response.data?.courses)
      ? response.data.courses.map((course) => normalizeCourseListItem(course))
      : [],
  } satisfies CourseListResponse
}

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })
}
