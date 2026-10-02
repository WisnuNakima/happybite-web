import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/authContext'
import AuthStatus from '@/components/AuthStatus'

export default function AdminRoute() {
  const { isLoggedIn, user, loading, authError } = useAuth()
  if (loading || authError) return <AuthStatus />
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}
