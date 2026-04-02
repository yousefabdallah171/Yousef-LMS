import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'

import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useAdminOrders, type AdminOrderStatus } from '../hooks/useAdminOrders'

const statusFilters: Array<{ key: 'all' | AdminOrderStatus; value?: AdminOrderStatus }> = [
  { key: 'all' },
  { key: 'pending_review', value: 'pending_review' },
  { key: 'approved', value: 'approved' },
  { key: 'rejected', value: 'rejected' },
]

const filterLabelKey: Record<'all' | AdminOrderStatus, string> = {
  all: 'allOrders',
  pending_review: 'pendingOrders',
  approved: 'approvedOrders',
  rejected: 'rejectedOrders',
}

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

export function AdminOrdersPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeStatus = (searchParams.get('status') as AdminOrderStatus | null) ?? undefined
  const page = Number(searchParams.get('page') || '1')
  const { data, isLoading, isError, refetch } = useAdminOrders(activeStatus, page)

  return (
    <section className="space-y-8">
      <header className="rounded-[2rem] border border-ghost bg-surface-high p-8 shadow-ambient">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="text-right">
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              {t('admin.orders.title')}
            </h1>
            <p className="mt-2 text-sm leading-7 text-muted">
              {t('admin.orders.subtitle', {
                count: data?.summary.total ?? 0,
              })}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-ghost bg-surface-low p-4">
              <div className="text-xs font-semibold text-muted">
                {t('admin.orders.pendingOrders')}
              </div>
              <div className="mt-2 text-3xl font-black text-warning">
                {data?.summary.pending ?? 0}
              </div>
            </div>
            <div className="rounded-2xl border border-ghost bg-surface-low p-4">
              <div className="text-xs font-semibold text-muted">
                {t('admin.orders.approvedOrders')}
              </div>
              <div className="mt-2 text-3xl font-black text-success">
                {data?.summary.approved ?? 0}
              </div>
            </div>
            <div className="rounded-2xl border border-ghost bg-surface-low p-4">
              <div className="text-xs font-semibold text-muted">
                {t('admin.orders.rejectedOrders')}
              </div>
              <div className="mt-2 text-3xl font-black text-danger">
                {data?.summary.rejected ?? 0}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="inline-flex flex-wrap gap-2 rounded-2xl border border-ghost bg-surface-low p-2">
        {statusFilters.map((filter) => {
          const isActive = (filter.value ?? undefined) === activeStatus || (!filter.value && !activeStatus)

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
              {t(`admin.orders.${filterLabelKey[filter.key]}`)}
            </button>
          )
        })}
      </div>

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
            description={t('admin.orders.loadError')}
            title={t('common.error')}
          />
        ) : null}

        {!isLoading && !isError && !data?.orders.length ? (
          <EmptyState
            description={t('admin.orders.emptyDescription')}
            title={t('admin.orders.emptyTitle')}
          />
        ) : null}

        {!isLoading && !isError && data?.orders.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-right">
                <thead className="bg-surface-low text-sm text-muted">
                  <tr>
                    <th className="px-6 py-4 font-bold">{t('admin.orders.studentColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.orders.courseColumn')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.orders.submittedAt')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.orders.statusColumn')}</th>
                    <th className="px-6 py-4 text-left font-bold">{t('admin.orders.actionsColumn')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ghost">
                  {data.orders.map((order) => (
                    <tr className="transition hover:bg-surface-low/60" key={order.id}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-surface-low text-xs font-bold text-foreground">
                            {getInitials(order.studentName)}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">
                              {order.studentName}
                            </div>
                            <div className="text-xs text-muted">{order.studentEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-foreground">{order.courseName}</td>
                      <td className="px-6 py-5 text-sm text-muted">
                        {formatAdminDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge
                          label={t(`admin.orders.statuses.${order.status}`)}
                          tone={
                            order.status === 'approved'
                              ? 'success'
                              : order.status === 'rejected'
                                ? 'danger'
                                : 'warning'
                          }
                        />
                      </td>
                      <td className="px-6 py-5 text-left">
                        <Link
                          className={[
                            'inline-flex rounded-xl px-4 py-2 text-sm font-semibold transition',
                            order.status === 'pending_review'
                              ? 'bg-primary text-white'
                              : 'border border-ghost bg-surface-low text-foreground',
                          ].join(' ')}
                          to={`/admin/orders/${order.id}`}
                        >
                          {order.status === 'pending_review'
                            ? t('admin.orders.reviewAction')
                            : t('admin.orders.orderDetail')}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ghost bg-surface-low px-6 py-4 text-sm text-muted">
              <span>
                {t('admin.orders.paginationSummary', {
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
                  {t('admin.orders.previousPage')}
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
                  {t('admin.orders.nextPage')}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}
