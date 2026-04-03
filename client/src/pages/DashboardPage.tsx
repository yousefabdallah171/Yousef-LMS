import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useMyOrders } from '../hooks/useOrders'

type DashboardLocationState = {
  forbidden?: boolean
}

export function DashboardPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [showForbiddenToast, setShowForbiddenToast] = useState(
    Boolean((location.state as DashboardLocationState | null)?.forbidden),
  )
  const { data, isLoading, isError, refetch } = useMyOrders()

  useEffect(() => {
    const state = location.state as DashboardLocationState | null

    if (!state?.forbidden) {
      return
    }

    setShowForbiddenToast(true)
    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: null,
    })

    const timeoutId = window.setTimeout(() => {
      setShowForbiddenToast(false)
    }, 4000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [location.pathname, location.search, location.state, navigate])

  const summary = useMemo(() => {
    const orders = data?.orders ?? []

    return {
      total: orders.length,
      pending: orders.filter((order) => order.status === 'pending_review').length,
      approved: orders.filter((order) => order.status === 'approved').length,
      rejected: orders.filter((order) => order.status === 'rejected').length,
    }
  }, [data?.orders])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {showForbiddenToast ? (
        <div className="pointer-events-none fixed start-4 top-4 z-50 sm:start-6 sm:top-6">
          <div
            aria-live="assertive"
            className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-danger/25 bg-surface-high px-4 py-3 text-sm text-foreground shadow-ambient"
            role="alert"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-danger/15 text-danger">
              !
            </span>
            <div className="space-y-1">
              <p className="font-semibold text-danger">{t('errors.forbidden')}</p>
              <p className="text-muted">{t('errors.forbiddenMessage')}</p>
            </div>
          </div>
        </div>
      ) : null}

      <section className="space-y-8">
        <header className="rounded-[2rem] border border-ghost bg-surface-high p-8 shadow-ambient">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="text-right">
              <h1 className="text-4xl font-black tracking-tight text-foreground">
                {t('dashboard.title')}
              </h1>
              <p className="mt-2 text-sm leading-7 text-muted">{t('dashboard.subtitle')}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <Card className="rounded-2xl border border-ghost bg-surface-low p-4 shadow-none">
                <div className="text-xs font-semibold text-muted">{t('dashboard.totalOrders')}</div>
                <div className="mt-2 text-3xl font-black text-foreground">{summary.total}</div>
              </Card>
              <Card className="rounded-2xl border border-ghost bg-surface-low p-4 shadow-none">
                <div className="text-xs font-semibold text-muted">{t('dashboard.pendingStatus')}</div>
                <div className="mt-2 text-3xl font-black text-warning">{summary.pending}</div>
              </Card>
              <Card className="rounded-2xl border border-ghost bg-surface-low p-4 shadow-none">
                <div className="text-xs font-semibold text-muted">{t('dashboard.approvedStatus')}</div>
                <div className="mt-2 text-3xl font-black text-success">{summary.approved}</div>
              </Card>
              <Card className="rounded-2xl border border-ghost bg-surface-low p-4 shadow-none">
                <div className="text-xs font-semibold text-muted">{t('dashboard.rejectedStatus')}</div>
                <div className="mt-2 text-3xl font-black text-danger">{summary.rejected}</div>
              </Card>
            </div>
          </div>
        </header>

        <section className="rounded-[2rem] border border-ghost bg-surface-high p-8 shadow-ambient">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <ButtonLink to="/courses">{t('catalog.browseCourses')}</ButtonLink>
            <div className="text-right">
              <h2 className="text-2xl font-black text-foreground">{t('dashboard.myOrders')}</h2>
              <p className="mt-1 text-sm text-muted">{t('dashboard.ordersSubtitle')}</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, index) => (
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
              description={t('dashboard.loadError')}
              title={t('common.error')}
            />
          ) : null}

          {!isLoading && !isError && !(data?.orders.length ?? 0) ? (
            <EmptyState
              action={<ButtonLink to="/courses">{t('catalog.browseCourses')}</ButtonLink>}
              description={t('dashboard.noOrdersDescription')}
              title={t('dashboard.noOrders')}
            />
          ) : null}

          {!isLoading && !isError && data?.orders.length ? (
            <div className="space-y-4">
              {data.orders.map((order) => (
                <div
                  className="rounded-2xl border border-ghost bg-surface-low p-5"
                  key={order.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted">
                        {t('dashboard.orderDate')}: {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(new Date(order.createdAt))}
                      </div>
                      <h3 className="mt-2 text-xl font-bold text-foreground">{order.courseName}</h3>
                      {order.rejectionReason ? (
                        <p className="mt-3 text-sm text-danger">
                          {t('dashboard.rejectionReason')}: {order.rejectionReason}
                        </p>
                      ) : null}
                    </div>
                    <StatusBadge
                      label={
                        order.status === 'approved'
                          ? t('dashboard.approvedStatus')
                          : order.status === 'rejected'
                            ? t('dashboard.rejectedStatus')
                            : t('dashboard.pendingStatus')
                      }
                      tone={
                        order.status === 'approved'
                          ? 'success'
                          : order.status === 'rejected'
                            ? 'danger'
                            : 'warning'
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </section>
    </main>
  )
}
