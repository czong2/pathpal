import { useState } from 'react'
import { MessageCircle, Search, Send } from 'lucide-react'
import { AppNav } from '../components/AppNav'

const threads = [
  {
    id: 'maya',
    name: 'Maya',
    avatar: '',
    preview: 'Can you share your path outline?',
    messages: [
      { id: '1', from: 'Maya', text: 'Can you share your path outline?' },
      { id: '2', from: 'You', text: 'Yes, I am cleaning it up now.' },
    ],
  },
  {
    id: 'study-group',
    name: 'Study group',
    avatar: '',
    preview: 'Today check-in starts in 10 minutes.',
    messages: [
      { id: '1', from: 'Study group', text: 'Today check-in starts in 10 minutes.' },
      { id: '2', from: 'You', text: 'I will join after finishing this task.' },
    ],
  },
  {
    id: 'agent',
    name: 'PathPal Agent',
    avatar: '',
    preview: 'I drafted a new milestone for your plan.',
    messages: [
      { id: '1', from: 'PathPal Agent', text: 'I drafted a new milestone for your plan.' },
      { id: '2', from: 'You', text: 'Show me the shortest version first.' },
    ],
  },
]

function Messages() {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f7f6f2] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <AppNav />
      <div className="animated-field absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,246,242,0.76),rgba(247,246,242,0.96))] dark:bg-[linear-gradient(180deg,rgba(9,9,11,0.76),rgba(9,9,11,0.96))]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-16 sm:px-6 sm:py-20">
        <header>
          <h1 className="text-3xl font-semibold">Messages</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Keep in touch with people learning alongside you.
          </p>

          <label className="mt-5 flex h-12 items-center gap-3 border border-zinc-300 bg-white/80 px-3 shadow-sm backdrop-blur-xl transition focus-within:border-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:focus-within:border-zinc-300">
            <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-zinc-400" />
            <input
              type="search"
              placeholder="Search people"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </label>
        </header>

        <section className="mt-6 grid gap-3">
          {threads.map((thread) => {
            const isActive = activeThreadId === thread.id

            return (
              <article
                key={thread.id}
                className={`overflow-hidden border border-zinc-200 bg-white/78 shadow-sm backdrop-blur-xl transition-all duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-900/65 ${
                  isActive ? 'border-zinc-400 dark:border-zinc-600' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveThreadId(isActive ? null : thread.id)}
                  className="flex min-h-16 w-full cursor-pointer items-center gap-3 px-4 text-left transition hover:bg-white/65 dark:hover:bg-zinc-900/65"
                >
                  {thread.avatar ? (
                    <img src={thread.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full" />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold dark:bg-zinc-800">
                      {thread.name.slice(0, 1)}
                    </span>
                  )}

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{thread.name}</span>
                    <span className="mt-0.5 block truncate text-sm text-zinc-500 dark:text-zinc-400">
                      {thread.preview}
                    </span>
                  </span>

                  <MessageCircle
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-300 ${
                      isActive ? 'scale-110 text-zinc-700 dark:text-zinc-200' : ''
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800">
                      <div className="flex flex-col gap-3">
                        {thread.messages.map((message) => {
                          const isOwn = message.from === 'You'

                          return (
                            <div
                              key={message.id}
                              className={`max-w-[84%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                                isOwn
                                  ? 'ml-auto bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                                  : 'mr-auto bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100'
                              }`}
                            >
                              {message.text}
                            </div>
                          )
                        })}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <input
                          placeholder="Write a message..."
                          className="h-11 min-w-0 flex-1 rounded-full border border-zinc-300 bg-white/80 px-4 text-sm outline-none transition focus:border-zinc-700 dark:border-zinc-700 dark:bg-zinc-950/55 dark:focus:border-zinc-300"
                        />
                        <button
                          type="button"
                          aria-label="Send message"
                          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-zinc-300 bg-white/75 text-zinc-950 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
                        >
                          <Send aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </section>
    </main>
  )
}

export default Messages
