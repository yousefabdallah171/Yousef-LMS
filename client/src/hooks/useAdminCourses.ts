import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
  AdminCourseDetailResponse,
  AdminCourseRequest,
  AdminCoursesResponse,
  AdminLessonRequest,
  AdminSectionRequest,
  DeleteCourseResponse,
} from '@yousef-lms/shared/types/api'

import { apiClient } from '../services/apiClient'

export type AdminCourseStatus = 'draft' | 'published'

async function fetchAdminCourses(status?: AdminCourseStatus, page = 1) {
  const response = await apiClient.get<AdminCoursesResponse>('/admin/courses', {
    params: {
      status,
      page,
      limit: 20,
    },
  })

  return response.data
}

async function fetchAdminCourse(id: string) {
  const response = await apiClient.get<AdminCourseDetailResponse>(`/admin/courses/${id}`)
  return response.data
}

export function useAdminCourses(status?: AdminCourseStatus, page = 1) {
  return useQuery({
    queryKey: ['admin-courses', status ?? 'all', page],
    queryFn: () => fetchAdminCourses(status, page),
  })
}

export function useAdminCourse(id?: string) {
  return useQuery({
    queryKey: ['admin-course', id],
    queryFn: () => fetchAdminCourse(id!),
    enabled: Boolean(id),
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AdminCourseRequest) => {
      const response = await apiClient.post<AdminCourseDetailResponse>('/admin/courses', payload)
      return response.data
    },
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-courses'] }),
        queryClient.setQueryData(['admin-course', data.course.id], data),
      ])
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      courseId,
      payload,
    }: {
      courseId: string
      payload: Partial<AdminCourseRequest>
    }) => {
      const response = await apiClient.put<AdminCourseDetailResponse>(
        `/admin/courses/${courseId}`,
        payload,
      )
      return response.data
    },
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-courses'] }),
        queryClient.setQueryData(['admin-course', data.course.id], data),
      ])
    },
  })
}

function useCourseStatusMutation(endpoint: 'publish' | 'unpublish') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await apiClient.post(`/admin/courses/${courseId}/${endpoint}`)
      return response.data as { course: { id: string; status: AdminCourseStatus } }
    },
    onSuccess: async (_data, courseId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-course', courseId] }),
        queryClient.invalidateQueries({ queryKey: ['courses'] }),
        queryClient.invalidateQueries({ queryKey: ['course'] }),
      ])
    },
  })
}

export function usePublishCourse() {
  return useCourseStatusMutation('publish')
}

export function useUnpublishCourse() {
  return useCourseStatusMutation('unpublish')
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await apiClient.delete<DeleteCourseResponse>(`/admin/courses/${courseId}`)
      return response.data
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['courses'] }),
        queryClient.invalidateQueries({ queryKey: ['course'] }),
      ])
    },
  })
}

export function useCreateSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      courseId,
      payload,
    }: {
      courseId: string
      payload: AdminSectionRequest
    }) => {
      const response = await apiClient.post(`/admin/courses/${courseId}/sections`, payload)
      return response.data
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-course', variables.courseId] }),
      ])
    },
  })
}

export function useCreateLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sectionId,
      payload,
    }: {
      courseId: string
      sectionId: string
      payload: AdminLessonRequest
    }) => {
      const response = await apiClient.post(`/admin/sections/${sectionId}/lessons`, payload)
      return response.data
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-course', variables.courseId] }),
      ])
    },
  })
}

export function useUpdateLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      lessonId,
      payload,
    }: {
      courseId: string
      lessonId: string
      payload: Partial<AdminLessonRequest>
    }) => {
      const response = await apiClient.put(`/admin/lessons/${lessonId}`, payload)
      return response.data
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-course', variables.courseId] }),
      ])
    },
  })
}

export function useDeleteLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      lessonId,
    }: {
      courseId: string
      lessonId: string
    }) => {
      const response = await apiClient.delete(`/admin/lessons/${lessonId}`)
      return response.data
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-course', variables.courseId] }),
      ])
    },
  })
}

type AdminCourseError = {
  response?: {
    data?: {
      code?: string
      message?: string
      details?: {
        enrollmentCount?: number
      }
    }
  }
}

export function getAdminCourseErrorMessage(error: unknown, fallback: string) {
  const apiError = error as AdminCourseError

  if (apiError.response?.data?.code === 'COURSE_HAS_ENROLLMENTS') {
    return apiError.response.data.message || fallback
  }

  if (apiError.response?.data?.code === 'CANNOT_DELETE_ONLY_LESSON') {
    return apiError.response.data.message || fallback
  }

  return apiError.response?.data?.message || fallback
}
