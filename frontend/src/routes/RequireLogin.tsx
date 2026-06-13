import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '../session/useSession'

export function RequireLogin() {
  const location = useLocation()
  const { session } = useSession()

  if (!session?.user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  }

  return <Outlet />
}
