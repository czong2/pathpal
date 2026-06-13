import { createContext, useContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export type SessionUser = {
  id: number
  login: string
  avatarUrl: string
}

export type SessionData = {
  turnstileVerified: boolean
  user: SessionUser | null
}

export type SessionStatus = 'loading' | 'ready' | 'error'

export type SessionContextValue = {
  session: SessionData | null
  status: SessionStatus
  setSession: Dispatch<SetStateAction<SessionData | null>>
}

export const SessionContext = createContext<SessionContextValue | null>(null)

export function useSession() {
  const value = useContext(SessionContext)

  if (!value) {
    throw new Error('useSession must be used inside SessionProvider')
  }

  return value
}
