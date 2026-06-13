import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { SessionContext } from './useSession'
import type { SessionData, SessionStatus } from './useSession'

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null)
  const [status, setStatus] = useState<SessionStatus>('loading')

  useEffect(() => {
    const controller = new AbortController()

    const loadSession = async () => {
      try {
        const response = await fetch('/api/session', {
          credentials: 'include',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Failed to load session')
        }

        const nextSession = (await response.json()) as SessionData

        setSession(nextSession)
        setStatus('ready')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setSession(null)
        setStatus('error')
      }
    }

    void loadSession()

    return () => {
      controller.abort()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      status,
      setSession,
    }),
    [session, status],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
