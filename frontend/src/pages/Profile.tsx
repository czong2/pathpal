import { useState } from 'react'
import {
  Bookmark,
  Flame,
  ListChecks,
  MessageCircle,
  Newspaper,
  Route,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppNav } from '../components/AppNav'
import { useSession } from '../session/SessionProvider'

const aiSummary = 'AI summary will highlight your current focus, strengths, and recent learning rhythm.'

const stats = [
  { label: 'Ongoing', value: '3' },
  { label: 'Completed', value: '12' },
  { label: 'Streak', value: '8d' },
]

const progressItems = [
  {
    title: 'React Router auth flow',
    detail: 'Route guards, session state, and protected pages.',
    progress: '68%',
    to: '/agent',
  },
  {
    title: 'Path planning system',
    detail: 'Turning goals into milestones and weekly tasks.',
    progress: '42%',
    to: '/agent',
  },
]

const activities = [
  {
    icon: Users,
    title: '2 groups have new messages',
    detail: 'Frontend Study Circle and Daily Practice Room',
    to: '/groups',
  },
  {
    icon: MessageCircle,
    title: '5 unread direct messages',
    detail: 'Latest from Maya and Study group',
    to: '/dm',
  },
  {
    icon: Newspaper,
    title: '3 comments mentioned you',
    detail: 'Open the newest replies on your posts',
    to: '/posts',
  },
]

const myPosts = [
  { title: 'How I organize a two-week learning sprint', to: '/posts' },
  { title: 'Notes from building the first PathPal auth flow', to: '/posts' },
]

const savedPosts = [
  { title: 'A practical guide to deliberate practice', to: '/posts' },
  { title: 'Good prompts for breaking down projects', to: '/posts' },
]

type ProfileTab = 'progress' | 'activities' | 'posts'
type PostsTab = 'my-posts' | 'saved'

function Profile() {
  const { session } = useSession()
  const user = session?.user
  const [activeTab, setActiveTab] = useState<ProfileTab>('progress')
  const [activePostsTab, setActivePostsTab] = useState<PostsTab>('my-posts')

  if (!user) {
    return null
  }

  const visiblePosts = activePostsTab === 'my-posts' ? myPosts : savedPosts

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f7f6f2] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <AppNav />
      <div className="animated-field absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,246,242,0.76),rgba(247,246,242,0.96))] dark:bg-[linear-gradient(180deg,rgba(9,9,11,0.76),rgba(9,9,11,0.96))]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-16 sm:px-6 sm:py-20">
        <section className="border border-zinc-200 bg-white/82 p-5 shadow-[0_18px_52px_rgba(39,39,42,0.10)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/72 dark:shadow-[0_18px_52px_rgba(0,0,0,0.30)] sm:p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row">
              <img
                src={user.avatarUrl}
                alt=""
                className="h-16 w-16 shrink-0 rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 sm:h-20 sm:w-20"
              />
              <div className="min-w-0">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Profile</p>
                <h1 className="mt-1 break-words pb-0.5 text-2xl font-semibold leading-tight sm:text-3xl">
                  {user.login}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {aiSummary}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:min-w-[300px]">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-0 border border-zinc-200 bg-white/70 px-2 py-3 text-center dark:border-zinc-800 dark:bg-zinc-950/35 sm:px-3"
                >
                  <p className="text-lg font-semibold sm:text-xl">{stat.value}</p>
                  <p className="mt-1 truncate text-[11px] text-zinc-500 dark:text-zinc-400 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 border border-zinc-200 bg-white/72 p-4 shadow-[0_18px_52px_rgba(39,39,42,0.08)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-[0_18px_52px_rgba(0,0,0,0.24)] sm:p-5">
          <div className="border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <div className="flex flex-wrap justify-center gap-1">
              {[
                { id: 'progress', label: 'Progress', icon: ListChecks },
                { id: 'activities', label: 'Activities', icon: Flame },
                { id: 'posts', label: 'Posts', icon: Newspaper },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as ProfileTab)}
                    className={`flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-zinc-200/80 text-zinc-950 dark:bg-zinc-800/90 dark:text-zinc-50'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {activeTab === 'progress' && (
            <div className="mt-5 grid gap-3">
              {progressItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="min-w-0 border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/35"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-semibold">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        {item.detail}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                      {item.progress}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="mt-5 grid gap-3">
              {activities.map((activity) => {
                const Icon = activity.icon

                return (
                  <Link
                    key={activity.title}
                    to={activity.to}
                    className="flex min-w-0 items-center gap-3 border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/35"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold">{activity.title}</h2>
                      <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">
                        {activity.detail}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="mt-5">
              <div className="flex justify-center">
                <div className="flex flex-wrap justify-center gap-1 rounded-md border border-zinc-200 bg-white/70 p-1 dark:border-zinc-800 dark:bg-zinc-950/35">
                {[
                  { id: 'my-posts', label: 'My Posts', icon: Route },
                  { id: 'saved', label: 'Saved', icon: Bookmark },
                ].map((tab) => {
                  const Icon = tab.icon
                  const isActive = activePostsTab === tab.id

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActivePostsTab(tab.id as PostsTab)}
                      className={`flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded px-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-zinc-200/80 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50'
                          : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50'
                      }`}
                    >
                      <Icon aria-hidden="true" className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {visiblePosts.map((post) => (
                  <Link
                    key={post.title}
                    to={post.to}
                    className="flex min-w-0 items-center gap-3 border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/35"
                  >
                    <Newspaper aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-500" />
                    <h2 className="min-w-0 truncate font-semibold">{post.title}</h2>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default Profile
