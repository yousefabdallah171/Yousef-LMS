import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="p-6 text-center text-muted">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
