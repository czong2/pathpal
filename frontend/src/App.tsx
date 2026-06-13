import { ListChecks, LogIn, RefreshCcw, Route } from 'lucide-react'
import { BrowserRouter, Link, Route as RouterRoute, Routes } from 'react-router-dom'
import Agent from './pages/Agent'
import Auth from './pages/Auth'
import Login from './pages/Login'
import NewProject from './pages/NewProject'
import Today from './pages/Today'
import { RequireLogin } from './routes/RequireLogin'
import { RequireTurnstile } from './routes/RequireTurnstile'
import { SessionProvider } from './session/SessionProvider'

function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f6f2] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 sm:py-6">
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/favicon.svg" alt="PathPal" className="h-8 w-8 shrink-0" />
            <span className="truncate text-sm font-semibold">PathPal</span>
          </div>

        </header>

        <section className="flex flex-1 items-center py-8 sm:py-20">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              A calmer way to plan your learning.
            </p>

            <h1 className="text-4xl font-semibold leading-tight sm:text-6xl sm:leading-[1.05]">
              Turn messy goals into a path you can actually follow.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:mt-6 sm:text-lg sm:leading-8">
              PathPal helps you organize what to learn, break it into clear steps,
              and keep track of your progress without overthinking the whole plan.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 border-t border-zinc-200 py-6 dark:border-zinc-800 sm:gap-4 sm:py-8 md:grid-cols-3">
          <div className="group min-w-0 border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-[0_14px_40px_rgba(39,39,42,0.10)] dark:border-zinc-800 dark:bg-zinc-900/55 dark:hover:border-zinc-600 dark:hover:shadow-[0_14px_40px_rgba(0,0,0,0.28)] sm:p-5">
            <div className="mb-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 transition-colors duration-500 group-hover:bg-emerald-50 dark:bg-zinc-800 dark:group-hover:bg-emerald-950 sm:mb-6">
              <Route aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
            </div>
            <h2 className="text-lg font-semibold">Plan</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Break a goal into small steps and milestones.
            </p>
          </div>

          <div className="group min-w-0 border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-[0_14px_40px_rgba(39,39,42,0.10)] dark:border-zinc-800 dark:bg-zinc-900/55 dark:hover:border-zinc-600 dark:hover:shadow-[0_14px_40px_rgba(0,0,0,0.28)] sm:p-5">
            <div className="mb-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 transition-colors duration-500 group-hover:bg-sky-50 dark:bg-zinc-800 dark:group-hover:bg-sky-950 sm:mb-6">
              <ListChecks aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
            </div>
            <h2 className="text-lg font-semibold">Track</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              See what you finished and what needs attention.
            </p>
          </div>

          <div className="group min-w-0 border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-[0_14px_40px_rgba(39,39,42,0.10)] dark:border-zinc-800 dark:bg-zinc-900/55 dark:hover:border-zinc-600 dark:hover:shadow-[0_14px_40px_rgba(0,0,0,0.28)] sm:p-5">
            <div className="mb-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 transition-colors duration-500 group-hover:bg-amber-50 dark:bg-zinc-800 dark:group-hover:bg-amber-950 sm:mb-6">
              <RefreshCcw aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
            </div>
            <h2 className="text-lg font-semibold">Reflect</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Review your progress and adjust your path over time.
            </p>
          </div>
        </section>
      </section>

      <Link
        aria-label="Log in"
        to="/login"
        className="fixed bottom-4 right-4 z-10 inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-zinc-300 bg-white/80 px-3 text-xs font-medium text-zinc-950 shadow-[0_16px_40px_rgba(39,39,42,0.16)] backdrop-blur transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/75 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900 sm:bottom-6 sm:right-6 sm:h-12 sm:gap-2 sm:px-4 sm:text-sm"
      >
        <LogIn aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
        <span>Login</span>
      </Link>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <RouterRoute path="/verify" element={<Auth />} />

          <RouterRoute element={<RequireTurnstile />}>
            <RouterRoute path="/" element={<Home />} />
            <RouterRoute path="/login" element={<Login />} />

            <RouterRoute element={<RequireLogin />}>
              <RouterRoute path="/agent" element={<NewProject />} />
              <RouterRoute path="/agent/:projectId" element={<Agent />} />
              <RouterRoute path="/today" element={<Today />} />
            </RouterRoute>
          </RouterRoute>
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  )
}

export default App
