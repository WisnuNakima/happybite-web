import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/authContext'
import AuthStatus from './AuthStatus'

export default function ProtectedRoute() {
  const { isLoggedIn, loading, authError } = useAuth()
  if (loading || authError) return <AuthStatus />
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <Outlet />
}
