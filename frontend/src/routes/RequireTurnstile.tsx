import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '../session/SessionProvider'

export function RequireTurnstile() {
  const location = useLocation()
  const { session, status } = useSession()

  if (status === 'loading') {
    return <div>Checking...</div>
  }

  if (status === 'error' || !session?.turnstileVerified) {
    return (
      <Navigate
        to="/verify"
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  }

  return <Outlet />
}
