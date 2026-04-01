import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export function AdminRoute() {
  const { isLoading, user } = useAuth()

  if (isLoading) {
    return <div className="p-6 text-center text-muted">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace state={{ forbidden: true }} />
  }

  return <Outlet />
}
