import { useQuery } from '@tanstack/react-query'

import type {
  AdminStudentDetailResponse,
  AdminStudentsResponse,
} from '@yousef-lms/shared/types/api'

import { apiClient } from '../services/apiClient'

async function fetchAdminStudents(page = 1) {
  const response = await apiClient.get<AdminStudentsResponse>('/admin/students', {
    params: {
      page,
      limit: 20,
    },
  })

  return response.data
}

async function fetchAdminStudentDetail(id: string) {
  const response = await apiClient.get<AdminStudentDetailResponse>(`/admin/students/${id}`)
  return response.data
}

export function useAdminStudents(page = 1) {
  return useQuery({
    queryKey: ['admin-students', page],
    queryFn: () => fetchAdminStudents(page),
  })
}

export function useAdminStudentDetail(id?: string) {
  return useQuery({
    queryKey: ['admin-student', id],
    queryFn: () => fetchAdminStudentDetail(id!),
    enabled: Boolean(id),
  })
}
