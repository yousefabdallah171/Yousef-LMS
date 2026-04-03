import { useTranslation } from 'react-i18next'

import type { StudentOrderStatus } from '../hooks/useOrders'
import { StatusBadge } from './ui/StatusBadge'

export function OrderStatusBadge({ status }: { status: StudentOrderStatus }) {
  const { t } = useTranslation()

  return (
    <StatusBadge
      label={
        status === 'approved'
          ? t('dashboard.approvedStatus')
          : status === 'rejected'
            ? t('dashboard.rejectedStatus')
            : t('dashboard.pendingStatus')
      }
      tone={
        status === 'approved'
          ? 'success'
          : status === 'rejected'
            ? 'danger'
            : 'warning'
      }
    />
  )
}
