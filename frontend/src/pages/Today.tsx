import type { ReactNode } from 'react'
import { CheckCircle2, Circle, FileText } from 'lucide-react'
import { AppNav } from '../components/AppNav'

const todoItems = [
  {
    id: 'skim-pdf',
    title: 'Upload and scan the source PDF',
    detail: 'Extract core topics, deadlines, and grading expectations.',
    project: 'New study plan',
  },
  {
    id: 'outline-plan',
    title: 'Review the first agent outline',
    detail: 'Check whether the plan matches your time and current level.',
    project: 'New study plan',
  },
  {
    id: 'choose-week',
    title: 'Pick this week\'s focus',
    detail: 'Choose the smallest useful unit to start with.',
    project: 'AP Biology Review',
  },
]

const doneItems = [
  {
    id: 'connect-agent',
    title: 'Connect local agent service',
    detail: 'Spring backend now calls the Python agent service.',
    project: 'PathPal setup',
  },
  {
    id: 'local-qwen',
    title: 'Use local Qwen through Ollama',
    detail: 'The agent can run without paid API tokens.',
    project: 'PathPal setup',
  },
]

function Today() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f7f6f2] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <AppNav />
      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-16 sm:px-6 sm:py-20">
        <section className="grid gap-4 lg:grid-cols-2">
          <TaskColumn title="To Do" count={todoItems.length} tone="todo">
            {todoItems.map((item) => (
              <TaskItem key={item.id} item={item} done={false} />
            ))}
          </TaskColumn>

          <TaskColumn title="Done" count={doneItems.length} tone="done">
            {doneItems.map((item) => (
              <TaskItem key={item.id} item={item} done />
            ))}
          </TaskColumn>
        </section>
      </section>
    </main>
  )
}

type TaskColumnProps = {
  title: string
  count: number
  tone: 'todo' | 'done'
  children: ReactNode
}

function TaskColumn({ title, count, tone, children }: TaskColumnProps) {
  return (
    <section className="min-w-0 border border-zinc-200 bg-white/78 p-4 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/65">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span
          className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold ${
            tone === 'done'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/55 dark:text-emerald-300'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
          }`}
        >
          {count}
        </span>
      </div>

      <div className="mt-3 grid gap-3">{children}</div>
    </section>
  )
}

type TaskItemData = {
  id: string
  title: string
  detail: string
  project: string
}

function TaskItem({ item, done }: { item: TaskItemData; done: boolean }) {
  const StatusIcon = done ? CheckCircle2 : Circle

  return (
    <article className="min-w-0 border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/35">
      <div className="flex items-start gap-3">
        <StatusIcon
          aria-hidden="true"
          className={`mt-0.5 h-5 w-5 shrink-0 ${
            done ? 'text-emerald-600 dark:text-emerald-300' : 'text-zinc-400'
          }`}
          strokeWidth={2}
        />
        <div className="min-w-0">
          <h3 className="font-semibold leading-6">{item.title}</h3>
          <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.detail}</p>
          <p className="mt-3 flex min-w-0 items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <FileText aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{item.project}</span>
          </p>
        </div>
      </div>
    </article>
  )
}

export default Today
