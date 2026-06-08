export type SessionUser = {
  id: number
  login: string
  avatarUrl: string
}

export type SessionData = {
  turnstileVerified: boolean
  user: SessionUser | null
}

export type SessionRouteContext = {
  session: SessionData
}
