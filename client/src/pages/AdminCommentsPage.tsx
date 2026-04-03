import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useAdminComments, useDeleteComment } from '../hooks/useAdminComments'

function formatAdminDate(date: string) {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function AdminCommentsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const page = Number(searchParams.get('page') || '1')
  const { data, isLoading, isError, refetch } = useAdminComments(page)
  const deleteComment = useDeleteComment()

  const comments = useMemo(() => data?.comments ?? [], [data?.comments])

  async function handleDelete(commentId: string) {
    if (!window.confirm(t('admin.commentModeration.deleteConfirm'))) {
      return
    }

    try {
      await deleteComment.mutateAsync(commentId)
      setFeedback(t('admin.commentModeration.deleteSuccess'))
      if (expandedId === commentId) {
        setExpandedId(null)
      }
    } catch {
      setFeedback(t('admin.commentModeration.deleteError'))
    }
  }

  return (
    <section className="space-y-8">
      <header className="rounded-[2rem] border border-ghost bg-surface-high p-8 shadow-ambient">
        <div className="flex flex-col gap-4 text-right">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            {t('admin.commentModeration.title')}
          </h1>
          <p className="text-sm leading-7 text-muted">
            {t('admin.commentModeration.subtitle', {
              count: data?.pagination.total ?? 0,
            })}
          </p>
        </div>
      </header>

      {feedback ? (
        <div className="rounded-2xl border border-ghost bg-surface-high p-4 text-sm text-foreground shadow-ambient">
          {feedback}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[2rem] border border-ghost bg-surface-high shadow-ambient">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="h-24 animate-pulse rounded-2xl bg-surface-low" key={index} />
            ))}
          </div>
        ) : null}

        {!isLoading && isError ? (
          <EmptyState
            action={
              <button
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                onClick={() => void refetch()}
                type="button"
              >
                {t('common.retry')}
              </button>
            }
            description={t('admin.commentModeration.loadError')}
            title={t('common.error')}
          />
        ) : null}

        {!isLoading && !isError && !comments.length ? (
          <EmptyState
            description={t('admin.commentModeration.emptyDescription')}
            title={t('admin.commentModeration.emptyTitle')}
          />
        ) : null}

        {!isLoading && !isError && data && comments.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-right">
                <thead className="bg-surface-low text-sm text-muted">
                  <tr>
                    <th className="px-6 py-4 font-bold">{t('admin.commentModeration.studentColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.commentModeration.lessonColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.commentModeration.courseColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.commentModeration.commentColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.commentModeration.dateColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.commentModeration.statusColumn')}</th>
                    <th className="px-6 py-4 text-left font-bold">{t('admin.commentModeration.actionsColumn')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ghost">
                  {comments.map((comment) => {
                    const expanded = expandedId === comment.id
                    return (
                      <tr className="transition hover:bg-surface-low/60" key={comment.id}>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <div className="font-semibold text-foreground">{comment.studentName}</div>
                            <div className="text-xs text-muted">{comment.studentEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-foreground">{comment.lessonTitle}</td>
                        <td className="px-6 py-5 text-sm text-foreground">{comment.courseTitle}</td>
                        <td className="max-w-xs px-6 py-5 text-sm text-foreground">
                          <p className={expanded ? 'leading-7' : 'line-clamp-2 leading-7'}>
                            {comment.content}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-sm text-muted">
                          {formatAdminDate(comment.createdAt)}
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge
                            label={t('admin.commentModeration.safeStatus')}
                            tone="success"
                          />
                        </td>
                        <td className="px-6 py-5 text-left">
                          <div className="flex justify-end gap-2">
                            <button
                              className="rounded-xl border border-ghost bg-surface-low px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-highest"
                              onClick={() => setExpandedId(expanded ? null : comment.id)}
                              type="button"
                            >
                              {expanded
                                ? t('admin.commentModeration.collapseAction')
                                : t('admin.commentModeration.expandAction')}
                            </button>
                            <button
                              className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                              disabled={deleteComment.isPending}
                              onClick={() => void handleDelete(comment.id)}
                              type="button"
                            >
                              {t('admin.commentModeration.deleteComment')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ghost bg-surface-low px-6 py-4 text-sm text-muted">
              <span>
                {t('admin.commentModeration.paginationSummary', {
                  page: data.pagination.page,
                  pages: data.pagination.pages,
                  total: data.pagination.total,
                })}
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-lg border border-ghost px-3 py-2 disabled:opacity-50"
                  disabled={data.pagination.page <= 1}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.set('page', String(Math.max(1, data.pagination.page - 1)))
                    setSearchParams(next)
                  }}
                  type="button"
                >
                  {t('admin.commentModeration.previousPage')}
                </button>
                <button
                  className="rounded-lg border border-ghost px-3 py-2 disabled:opacity-50"
                  disabled={data.pagination.page >= data.pagination.pages}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.set(
                      'page',
                      String(Math.min(data.pagination.pages, data.pagination.page + 1)),
                    )
                    setSearchParams(next)
                  }}
                  type="button"
                >
                  {t('admin.commentModeration.nextPage')}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}
