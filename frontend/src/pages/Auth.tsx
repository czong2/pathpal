import { Turnstile } from '@marsidev/react-turnstile'
import { env } from '@/config/env'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '../session/useSession'

function Auth() {
  const navigate = useNavigate()

  const location = useLocation()
  const { setSession } = useSession()

  const handleTurnstileSuccess = async (token: string) => {
    const response = await fetch('/api/turnstile/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
      credentials: 'include',
    })

    if (!response.ok) {
      return
    }

    const result = await response.json()
    const from = typeof location.state?.from === 'string' ? location.state.from : null
    const redirectTo = from ?? result.redirectTo ?? '/'

    setSession((currentSession) => ({
      turnstileVerified: true,
      user: currentSession?.user ?? null,
    }))

    navigate(redirectTo, { replace: true })
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f6f2] px-4 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <section className="relative w-full max-w-[360px] min-w-0 border border-zinc-200 bg-white/90 p-5 shadow-[0_18px_48px_rgba(39,39,42,0.10)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/85 dark:shadow-[0_18px_48px_rgba(0,0,0,0.30)] sm:p-6">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <img src="/favicon.svg" alt="PathPal" className="h-8 w-8 shrink-0" />
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-semibold">PathPal</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Security check</p>
          </div>
        </div>

        <div className="py-5 text-left">
          <h1 className="text-xl font-semibold leading-snug">Verify you are a human</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Complete this quick check before continuing.
          </p>
        </div>

        <div className="max-w-full overflow-x-auto border border-zinc-300 bg-white p-2.5 dark:border-zinc-700 dark:bg-zinc-950">
          <div className="min-w-[280px] max-w-full">
            <Turnstile
              siteKey={env.turnstileSiteKey}
              onSuccess={handleTurnstileSuccess}
              options={{
                size: 'flexible',
                theme: 'auto',
              }}
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Auth
