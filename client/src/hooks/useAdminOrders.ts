import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '../services/apiClient'

export type AdminOrderStatus = 'pending_review' | 'approved' | 'rejected'

export type AdminOrder = {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  courseId: string
  courseName: string
  status: AdminOrderStatus
  proofUrl: string
  rejectionReason: string | null
  createdAt: string
  reviewedAt: string | null
  reviewedBy: string | null
}

export type AdminOrdersResponse = {
  orders: AdminOrder[]
  summary: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

type ReviewError = {
  response?: {
    data?: {
      code?: string
      message?: string
    }
  }
}

async function fetchAdminOrders(status?: AdminOrderStatus, page = 1) {
  const response = await apiClient.get<AdminOrdersResponse>('/admin/orders', {
    params: {
      status,
      page,
      limit: 20,
    },
  })

  return response.data
}

async function fetchAdminOrderDetail(id: string) {
  const response = await apiClient.get<{ order: AdminOrder }>(`/admin/orders/${id}`)
  return response.data
}

export function useAdminOrders(status?: AdminOrderStatus, page = 1) {
  return useQuery({
    queryKey: ['admin-orders', status ?? 'all', page],
    queryFn: () => fetchAdminOrders(status, page),
  })
}

export function useAdminOrderDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => fetchAdminOrderDetail(id!),
    enabled: Boolean(id),
  })
}

export function useApproveOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiClient.post(`/admin/orders/${orderId}/approve`)
      return response.data
    },
    onSuccess: async (_data, orderId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-order', orderId] }),
      ])
    },
  })
}

export function useRejectOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason?: string }) => {
      const response = await apiClient.post(`/admin/orders/${orderId}/reject`, {
        reason,
      })
      return response.data
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-order', variables.orderId] }),
      ])
    },
  })
}

export function getAdminOrderErrorMessage(error: unknown, fallback: string) {
  const reviewError = error as ReviewError

  if (reviewError.response?.data?.code === 'ALREADY_APPROVED') {
    return 'alreadyApproved'
  }

  if (reviewError.response?.data?.code === 'ORDER_ALREADY_ENROLLED') {
    return 'alreadyEnrolled'
  }

  return reviewError.response?.data?.message || fallback
}
