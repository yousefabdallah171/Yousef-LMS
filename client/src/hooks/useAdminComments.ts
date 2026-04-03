import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
  AdminCommentsResponse,
  DeleteCommentResponse,
} from '@yousef-lms/shared/types/api'

import { apiClient } from '../services/apiClient'

export function useAdminComments(page = 1) {
  return useQuery({
    queryKey: ['admin-comments', page],
    queryFn: async () => {
      const response = await apiClient.get<AdminCommentsResponse>('/admin/comments', {
        params: {
          page,
          limit: 20,
        },
      })

      return response.data
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (commentId: string) => {
      const response = await apiClient.delete<DeleteCommentResponse>(
        `/admin/comments/${commentId}`,
      )
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-comments'] })
      await queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}
