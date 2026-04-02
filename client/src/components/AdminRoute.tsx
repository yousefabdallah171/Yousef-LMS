import { Navigate, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../context/AuthContext'

export function AdminRoute() {
  const { t } = useTranslation()
  const { isLoading, user } = useAuth()

  if (isLoading) {
    return <div className="p-6 text-center text-muted">{t('common.loading')}</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace state={{ forbidden: true }} />
  }

  return <Outlet />
}
