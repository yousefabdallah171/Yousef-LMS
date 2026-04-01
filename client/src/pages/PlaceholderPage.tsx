import type { ReactNode } from 'react'

import { PageShell } from '../components/layout/PageShell'
import { ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'

export function PlaceholderPage({
  title,
  subtitle,
  route,
  status = 'Foundation ready',
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
  return (
    <PageShell title={title} subtitle={subtitle}>
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusBadge label={status} tone={tone} />
          <code className="rounded-lg bg-surface-low px-3 py-2 text-xs text-muted">
            {route}
          </code>
        </div>
        <p className="text-sm leading-7 text-muted">
          This route is now part of the application shell and ready for its Stitch-derived screen implementation.
        </p>
        {action}
      </Card>
    </PageShell>
  )
}

export function NotFoundPlaceholder() {
  return (
    <PageShell
      title="Page not found"
      subtitle="The requested route is outside the current application map."
    >
      <EmptyState
        title="Nothing here yet"
        description="Use the course catalog or return to the homepage."
        action={<ButtonLink to="/">Back home</ButtonLink>}
      />
    </PageShell>
  )
}
