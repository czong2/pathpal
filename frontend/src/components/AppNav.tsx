import { useState } from 'react'
import {
  Bot,
  LogOut,
  Menu,
  MessageCircle,
  Newspaper,
  User,
  Users,
  X,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'Profile', to: '/profile', icon: User },
  { label: 'Posts', to: '/posts', icon: Newspaper },
  { label: 'Groups', to: '/groups', icon: Users },
  { label: 'Messages', to: '/dm', icon: MessageCircle },
  { label: 'AI Coach', to: '/agent', icon: Bot },
]

export function AppNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', {
      credentials: 'include',
    })

    setIsOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="fixed left-3 top-3 z-40 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white/65 text-zinc-950 shadow-[0_8px_22px_rgba(39,39,42,0.10)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-zinc-400 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-900 sm:left-5 sm:top-5 sm:h-10 sm:w-10"
      >
        <Menu aria-hidden="true" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-zinc-950/20 backdrop-blur-[2px] dark:bg-zinc-950/45"
        />
      )}

      <aside
        aria-hidden={!isOpen}
        className={`scrollbar-none fixed inset-y-0 left-0 z-50 flex w-[min(76vw,240px)] flex-col overflow-y-auto border-r border-zinc-200 bg-white/88 px-3 py-4 shadow-[24px_0_80px_rgba(39,39,42,0.18)] backdrop-blur-2xl transition-transform duration-200 ease-out dark:border-zinc-800 dark:bg-zinc-950/88 dark:shadow-[24px_0_80px_rgba(0,0,0,0.42)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/favicon.svg" alt="PathPal" className="h-8 w-8 shrink-0" />
            <span className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              PathPal
            </span>
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white/70 text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
          >
            <X aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                  location.pathname === item.to
                    ? 'bg-zinc-200/80 text-zinc-950 dark:bg-zinc-800/90 dark:text-zinc-50'
                    : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-zinc-200 pt-3 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-md px-3 text-left text-sm font-medium text-red-600/85 transition hover:bg-red-50 hover:text-red-700 dark:text-red-300/85 dark:hover:bg-red-950/35 dark:hover:text-red-200"
          >
            <LogOut aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span className="truncate">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
