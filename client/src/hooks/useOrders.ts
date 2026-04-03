import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '../services/apiClient'

export type StudentOrderStatus = 'pending_review' | 'approved' | 'rejected'

export type StudentOrder = {
  id: string
  courseId: string
  courseName: string
  status: StudentOrderStatus
  rejectionReason: string | null
  createdAt: string
  reviewedAt: string | null
}

type StudentOrdersResponse = {
  orders: StudentOrder[]
}

type CreateOrderResponse = {
  order: {
    id: string
    courseId: string
    status: StudentOrderStatus
    createdAt: string
  }
}

type CreateOrderInput = {
  courseId: string
  proofFile: File
  onProgress?: (progress: number) => void
}

async function fetchMyOrders() {
  const response = await apiClient.get<StudentOrdersResponse>('/orders/my')
  return response.data
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: fetchMyOrders,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ courseId, proofFile, onProgress }: CreateOrderInput) => {
      const formData = new FormData()
      formData.append('courseId', courseId)
      formData.append('proofFile', proofFile)

      const response = await apiClient.post<CreateOrderResponse>('/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          if (!onProgress || !event.total) {
            return
          }

          onProgress(Math.round((event.loaded / event.total) * 100))
        },
      })

      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['orders', 'my'] })
    },
  })
}
