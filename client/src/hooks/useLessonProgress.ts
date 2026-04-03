import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { LessonProgressResponse } from '@yousef-lms/shared/types/api'

import { apiClient } from '../services/apiClient'

async function markLessonWatched(lessonId: string) {
  const response = await apiClient.post<LessonProgressResponse>(
    `/lessons/${lessonId}/progress`,
  )

  return response.data
}

export function useMarkWatched() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markLessonWatched,
    onSuccess: async (_data, lessonId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['course-lesson'] }),
        queryClient.invalidateQueries({ queryKey: ['course'] }),
        queryClient.invalidateQueries({ queryKey: ['enrollments', 'my'] }),
      ])

      queryClient.setQueryData(
        ['lesson-progress', lessonId],
        _data.progress,
      )
    },
  })
}
