import { ArrowLeft, ArrowRight, LockKeyhole, Mail, Route, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

function Login() {
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

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_440px] lg:py-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-3 py-1.5 text-sm text-zinc-600 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/55 dark:text-zinc-400">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              Continue your path
            </div>

            <h1 className="text-4xl font-semibold leading-tight sm:text-6xl sm:leading-[1.05]">
              Welcome back to your learning path.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:mt-6 sm:text-lg sm:leading-8">
              Log in to keep planning goals, tracking progress, and refining what comes next.
            </p>

            <div className="mt-8 border border-zinc-200 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/55">
              <Route aria-hidden="true" className="mb-4 h-5 w-5 text-emerald-700 dark:text-emerald-300" />
              <p className="text-sm font-semibold">Your route stays ready</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Pick up from your saved milestones and keep momentum without rebuilding the plan.
              </p>
            </div>
          </div>

          <div className="border border-zinc-200 bg-white/75 p-5 shadow-[0_24px_70px_rgba(39,39,42,0.12)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-[0_24px_70px_rgba(0,0,0,0.34)] sm:p-6">
            <div>
              <h2 className="text-2xl font-semibold">Log in</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Use your email to access your PathPal workspace.
              </p>
            </div>

            <form className="mt-8 space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                </span>
                <span className="mt-2 flex h-12 items-center gap-3 border border-zinc-300 bg-white px-3 transition focus-within:border-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-within:border-zinc-300">
                  <Mail aria-hidden="true" className="h-5 w-5 shrink-0 text-zinc-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </span>
                <span className="mt-2 flex h-12 items-center gap-3 border border-zinc-300 bg-white px-3 transition focus-within:border-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-within:border-zinc-300">
                  <LockKeyhole aria-hidden="true" className="h-5 w-5 shrink-0 text-zinc-400" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
                  />
                </span>
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer accent-zinc-950 dark:accent-zinc-100"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="cursor-pointer font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-zinc-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Continue
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      </section>
    </main>
  )
}

export default Login
