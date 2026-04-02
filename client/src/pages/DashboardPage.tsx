import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { PageShell } from '../components/layout/PageShell'
import { ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'

type DashboardLocationState = {
  forbidden?: boolean
}

const forbiddenMessage = 'لا تملك صلاحية الوصول'

export function DashboardPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [showForbiddenToast, setShowForbiddenToast] = useState(
    Boolean((location.state as DashboardLocationState | null)?.forbidden),
  )

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

  return (
    <>
      {showForbiddenToast ? (
        <div className="pointer-events-none fixed left-4 top-4 z-50 sm:left-6 sm:top-6">
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
              <p className="text-muted">{forbiddenMessage}</p>
            </div>
          </div>
        </div>
      ) : null}

      <PageShell title={t('dashboard.title')} subtitle={t('dashboard.subtitle')}>
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <StatusBadge
              label={t('placeholder.statusAuthenticatedRoute')}
              tone="success"
            />
            <code className="rounded-lg bg-surface-low px-3 py-2 text-xs text-muted">
              /dashboard
            </code>
          </div>
          <p className="text-sm leading-7 text-muted">{t('placeholder.routeReady')}</p>
        </Card>

        <EmptyState
          title={t('dashboard.title')}
          description={t('dashboard.subtitle')}
          action={<ButtonLink to="/courses">{t('catalog.browseCourses')}</ButtonLink>}
        />
      </PageShell>
    </>
  )
}
