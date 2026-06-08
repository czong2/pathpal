import { ArrowLeft } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import type { SessionRouteContext } from '../routes/session'

function Profile() {
  const { session } = useOutletContext<SessionRouteContext>()
  const user = session.user

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f6f2] px-4 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="animated-field absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,246,242,0.78),rgba(247,246,242,0.96))] dark:bg-[linear-gradient(180deg,rgba(9,9,11,0.78),rgba(9,9,11,0.96))]" />

      <section className="relative w-full max-w-sm border border-zinc-200 bg-white/85 p-6 text-center shadow-[0_24px_70px_rgba(39,39,42,0.12)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/75 dark:shadow-[0_24px_70px_rgba(0,0,0,0.34)]">
        <img src={user?.avatarUrl} alt="" className="mx-auto h-20 w-20 rounded-full border border-zinc-200 dark:border-zinc-700" />

        <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">Signed in as</p>
        <h1 className="mt-1 truncate text-2xl font-semibold">{user?.login}</h1>

        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white/70 px-4 text-sm font-medium transition hover:border-zinc-500 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/55 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Home
        </Link>
      </section>
    </main>
  )
}

export default Profile
