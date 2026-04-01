import type { ReactNode } from 'react'

import { Card } from './Card'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <Card className="text-center">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  )
}
