import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { PageShell } from '../components/layout/PageShell'
import { ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'

export function PlaceholderPage({
  title,
  subtitle,
  route,
  status,
  tone = 'info',
  action,
}: {
  title: string
  subtitle: string
  route: string
  status?: string
  tone?: 'success' | 'warning' | 'danger' | 'info'
  action?: ReactNode
}) {
  const { t } = useTranslation()

  return (
    <PageShell title={title} subtitle={subtitle}>
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusBadge label={status || t('placeholder.statusFoundationReady')} tone={tone} />
          <code className="rounded-lg bg-surface-low px-3 py-2 text-xs text-muted">
            {route}
          </code>
        </div>
        <p className="text-sm leading-7 text-muted">
          {t('placeholder.routeReady')}
        </p>
        {action}
      </Card>
    </PageShell>
  )
}

export function NotFoundPlaceholder() {
  const { t } = useTranslation()

  return (
    <PageShell
      title={t('errors.notFound')}
      subtitle={t('errors.notFoundDesc')}
    >
      <EmptyState
        title={t('errors.nothingHere')}
        description={t('errors.nothingHereDesc')}
        action={<ButtonLink to="/">{t('common.backHome')}</ButtonLink>}
      />
    </PageShell>
  )
}
