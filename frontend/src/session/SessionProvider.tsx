import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { ReactNode } from 'react'

export type SessionUser = {
  id: number
  login: string
  avatarUrl: string
}

export type SessionData = {
  turnstileVerified: boolean
  user: SessionUser | null
}

type SessionStatus = 'loading' | 'ready' | 'error'

type SessionContextValue = {
  session: SessionData | null
  status: SessionStatus
  refreshSession: () => Promise<void>
  setSession: Dispatch<SetStateAction<SessionData | null>>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null)
  const [status, setStatus] = useState<SessionStatus>('loading')

  const refreshSession = async () => {
    setStatus('loading')

    try {
      const response = await fetch('/api/session', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to load session')
      }

      setSession(await response.json())
      setStatus('ready')
    } catch {
      setSession(null)
      setStatus('error')
    }
  }

  useEffect(() => {
    void refreshSession()
  }, [])

  const value = useMemo(
    () => ({
      session,
      status,
      refreshSession,
      setSession,
    }),
    [session, status],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const value = useContext(SessionContext)

  if (!value) {
    throw new Error('useSession must be used inside SessionProvider')
  }

  return value
}
