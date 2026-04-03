import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'

import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useAdminStudents } from '../hooks/useAdminStudents'

function formatAdminDate(date: string) {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join(' ')
}

export function AdminStudentsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')
  const { data, isLoading, isError, refetch } = useAdminStudents(page)

  const students = useMemo(() => data?.students ?? [], [data?.students])

  return (
    <section className="space-y-8">
      <header className="rounded-[2rem] border border-ghost bg-surface-high p-8 shadow-ambient">
        <div className="flex flex-col gap-4 text-right">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            {t('admin.studentsManagement.title')}
          </h1>
          <p className="text-sm leading-7 text-muted">
            {t('admin.studentsManagement.subtitle', {
              count: data?.pagination.total ?? 0,
            })}
          </p>
        </div>
      </header>

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
            description={t('admin.studentsManagement.loadError')}
            title={t('common.error')}
          />
        ) : null}

        {!isLoading && !isError && !students.length ? (
          <EmptyState
            description={t('admin.studentsManagement.emptyDescription')}
            title={t('admin.studentsManagement.emptyTitle')}
          />
        ) : null}

        {!isLoading && !isError && students.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-right">
                <thead className="bg-surface-low text-sm text-muted">
                  <tr>
                    <th className="px-6 py-4 font-bold">{t('admin.studentsManagement.studentColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.studentsManagement.emailColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.studentsManagement.enrollmentsColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.studentsManagement.joinDate')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.studentsManagement.statusColumn')}</th>
                    <th className="px-6 py-4 text-left font-bold">{t('admin.studentsManagement.actionsColumn')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ghost">
                  {students.map((student) => (
                    <tr className="transition hover:bg-surface-low/60" key={student.id}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-surface-low text-xs font-bold text-foreground">
                            {getInitials(student.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{student.name}</div>
                            <div className="text-xs text-muted">#{student.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-foreground">{student.email}</td>
                      <td className="px-6 py-5 text-sm text-foreground">
                        {t('admin.studentsManagement.enrollmentsCount', {
                          count: student.enrollmentCount,
                        })}
                      </td>
                      <td className="px-6 py-5 text-sm text-muted">
                        {formatAdminDate(student.joinedAt)}
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge
                          label={t('admin.studentsManagement.activeStatus')}
                          tone="success"
                        />
                      </td>
                      <td className="px-6 py-5 text-left">
                        <Link
                          className="inline-flex rounded-xl border border-ghost bg-surface-low px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-highest"
                          to={`/admin/students/${student.id}`}
                        >
                          {t('admin.studentsManagement.viewDetail')}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ghost bg-surface-low px-6 py-4 text-sm text-muted">
              <span>
                {t('admin.studentsManagement.paginationSummary', {
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
                  {t('admin.studentsManagement.previousPage')}
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
                  {t('admin.studentsManagement.nextPage')}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}
