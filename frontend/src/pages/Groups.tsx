import { Plus, Search, Users } from 'lucide-react'
import { AppNav } from '../components/AppNav'

const groups = [
  {
    id: 'frontend',
    name: 'Frontend Study Circle',
    lastMessage: 'Maya shared a new routing checklist.',
    time: '2m',
    unread: 4,
  },
  {
    id: 'practice',
    name: 'Daily Practice Room',
    lastMessage: 'Today’s prompt is about building small habits.',
    time: '18m',
    unread: 2,
  },
  {
    id: 'career',
    name: 'Career Switchers',
    lastMessage: 'Alex posted notes from a portfolio review.',
    time: '1h',
    unread: 0,
  },
]

function Groups() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f7f6f2] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <AppNav />
      <div className="animated-field absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,246,242,0.76),rgba(247,246,242,0.96))] dark:bg-[linear-gradient(180deg,rgba(9,9,11,0.76),rgba(9,9,11,0.96))]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-16 sm:px-6 sm:py-20">
        <header>
          <h1 className="text-3xl font-semibold">Groups</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Keep up with the learning circles you are part of.
          </p>

          <label className="mt-5 flex h-12 items-center gap-3 border border-zinc-300 bg-white/80 px-3 shadow-sm backdrop-blur-xl transition focus-within:border-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:focus-within:border-zinc-300">
            <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-zinc-400" />
            <input
              type="search"
              placeholder="Search groups"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </label>
        </header>

        <section className="mt-6 grid gap-3">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              className="flex min-w-0 cursor-pointer items-center gap-3 border border-zinc-200 bg-white/78 p-4 text-left shadow-sm backdrop-blur-xl transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/65 dark:hover:border-zinc-600"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Users aria-hidden="true" className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold">{group.name}</h2>
                </div>
                <p className="mt-1 truncate text-sm text-zinc-600 dark:text-zinc-400">
                  {group.lastMessage}
                </p>
              </div>

              <div className="flex min-w-10 shrink-0 flex-col items-end gap-2">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {group.time}
                </span>

                {group.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-zinc-300 bg-zinc-100 px-1.5 text-[11px] font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    {group.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </section>
      </section>

      <button
        type="button"
        aria-label="Create group"
        className="fixed bottom-4 right-4 z-30 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-zinc-300 bg-white/78 text-zinc-950 shadow-[0_18px_48px_rgba(39,39,42,0.16)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/72 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
      >
        <Plus aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
      </button>
    </main>
  )
}

export default Groups
