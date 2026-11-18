import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const defaultRoute = user?.role === 'owner' ? '/owner/dashboard' : '/dashboard'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={defaultRoute} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
