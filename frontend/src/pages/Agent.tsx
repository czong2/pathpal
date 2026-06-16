import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, SyntheticEvent } from 'react'
import { BookOpen, BriefcaseBusiness, FileText, GraduationCap, Lightbulb, Send, UploadCloud } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Markdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import { AppNav } from '../components/AppNav'

type ProjectFile = {
  id: number | string
  name: string
  meta: string
}

type ChatMessage = {
  id: string
  from: 'Agent' | 'You'
  text: string
  citations?: AgentCitation[]
}

type ProjectResponse = {
  id: number
  title: string
  icon: string
  color: string
  files: Array<{
    id: number
    name: string
    sizeBytes: number
  }>
}

type AgentCitation = {
  fileId: number
  fileName: string
  page: number
  text: string
}

type ChatResponse = {
  userMessage: PersistedChatMessage
  agentMessage: PersistedChatMessage
}

type PersistedChatMessage = {
  id: number
  from: 'Agent' | 'You'
  text: string
  citations: AgentCitation[]
}

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    from: 'Agent',
    text: 'Upload PDFs for this project, then ask me questions about them.',
  },
]

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

function Agent() {
  const { projectId } = useParams()
  const [projectName, setProjectName] = useState('Project Plan')
  const [projectIconId, setProjectIconId] = useState('book')
  const [projectColorId, setProjectColorId] = useState('slate')
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const [isLoadingProject, setIsLoadingProject] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isUploadingFiles, setIsUploadingFiles] = useState(false)
  const [isFilesOpen, setIsFilesOpen] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const fileCount = useMemo(() => files.length, [files])
  const ProjectIcon = projectIcons[projectIconId] ?? BookOpen
  const projectIconClassName = projectColors[projectColorId] ?? projectColors.slate

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, errorMessage])

  useEffect(() => {
    if (!projectId) {
      return
    }

    const controller = new AbortController()

    const loadAgentState = async () => {
      setIsLoadingProject(true)
      setErrorMessage(null)

      try {
        const [projectResponse, messagesResponse] = await Promise.all([
          fetch(`/api/projects/${projectId}/agent`, {
            credentials: 'include',
            signal: controller.signal,
          }),
          fetch(`/api/projects/${projectId}/agent/messages`, {
            credentials: 'include',
            signal: controller.signal,
          }),
        ])

        if (!projectResponse.ok || !messagesResponse.ok) {
          throw new Error('Failed to load project')
        }

        const project = (await projectResponse.json()) as ProjectResponse
        const persistedMessages = (await messagesResponse.json()) as PersistedChatMessage[]

        setProjectName(project.title)
        setProjectIconId(project.icon)
        setProjectColorId(project.color)
        setFiles(
          project.files.map((file) => ({
            id: file.id,
            name: file.name,
            meta: formatBytes(file.sizeBytes),
          })),
        )
        setMessages(persistedMessages.length > 0 ? persistedMessages.map(toChatMessage) : initialMessages)
      } catch (exception) {
        if (exception instanceof DOMException && exception.name === 'AbortError') {
          return
        }

        setErrorMessage('Could not load this project.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingProject(false)
        }
      }
    }

    void loadAgentState()

    return () => {
      controller.abort()
    }
  }, [projectId])

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])

    if (selectedFiles.length === 0 || !projectId || isUploadingFiles) {
      return
    }

    const formData = new FormData()
    selectedFiles.forEach((file) => {
      formData.append('files', file, file.name)
    })

    setIsUploadingFiles(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/projects/${projectId}/agent/files`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload files')
      }

      const updatedFiles = (await response.json()) as ProjectResponse['files']

      setFiles(
        updatedFiles.map((file) => ({
          id: file.id,
          name: file.name,
          meta: formatBytes(file.sizeBytes),
        })),
      )
    } catch {
      setErrorMessage('Could not upload these PDFs.')
    } finally {
      setIsUploadingFiles(false)
    }

    event.target.value = ''
  }

  const sendMessage = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    const message = draft.trim()

    if (!message || isSending || !projectId) {
      return
    }

    setDraft('')
    setErrorMessage(null)
    setIsSending(true)
    const optimisticUserMessage: ChatMessage = { id: crypto.randomUUID(), from: 'You', text: message }
    setMessages((current) => [...current, optimisticUserMessage])

    try {
      const response = await fetch(`/api/projects/${projectId}/agent/chat`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error('Agent request failed')
      }

      const agentResponse = (await response.json()) as ChatResponse

      setMessages((current) => [
        ...current.filter((chatMessage) => chatMessage.id !== optimisticUserMessage.id),
        toChatMessage(agentResponse.userMessage),
        toChatMessage(agentResponse.agentMessage),
      ])
      window.dispatchEvent(new Event('pathpal:projects-changed'))
    } catch {
      setErrorMessage('The local agent could not answer. Make sure the Python agent service and Ollama are running.')
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          from: 'Agent',
          text: 'I could not reach the local RAG service yet.',
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="relative h-screen overflow-hidden bg-[#f7f6f2] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <AppNav />
      <section className="relative flex h-full min-h-0 w-full gap-0 px-3 pb-3 pt-14 sm:px-4 sm:pb-4 sm:pt-16">
        <section className="flex min-w-0 flex-1 flex-col border border-zinc-200 bg-white/78 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/65">
          <div className="flex min-h-16 items-center border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <ProjectIcon aria-hidden="true" className={`h-5 w-5 ${projectIconClassName}`} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold sm:text-xl">{projectName}</h1>
                {isLoadingProject ? (
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Loading project...</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="scrollbar-none mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-6">
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
                  <Markdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
                      ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
                      li: ({ children }) => <li className="pl-1">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    }}
                  >
                    {message.text}
                  </Markdown>
                  {message.citations && message.citations.length > 0 ? (
                    <div className="mt-3 border-t border-zinc-200/70 pt-2 text-xs leading-5 opacity-75 dark:border-zinc-700/70">
                      {message.citations.slice(0, 3).map((citation) => (
                        <div key={`${citation.fileId}-${citation.page}-${citation.text.slice(0, 12)}`}>
                          {citation.fileName}, page {citation.page}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
            {errorMessage ? (
              <div className="mr-auto max-w-[84%] bg-red-50 px-4 py-2.5 text-sm leading-6 text-red-700 dark:bg-red-950/35 dark:text-red-300">
                {errorMessage}
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <form className="mx-auto flex w-full max-w-4xl gap-2 border-t border-zinc-200 p-4 dark:border-zinc-800 sm:px-6" onSubmit={sendMessage}>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask a question about your PDFs..."
              disabled={isSending}
              className="h-11 min-w-0 flex-1 border border-zinc-300 bg-white/80 px-4 text-sm outline-none transition focus:border-zinc-700 dark:border-zinc-700 dark:bg-zinc-950/55 dark:focus:border-zinc-300"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={isSending}
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border border-zinc-300 bg-white/75 text-zinc-950 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
            >
              <Send aria-hidden="true" className="h-4 w-4" />
            </button>
          </form>
        </section>

        <aside
          className={`ml-3 flex min-h-0 shrink-0 flex-col overflow-hidden border border-zinc-200 bg-white/78 shadow-sm backdrop-blur-xl transition-[width] duration-300 dark:border-zinc-800 dark:bg-zinc-900/65 ${
            isFilesOpen ? 'w-[320px]' : 'w-12'
          }`}
        >
          {isFilesOpen ? (
            <>
              <button
                type="button"
                aria-label="Hide files"
                onClick={() => setIsFilesOpen(false)}
                className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 text-left transition hover:bg-white dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <span className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold">
                  <FileText aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                  <span>Files</span>
                </span>
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">{fileCount}</span>
              </button>

              <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto p-4">
                <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center border border-dashed border-zinc-300 bg-white/60 px-4 text-center transition hover:border-zinc-500 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/30 dark:hover:border-zinc-500 dark:hover:bg-zinc-950/45">
                  <UploadCloud aria-hidden="true" className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                  <span className="mt-3 text-sm font-semibold">{isUploadingFiles ? 'Uploading...' : 'Upload PDF'}</span>
                  <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Drop source files here</span>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    multiple
                    disabled={isUploadingFiles}
                    className="sr-only"
                    onChange={handleFiles}
                  />
                </label>

                <div className="mt-4 grid gap-2">
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
              </div>
            </>
          ) : (
            <button
              type="button"
              aria-label="Show files"
              onClick={() => setIsFilesOpen(true)}
              className="flex h-full w-12 cursor-pointer flex-col items-center justify-start gap-3 px-2 py-4 text-zinc-600 transition hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <FileText aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="text-xs font-semibold [writing-mode:vertical-rl]">Files</span>
              <span className="flex h-5 min-w-5 items-center justify-center border border-zinc-300 px-1 text-[11px] font-semibold dark:border-zinc-700">
                {fileCount}
              </span>
            </button>
          )}
        </aside>
      </section>
    </main>
  )
}

function toChatMessage(message: PersistedChatMessage): ChatMessage {
  return {
    id: String(message.id),
    from: message.from,
    text: message.text,
    citations: message.citations,
  }
}

function formatBytes(sizeBytes: number) {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`
  }

  const sizeKb = sizeBytes / 1024

  if (sizeKb < 1024) {
    return `${Math.max(1, Math.round(sizeKb))} KB`
  }

  return `${(sizeKb / 1024).toFixed(1)} MB`
}

export default Agent
