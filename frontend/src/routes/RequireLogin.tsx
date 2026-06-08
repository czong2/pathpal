import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom'
import type { SessionRouteContext } from './session'

export function RequireLogin() {
  const location = useLocation()
  const { session } = useOutletContext<SessionRouteContext>()

  if (!session.user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  }

  return <Outlet context={{ session } satisfies SessionRouteContext} />
}
