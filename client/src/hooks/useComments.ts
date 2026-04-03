import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '../services/apiClient'

export type CommentItem = {
  id: string
  authorName: string
  content: string
  createdAt: string
}

type CommentsResponse = {
  comments: CommentItem[]
}

type CreateCommentResponse = {
  comment: CommentItem
}

export function useComments(lessonId: string | undefined) {
  return useQuery({
    queryKey: ['comments', lessonId],
    queryFn: async () => {
      const response = await apiClient.get<CommentsResponse>(`/lessons/${lessonId}/comments`)
      return response.data
    },
    enabled: Boolean(lessonId),
  })
}

export function usePostComment(lessonId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content: string) => {
      const response = await apiClient.post<CreateCommentResponse>(
        `/lessons/${lessonId}/comments`,
        { content },
      )

      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['comments', lessonId] })
    },
  })
}
