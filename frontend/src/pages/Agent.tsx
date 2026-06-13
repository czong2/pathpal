import { useMemo, useState } from 'react'
import type { ChangeEvent, SyntheticEvent } from 'react'
import { FileText, Paperclip, Send, UploadCloud } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { AppNav } from '../components/AppNav'

type ProjectFile = {
  id: string
  name: string
  meta: string
}

type ChatMessage = {
  id: string
  from: 'Agent' | 'You'
  text: string
}

const projectNames: Record<string, string> = {
  'ap-biology': 'AP Biology Review',
  'react-basics': 'React Basics Plan',
  'writing-portfolio': 'Writing Portfolio',
}

const initialFiles: ProjectFile[] = [
  { id: 'unit-guide', name: 'unit-guide.pdf', meta: 'Uploaded today' },
  { id: 'rubric', name: 'rubric.pdf', meta: 'Ready for planning' },
]

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    from: 'Agent',
    text: 'Upload the PDF you want to study from. I will turn it into a focused plan with milestones and daily tasks.',
  },
]

function Agent() {
  const { projectId } = useParams()
  const projectName = useMemo(() => (projectId ? projectNames[projectId] ?? 'Project Plan' : 'Project Plan'), [projectId])
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])

    if (selectedFiles.length === 0) {
      return
    }

    setFiles((current) => [
      ...current,
      ...selectedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        meta: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      })),
    ])

    event.target.value = ''
  }

  const sendMessage = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    const message = draft.trim()

    if (!message) {
      return
    }

    setDraft('')
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), from: 'You', text: message },
      {
        id: crypto.randomUUID(),
        from: 'Agent',
        text: 'Got it. Once the PDF is processed, I will use it to adjust the plan instead of giving generic advice.',
      },
    ])
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f7f6f2] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <AppNav />
      <section className="relative mx-auto grid min-h-screen w-full max-w-6xl gap-4 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(280px,360px)_1fr]">
        <aside className="flex min-h-[520px] flex-col border border-zinc-200 bg-white/78 p-4 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/65">
          <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              Project
            </p>
            <h1 className="mt-2 truncate text-xl font-semibold">{projectName}</h1>
          </div>

          <label className="mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center border border-dashed border-zinc-300 bg-white/60 px-4 text-center transition hover:border-zinc-500 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/30 dark:hover:border-zinc-500 dark:hover:bg-zinc-950/45">
            <UploadCloud aria-hidden="true" className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            <span className="mt-3 text-sm font-semibold">Upload PDF</span>
            <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Drop source files here</span>
            <input type="file" accept="application/pdf,.pdf" multiple className="sr-only" onChange={handleFiles} />
          </label>

          <section className="mt-5 min-h-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">Files</h2>
              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">{files.length}</span>
            </div>

            <div className="mt-3 grid gap-2">
              {files.length > 0 ? (
                files.map((file) => (
                  <article
                    key={file.id}
                    className="flex min-h-12 min-w-0 items-center gap-3 border border-zinc-200 bg-white/70 px-3 dark:border-zinc-800 dark:bg-zinc-950/35"
                  >
                    <FileText aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{file.name}</span>
                      <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">{file.meta}</span>
                    </span>
                  </article>
                ))
              ) : (
                <div className="border border-zinc-200 bg-white/55 px-3 py-4 text-sm leading-6 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-400">
                  No files yet.
                </div>
              )}
            </div>
          </section>
        </aside>

        <section className="flex min-h-[520px] flex-col border border-zinc-200 bg-white/78 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/65">
          <div className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
            <h2 className="text-sm font-semibold">Agent Chat</h2>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => {
              const isOwn = message.from === 'You'

              return (
                <div
                  key={message.id}
                  className={`max-w-[84%] px-4 py-2.5 text-sm leading-6 ${
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

          <form className="flex gap-2 border-t border-zinc-200 p-4 dark:border-zinc-800" onSubmit={sendMessage}>
            <button
              type="button"
              aria-label="Attach file"
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border border-zinc-300 bg-white/75 text-zinc-950 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
            >
              <Paperclip aria-hidden="true" className="h-4 w-4" />
            </button>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask the agent to shape this into a plan..."
              className="h-11 min-w-0 flex-1 border border-zinc-300 bg-white/80 px-4 text-sm outline-none transition focus:border-zinc-700 dark:border-zinc-700 dark:bg-zinc-950/55 dark:focus:border-zinc-300"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border border-zinc-300 bg-white/75 text-zinc-950 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
            >
              <Send aria-hidden="true" className="h-4 w-4" />
            </button>
          </form>
        </section>
      </section>
    </main>
  )
}

export default Agent
