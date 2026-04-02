import { useQuery } from '@tanstack/react-query'

import { apiClient } from '../services/apiClient'

export type CourseLesson = {
  id: string
  sectionId: string
  title: string
  description?: string | null
  orderIndex: number
  isFreePreview: boolean
  videoUrl?: string
}

export type CourseSection = {
  id: string
  title: string
  orderIndex: number
  lessons: CourseLesson[]
}

export type CourseDetail = {
  id: string
  slug: string
  title: string
  description: string
  thumbnailUrl: string
  price: number
  status: 'draft' | 'published'
  sections: CourseSection[]
}

export type CourseDetailResponse = {
  course: CourseDetail
  enrollment: {
    enrolled: boolean
    enrollmentId: string | null
  }
}

export type CourseLessonResponse = {
  course: CourseDetail
  lesson: CourseLesson
  enrollment: {
    enrolled: boolean
    enrollmentId: string | null
  }
}

function shouldRetryCourseRequest(failureCount: number, error: unknown) {
  const status = (error as { response?: { status?: number } } | undefined)?.response
    ?.status

  if (status === 403 || status === 404) {
    return false
  }

  return failureCount < 3
}

async function fetchCourse(slug: string) {
  const response = await apiClient.get<CourseDetailResponse>(`/courses/${slug}`)

  return response.data
}

async function fetchLesson(slug: string, lessonId: string) {
  const response = await apiClient.get<CourseLessonResponse>(
    `/courses/${slug}/lessons/${lessonId}`,
  )

  return response.data
}

export function useCourse(slug: string | undefined) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: () => fetchCourse(slug!),
    enabled: Boolean(slug),
    retry: shouldRetryCourseRequest,
  })
}

export function useCourseLesson(
  slug: string | undefined,
  lessonId: string | undefined,
) {
  return useQuery({
    queryKey: ['course-lesson', slug, lessonId],
    queryFn: () => fetchLesson(slug!, lessonId!),
    enabled: Boolean(slug && lessonId),
    retry: shouldRetryCourseRequest,
  })
}
