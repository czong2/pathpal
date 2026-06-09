import { useState } from 'react'
import { Bot, Plus, Send } from 'lucide-react'
import { AppNav } from '../components/AppNav'

const agents = [
  {
    id: 'react-router',
    name: 'React Router Plan',
    preview: 'Next: turn route guards into reusable layouts.',
    status: '68%',
    messages: [
      { id: '1', from: 'Agent', text: 'Your next milestone is cleaning up protected routes.' },
      { id: '2', from: 'You', text: 'Make it smaller and more practical.' },
    ],
  },
  {
    id: 'path-system',
    name: 'Path Planning System',
    preview: 'Next: define how milestones become weekly tasks.',
    status: '42%',
    messages: [
      { id: '1', from: 'Agent', text: 'You have two unclear milestones in this plan.' },
      { id: '2', from: 'You', text: 'Help me rewrite the first one.' },
    ],
  },
  {
    id: 'writing',
    name: 'Writing Habit',
    preview: 'Next: publish one short reflection this week.',
    status: '15%',
    messages: [
      { id: '1', from: 'Agent', text: 'Start with a 150-word note about what changed.' },
      { id: '2', from: 'You', text: 'Keep it tied to my learning progress.' },
    ],
  },
]

function Agent() {
  const [activeAgentId, setActiveAgentId] = useState<string | null>(agents[0].id)

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f7f6f2] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <AppNav />
      <div className="animated-field absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,246,242,0.76),rgba(247,246,242,0.96))] dark:bg-[linear-gradient(180deg,rgba(9,9,11,0.76),rgba(9,9,11,0.96))]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-16 sm:px-6 sm:py-20">
        <header>
          <h1 className="text-3xl font-semibold">AI Coach</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Pick a path and keep working through it.
          </p>
        </header>

        <section className="mt-6 grid gap-3">
          {agents.map((agent) => {
            const isActive = activeAgentId === agent.id

            return (
              <article
                key={agent.id}
                className={`overflow-hidden border border-zinc-200 bg-white/78 shadow-sm backdrop-blur-xl transition-all duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-900/65 ${
                  isActive ? 'border-zinc-400 dark:border-zinc-600' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveAgentId(isActive ? null : agent.id)}
                  className="flex min-h-16 w-full cursor-pointer items-center gap-3 px-4 text-left transition hover:bg-white/65 dark:hover:bg-zinc-900/65"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <Bot aria-hidden="true" className="h-5 w-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{agent.name}</span>
                    <span className="mt-0.5 block truncate text-sm text-zinc-500 dark:text-zinc-400">
                      {agent.preview}
                    </span>
                  </span>

                  <span className="shrink-0 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    {agent.status}
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800">
                      <div className="flex flex-col gap-3">
                        {agent.messages.map((message) => {
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
                          placeholder="Ask about this plan..."
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

      <button
        type="button"
        aria-label="Create agent"
        className="fixed bottom-4 right-4 z-30 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-zinc-300 bg-white/78 text-zinc-950 shadow-[0_18px_48px_rgba(39,39,42,0.16)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/72 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
      >
        <Plus aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
      </button>
    </main>
  )
}

export default Agent
