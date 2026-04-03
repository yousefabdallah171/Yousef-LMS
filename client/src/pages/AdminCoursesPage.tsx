import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'

import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'
import {
  getAdminCourseErrorMessage,
  useAdminCourses,
  useDeleteCourse,
  usePublishCourse,
  useUnpublishCourse,
  type AdminCourseStatus,
} from '../hooks/useAdminCourses'

const filters: Array<{ key: 'all' | AdminCourseStatus; value?: AdminCourseStatus }> = [
  { key: 'all' },
  { key: 'published', value: 'published' },
  { key: 'draft', value: 'draft' },
]

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function AdminCoursesPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [feedback, setFeedback] = useState<string | null>(null)
  const status = (searchParams.get('status') as AdminCourseStatus | null) ?? undefined
  const page = Number(searchParams.get('page') || '1')
  const { data, isLoading, isError, refetch } = useAdminCourses(status, page)
  const publishCourse = usePublishCourse()
  const unpublishCourse = useUnpublishCourse()
  const deleteCourse = useDeleteCourse()

  const courses = useMemo(() => data?.courses ?? [], [data?.courses])

  async function handlePublish(courseId: string, nextStatus: AdminCourseStatus) {
    try {
      if (nextStatus === 'published') {
        await publishCourse.mutateAsync(courseId)
        setFeedback(t('admin.courses.coursePublished'))
      } else {
        await unpublishCourse.mutateAsync(courseId)
        setFeedback(t('admin.courses.courseUnpublished'))
      }
    } catch (error) {
      setFeedback(getAdminCourseErrorMessage(error, t('admin.courses.genericError')))
    }
  }

  async function handleDelete(courseId: string) {
    if (!window.confirm(t('admin.courses.deleteConfirm'))) {
      return
    }

    try {
      await deleteCourse.mutateAsync(courseId)
      setFeedback(t('admin.courses.courseDeleted'))
    } catch (error) {
      setFeedback(getAdminCourseErrorMessage(error, t('admin.courses.genericError')))
    }
  }

  return (
    <section className="space-y-8">
      <header className="rounded-[2rem] border border-ghost bg-surface-high p-8 shadow-ambient">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="text-right">
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              {t('admin.courses.title')}
            </h1>
            <p className="mt-2 text-sm leading-7 text-muted">
              {t('admin.courses.subtitle', {
                count: data?.summary.total ?? 0,
              })}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-ghost bg-surface-low p-4">
              <div className="text-xs font-semibold text-muted">
                {t('admin.courses.totalCourses')}
              </div>
              <div className="mt-2 text-3xl font-black text-foreground">
                {data?.summary.total ?? 0}
              </div>
            </div>
            <div className="rounded-2xl border border-ghost bg-surface-low p-4">
              <div className="text-xs font-semibold text-muted">
                {t('admin.courses.publishedCourses')}
              </div>
              <div className="mt-2 text-3xl font-black text-success">
                {data?.summary.published ?? 0}
              </div>
            </div>
            <div className="rounded-2xl border border-ghost bg-surface-low p-4">
              <div className="text-xs font-semibold text-muted">
                {t('admin.courses.draftCourses')}
              </div>
              <div className="mt-2 text-3xl font-black text-warning">
                {data?.summary.draft ?? 0}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="inline-flex flex-wrap gap-2 rounded-2xl border border-ghost bg-surface-low p-2">
          {filters.map((filter) => {
            const isActive = (filter.value ?? undefined) === status || (!filter.value && !status)

            return (
              <button
                className={[
                  'rounded-xl px-5 py-2.5 text-sm font-semibold transition',
                  isActive ? 'bg-primary text-white' : 'text-muted hover:bg-surface-high',
                ].join(' ')}
                key={filter.key}
                onClick={() => {
                  const next = new URLSearchParams(searchParams)

                  if (filter.value) {
                    next.set('status', filter.value)
                  } else {
                    next.delete('status')
                  }

                  next.delete('page')
                  setSearchParams(next)
                }}
                type="button"
              >
                {t(`admin.courses.filters.${filter.key}`)}
              </button>
            )
          })}
        </div>

        <Link
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          to="/admin/courses/new"
        >
          {t('admin.courses.newCourse')}
        </Link>
      </div>

      {feedback ? (
        <div className="rounded-2xl border border-ghost bg-surface-high p-4 text-sm text-foreground shadow-ambient">
          {feedback}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[2rem] border border-ghost bg-surface-high shadow-ambient">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="h-16 animate-pulse rounded-2xl bg-surface-low" key={index} />
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
            description={t('admin.courses.loadError')}
            title={t('common.error')}
          />
        ) : null}

        {!isLoading && !isError && !courses.length ? (
          <EmptyState
            action={
              <Link
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                to="/admin/courses/new"
              >
                {t('admin.courses.newCourse')}
              </Link>
            }
            description={t('admin.courses.emptyDescription')}
            title={t('admin.courses.emptyTitle')}
          />
        ) : null}

        {!isLoading && !isError && courses.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-right">
                <thead className="bg-surface-low text-sm text-muted">
                  <tr>
                    <th className="px-6 py-4 font-bold">{t('admin.courses.courseColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.courses.statusColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.courses.lessonsColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.courses.priceColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.courses.updatedAtColumn')}</th>
                    <th className="px-6 py-4 text-left font-bold">
                      {t('admin.courses.actionsColumn')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ghost">
                  {courses.map((course) => (
                    <tr className="transition hover:bg-surface-low/60" key={course.id}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <img
                            alt={course.title}
                            className="h-12 w-20 rounded-xl object-cover"
                            src={course.thumbnailUrl}
                          />
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-foreground">
                              {course.title}
                            </div>
                            <div className="truncate text-xs text-muted">{course.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge
                          label={t(`admin.courses.statuses.${course.status}`)}
                          tone={course.status === 'published' ? 'success' : 'warning'}
                        />
                      </td>
                      <td className="px-6 py-5 text-sm text-foreground">
                        <div className="space-y-1">
                          <div>{t('admin.courses.lessonsCount', { count: course.lessonsCount })}</div>
                          <div className="text-xs text-muted">
                            {t('admin.courses.sectionsCount', { count: course.sectionsCount })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-primary">
                        {t('admin.courses.priceValue', { price: course.price })}
                      </td>
                      <td className="px-6 py-5 text-sm text-muted">
                        {formatDate(course.updatedAt)}
                      </td>
                      <td className="px-6 py-5 text-left">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Link
                            className="rounded-xl border border-ghost bg-surface-low px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-highest"
                            to={`/admin/courses/${course.id}/edit`}
                          >
                            {t('admin.courses.editCourse')}
                          </Link>
                          <button
                            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                            onClick={() =>
                              void handlePublish(
                                course.id,
                                course.status === 'published' ? 'draft' : 'published',
                              )
                            }
                            type="button"
                          >
                            {course.status === 'published'
                              ? t('admin.courses.unpublishCourse')
                              : t('admin.courses.publishCourse')}
                          </button>
                          <button
                            className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                            onClick={() => void handleDelete(course.id)}
                            type="button"
                          >
                            {t('admin.courses.deleteCourse')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ghost bg-surface-low px-6 py-4 text-sm text-muted">
              <span>
                {t('admin.courses.paginationSummary', {
                  page: data?.pagination.page ?? 1,
                  pages: data?.pagination.pages ?? 1,
                  total: data?.pagination.total ?? 0,
                })}
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-lg border border-ghost px-3 py-2 disabled:opacity-50"
                  disabled={(data?.pagination.page ?? 1) <= 1}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.set('page', String(Math.max(1, (data?.pagination.page ?? 1) - 1)))
                    setSearchParams(next)
                  }}
                  type="button"
                >
                  {t('admin.courses.previousPage')}
                </button>
                <button
                  className="rounded-lg border border-ghost px-3 py-2 disabled:opacity-50"
                  disabled={(data?.pagination.page ?? 1) >= (data?.pagination.pages ?? 1)}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.set(
                      'page',
                      String(
                        Math.min(
                          data?.pagination.pages ?? 1,
                          (data?.pagination.page ?? 1) + 1,
                        ),
                      ),
                    )
                    setSearchParams(next)
                  }}
                  type="button"
                >
                  {t('admin.courses.nextPage')}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}
