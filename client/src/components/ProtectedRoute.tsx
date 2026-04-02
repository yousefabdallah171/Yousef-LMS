import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { t } = useTranslation()
  const { isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="p-6 text-center text-muted">{t('common.loading')}</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
