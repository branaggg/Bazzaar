import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

export function useRequireAuth() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return function requireAuth(callback) {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname + location.search } })
      return false
    }

    callback?.()
    return true
  }
}
