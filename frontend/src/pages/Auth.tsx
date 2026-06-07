import { Turnstile } from '@marsidev/react-turnstile'
import { env } from '@/config/env'

function Auth() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f6f2] px-4 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="animated-field absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,246,242,0.86),rgba(247,246,242,0.98))] dark:bg-[linear-gradient(180deg,rgba(9,9,11,0.86),rgba(9,9,11,0.98))]" />

      <section className="relative w-full max-w-[360px] border border-zinc-200 bg-white/90 p-5 shadow-[0_18px_48px_rgba(39,39,42,0.10)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/85 dark:shadow-[0_18px_48px_rgba(0,0,0,0.30)] sm:p-6">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <img src="/favicon.svg" alt="PathPal" className="h-8 w-8 shrink-0" />
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-semibold">PathPal</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Security check</p>
          </div>
        </div>

        <div className="py-5 text-left">
          <h1 className="text-xl font-semibold">Verify you are a human</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Complete this quick check before continuing.
          </p>
        </div>

        <div className="overflow-hidden border border-zinc-300 bg-white p-2.5 dark:border-zinc-700 dark:bg-zinc-950">
          <Turnstile
            siteKey={env.turnstileSiteKey}
            options={{
              size: 'flexible',
              theme: 'auto',
            }}
          />
        </div>
      </section>
    </main>
  )
}

export default Auth
