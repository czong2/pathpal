import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { SessionData, SessionRouteContext } from './session'

type TurnstileState =
  | { status: 'loading'; session: null }
  | { status: 'verified'; session: SessionData }
  | { status: 'unverified'; session: null }

export function RequireTurnstile() {
  const location = useLocation()
  const [state, setState] = useState<TurnstileState>({
    status: 'loading',
    session: null,
  })

  useEffect(() => {
    fetch('/api/session', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setState(
          data.turnstileVerified
            ? { status: 'verified', session: data }
            : { status: 'unverified', session: null },
        )
      })
      .catch(() => {
        setState({ status: 'unverified', session: null })
      })
  }, [])

  if (state.status === 'loading') {
    return <div>Checking...</div>
  }

  if (state.status === 'unverified') {
    return (
      <Navigate
        to="/verify"
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  }

  return <Outlet context={{ session: state.session } satisfies SessionRouteContext} />
}
