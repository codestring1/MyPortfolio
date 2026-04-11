import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

/**
 * ProtectedRoute
 *
 * Wraps any route that requires authentication.
 * - Shows a full-screen cyber spinner while the session is being resolved.
 * - Redirects unauthenticated users to /login, preserving the intended URL
 *   in `location.state.from` so we can redirect them back after login.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-cyberBlack flex items-center justify-center">
        <span className="cyber-spinner" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  return children
}
