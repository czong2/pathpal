import { useEffect, useState } from 'react'
import {
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Lightbulb,
  LogOut,
  Menu,
  Plus,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '../session/useSession'

type NavProject = {
  id: number
  title: string
  icon: string
  color: string
}

const projectIcons: Record<string, LucideIcon> = {
  book: BookOpen,
  school: GraduationCap,
  idea: Lightbulb,
  work: BriefcaseBusiness,
}

const projectColors: Record<string, string> = {
  slate: 'text-zinc-400',
  sage: 'text-emerald-300',
  blue: 'text-sky-300',
  honey: 'text-amber-200',
  pink: 'text-rose-300',
}

export function AppNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [projects, setProjects] = useState<NavProject[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const user = session?.user

  useEffect(() => {
    const controller = new AbortController()

    const loadProjects = async () => {
      setIsLoadingProjects(true)

      try {
        const response = await fetch('/api/projects', {
          credentials: 'include',
          signal: controller.signal,
        })

        if (response.status === 401) {
          setProjects([])
          return
        }

        if (!response.ok) {
          throw new Error('Failed to load projects')
        }

        setProjects((await response.json()) as NavProject[])
      } catch (exception) {
        if (exception instanceof DOMException && exception.name === 'AbortError') {
          return
        }

        setProjects([])
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingProjects(false)
        }
      }
    }

    const handleProjectsChanged = () => {
      void loadProjects()
    }

    void loadProjects()
    window.addEventListener('pathpal:projects-changed', handleProjectsChanged)

    return () => {
      controller.abort()
      window.removeEventListener('pathpal:projects-changed', handleProjectsChanged)
    }
  }, [])

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
        className="fixed left-3 top-3 z-40 flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-white/70 text-zinc-950 shadow-[0_8px_22px_rgba(39,39,42,0.10)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-zinc-400 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-900 sm:left-5 sm:top-5 sm:h-11 sm:w-11"
      >
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <Menu aria-hidden="true" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
        )}
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
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(76vw,240px)] flex-col overflow-hidden border-r border-zinc-200 bg-white/88 px-3 py-4 shadow-[24px_0_80px_rgba(39,39,42,0.18)] backdrop-blur-2xl transition-transform duration-200 ease-out dark:border-zinc-800 dark:bg-zinc-950/88 dark:shadow-[24px_0_80px_rgba(0,0,0,0.42)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link
          to="/agent"
          onClick={() => setIsOpen(false)}
          className={`flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
            location.pathname === '/agent'
              ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50'
              : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'
          }`}
        >
          <Plus aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={2.2} />
          <span className="truncate">New Project</span>
        </Link>

        <nav className="mt-5 flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Projects
          </div>

          <div className="scrollbar-none mt-2 min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-1">
              {projects.map((project) => {
                const ProjectIcon = projectIcons[project.icon] ?? BookOpen
                const projectIconClassName = projectColors[project.color] ?? projectColors.slate

                return (
                  <Link
                    key={project.id}
                    to={`/agent/${project.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`flex min-h-12 items-center gap-3 rounded-md px-3 text-left transition ${
                      location.pathname === `/agent/${project.id}`
                        ? 'bg-zinc-100 dark:bg-zinc-900'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-950/45">
                      <ProjectIcon aria-hidden="true" className={`h-4 w-4 ${projectIconClassName}`} strokeWidth={2.2} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                        {project.title}
                      </span>
                    </span>
                  </Link>
                )
              })}
              {!isLoadingProjects && projects.length === 0 ? (
                <div className="px-3 py-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  No projects yet.
                </div>
              ) : null}
            </div>
          </div>
        </nav>

        <div className="mt-3 shrink-0 border-t border-zinc-200 pt-3 dark:border-zinc-800">
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
