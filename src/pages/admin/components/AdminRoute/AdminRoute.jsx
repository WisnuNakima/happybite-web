import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/authContext'

export default function AdminRoute() {
  const { isLoggedIn, user } = useAuth()
  if (!isLoggedIn || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }
  return <Outlet />
}
