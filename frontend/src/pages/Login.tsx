import { useState } from 'react'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Login() {
  const [rememberLogin, setRememberLogin] = useState(false)

  const handleGithubLogin = () => {
    const params = new URLSearchParams({
      remember: String(rememberLogin),
    })

    window.location.assign(`/api/auth/github?${params.toString()}`)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f6f2] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="animated-field absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,246,242,0.72),rgba(247,246,242,0.94)_64%,rgba(247,246,242,1))] dark:bg-[linear-gradient(180deg,rgba(9,9,11,0.70),rgba(9,9,11,0.92)_64%,rgba(9,9,11,1))]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 sm:py-6">
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/favicon.svg" alt="PathPal" className="h-8 w-8 shrink-0" />
            <span className="truncate text-sm font-semibold">PathPal</span>
          </div>

          <Link
            to="/"
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-zinc-300 bg-white/60 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur transition hover:border-zinc-500 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Home
          </Link>
        </header>

        <section className="grid min-w-0 flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_440px] lg:py-16">
          <div className="min-w-0 max-w-2xl">
            <h1 className="text-4xl font-semibold leading-tight sm:text-6xl sm:leading-[1.05]">
              Back to PathPal.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:mt-6 sm:text-lg sm:leading-8">
              Continue planning and tracking your learning.
            </p>
          </div>

          <div className="min-w-0 border border-zinc-200 bg-white/75 p-5 shadow-[0_24px_70px_rgba(39,39,42,0.12)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-[0_24px_70px_rgba(0,0,0,0.34)] sm:p-6">
            <div>
              <h2 className="text-2xl font-semibold">Log in</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Continue with GitHub to access your PathPal workspace.
              </p>
            </div>

            <div className="mt-8 space-y-5">
              <button
                type="button"
                onClick={handleGithubLogin}
                className="flex min-h-12 w-full min-w-0 cursor-pointer items-center justify-center gap-2 bg-zinc-950 px-3 py-3 text-xs font-semibold leading-tight text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 sm:px-5 sm:text-sm"
              >
                <FaGithub aria-hidden="true" className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                <span className="min-w-0 text-center">Continue with GitHub</span>
              </button>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={rememberLogin}
                  onChange={(event) => setRememberLogin(event.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-zinc-950 dark:accent-zinc-100"
                />
                Remember my login
              </label>

              <div className="border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/45">
                <ShieldCheck aria-hidden="true" className="mb-3 h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  PathPal uses GitHub sign-in so you do not need another password to manage.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

export default Login
