import { Bookmark, MessageCircle, Plus, Search } from 'lucide-react'
import { AppNav } from '../components/AppNav'

const feedPosts = [
  {
    id: '1',
    source: 'Recommended',
    author: 'Maya',
    title: 'How I split a vague goal into a two-week path',
    body: 'The trick was writing the first checkpoint as a visible behavior, not a topic.',
    saved: 18,
    replies: 4,
  },
  {
    id: '2',
    source: 'Following',
    author: 'Alex',
    title: 'My notes after finishing the first React Router milestone',
    body: 'Nested routes made more sense once I stopped treating guards like pages.',
    saved: 11,
    replies: 2,
  },
  {
    id: '3',
    source: 'Recommended',
    author: 'Nora',
    title: 'A small routine for keeping momentum',
    body: 'Every evening I rewrite the next task until it feels too clear to avoid.',
    saved: 24,
    replies: 7,
  },
]

function Posts() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f7f6f2] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <AppNav />
      <div className="animated-field absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,246,242,0.76),rgba(247,246,242,0.96))] dark:bg-[linear-gradient(180deg,rgba(9,9,11,0.76),rgba(9,9,11,0.96))]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-16 sm:px-6 sm:py-20">
        <header>
          <h1 className="text-3xl font-semibold">Posts</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Discover notes from people you follow and paths worth learning from.
          </p>

          <label className="mt-5 flex h-12 items-center gap-3 border border-zinc-300 bg-white/80 px-3 shadow-sm backdrop-blur-xl transition focus-within:border-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:focus-within:border-zinc-300">
            <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-zinc-400" />
            <input
              type="search"
              placeholder="Search posts, people, or topics"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </label>
        </header>

        <section className="mt-6 grid gap-3">
          {feedPosts.map((post) => (
            <article
              key={post.id}
              className="border border-zinc-200 bg-white/78 p-4 shadow-sm backdrop-blur-xl transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/65 dark:hover:border-zinc-600"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {post.author}
                </p>
                <span className="rounded-full border border-zinc-200 bg-white/70 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/35 dark:text-zinc-400">
                  {post.source}
                </span>
              </div>

              <h2 className="mt-3 text-lg font-semibold leading-snug">{post.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {post.body}
              </p>

              <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Bookmark aria-hidden="true" className="h-4 w-4" />
                  {post.saved}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                  {post.replies}
                </span>
              </div>
            </article>
          ))}
        </section>
      </section>

      <button
        type="button"
        aria-label="Create post"
        className="fixed bottom-4 right-4 z-30 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-zinc-300 bg-white/78 text-zinc-950 shadow-[0_18px_48px_rgba(39,39,42,0.16)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/72 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
      >
        <Plus aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
      </button>
    </main>
  )
}

export default Posts
