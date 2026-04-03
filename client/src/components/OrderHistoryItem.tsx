import { useTranslation } from 'react-i18next'

import type { StudentOrder } from '../hooks/useOrders'
import { OrderStatusBadge } from './OrderStatusBadge'
import { ButtonLink } from './ui/Button'

export function OrderHistoryItem({ order }: { order: StudentOrder }) {
  const { t } = useTranslation()

  return (
    <article className="rounded-2xl border border-ghost bg-surface-low p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="text-right">
          <div className="text-sm text-muted">
            {t('dashboard.orderDate')}:{' '}
            {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(
              new Date(order.createdAt),
            )}
          </div>
          <h3 className="mt-2 text-xl font-bold text-foreground">{order.courseName}</h3>
          {order.rejectionReason ? (
            <p className="mt-3 text-sm text-danger">
              {t('dashboard.rejectionReason')}: {order.rejectionReason}
            </p>
          ) : null}
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.status === 'rejected' ? (
        <div className="mt-5 flex justify-start">
          <ButtonLink to={`/payment/${order.courseId}`} variant="secondary">
            {t('dashboard.resubmitProof')}
          </ButtonLink>
        </div>
      ) : null}
    </article>
  )
}
