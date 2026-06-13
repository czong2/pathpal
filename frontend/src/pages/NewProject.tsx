import { useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  Lightbulb,
  Palette,
  Plus,
  X,
  UploadCloud,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AppNav } from '../components/AppNav'

type ProjectIcon = {
  id: string
  label: string
  icon: LucideIcon
}

type ProjectColor = {
  id: string
  label: string
  textClassName: string
  dotClassName: string
}

type PendingFile = {
  id: string
  name: string
  type: 'pdf'
}

const projectIcons: ProjectIcon[] = [
  { id: 'book', label: 'Book', icon: BookOpen },
  { id: 'school', label: 'School', icon: GraduationCap },
  { id: 'idea', label: 'Idea', icon: Lightbulb },
  { id: 'work', label: 'Work', icon: BriefcaseBusiness },
]

const projectColors: ProjectColor[] = [
  { id: 'slate', label: 'Slate', textClassName: 'text-zinc-400', dotClassName: 'bg-zinc-400' },
  { id: 'sage', label: 'Sage', textClassName: 'text-emerald-300', dotClassName: 'bg-emerald-300' },
  { id: 'blue', label: 'Blue', textClassName: 'text-sky-300', dotClassName: 'bg-sky-300' },
  { id: 'honey', label: 'Honey', textClassName: 'text-amber-200', dotClassName: 'bg-amber-200' },
  { id: 'pink', label: 'Pink', textClassName: 'text-rose-300', dotClassName: 'bg-rose-300' },
]

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function NewProject() {
  const [selectedIconId, setSelectedIconId] = useState(projectIcons[0].id)
  const [selectedColorId, setSelectedColorId] = useState(projectColors[0].id)
  const [projectName, setProjectName] = useState('')
  const [files, setFiles] = useState<PendingFile[]>([])
  const [hasDeadline, setHasDeadline] = useState(false)
  const [deadline, setDeadline] = useState('')
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [hasDescription, setHasDescription] = useState(false)
  const [description, setDescription] = useState('')

  const selectedIcon = projectIcons.find((icon) => icon.id === selectedIconId) ?? projectIcons[0]
  const selectedColor = projectColors.find((color) => color.id === selectedColorId) ?? projectColors[0]
  const PreviewIcon = selectedIcon.icon

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])
      .filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))

    if (selectedFiles.length === 0) {
      return
    }

    setFiles((current) => [
      ...current,
      ...selectedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: 'pdf' as const,
      })),
    ])

    event.target.value = ''
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f7f6f2] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <AppNav />
      <section className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-16 sm:px-6 sm:py-20">
        <form className="border border-zinc-200 bg-white/78 p-4 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/65 sm:p-5">
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <PreviewIcon aria-hidden="true" className={`h-6 w-6 ${selectedColor.textClassName}`} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                New Project
              </p>
              <h1 className="truncate text-xl font-semibold">{projectName || 'Book Review'}</h1>
            </div>
          </div>

          <section className="mt-5">
            <h2 className="text-sm font-semibold">Icon</h2>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {projectIcons.map((projectIcon) => {
                const Icon = projectIcon.icon
                const isSelected = selectedIconId === projectIcon.id

                return (
                  <button
                    key={projectIcon.id}
                    type="button"
                    aria-label={projectIcon.label}
                    onClick={() => setSelectedIconId(projectIcon.id)}
                    className={`flex h-11 cursor-pointer items-center justify-center border transition ${
                      isSelected
                        ? 'border-zinc-500 bg-zinc-100 dark:border-zinc-500 dark:bg-zinc-800'
                        : 'border-zinc-200 bg-white/60 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/25 dark:hover:border-zinc-600'
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                  </button>
                )
              })}
            </div>
          </section>

          <section className="mt-5">
            <h2 className="text-sm font-semibold">Color</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {projectColors.map((projectColor) => {
                const isSelected = selectedColorId === projectColor.id

                return (
                  <button
                    key={projectColor.id}
                    type="button"
                    aria-label={projectColor.label}
                    onClick={() => setSelectedColorId(projectColor.id)}
                    className={`flex h-9 w-9 cursor-pointer items-center justify-center border transition ${
                      isSelected
                        ? 'border-zinc-600 dark:border-zinc-300'
                        : 'border-zinc-200 bg-white/65 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/35 dark:hover:border-zinc-600'
                    }`}
                  >
                    <span className={`h-5 w-5 rounded-full ${projectColor.dotClassName}`} />
                  </button>
                )
              })}
            </div>
          </section>

          <label className="mt-5 block">
            <span className="text-sm font-semibold">Title</span>
            <input
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="Book Review"
              className="mt-3 h-11 w-full border border-zinc-300 bg-white/80 px-3 text-sm outline-none transition focus:border-zinc-700 dark:border-zinc-700 dark:bg-zinc-950/55 dark:focus:border-zinc-300"
            />
          </label>

          <section className="mt-5">
            <h2 className="text-sm font-semibold">Files</h2>
            <label className="mt-3 flex min-h-28 cursor-pointer flex-col items-center justify-center border border-dashed border-zinc-300 bg-white/60 px-4 text-center transition hover:border-zinc-500 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/30 dark:hover:border-zinc-500 dark:hover:bg-zinc-950/45">
              <UploadCloud aria-hidden="true" className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
              <span className="mt-3 text-sm font-semibold">Upload PDF</span>
              <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                PDF Files Only
              </span>
              <input type="file" accept="application/pdf,.pdf" multiple className="sr-only" onChange={handleFiles} />
            </label>

            <div className="mt-3 grid gap-2">
              {files.map((file) => (
                <article
                  key={file.id}
                  className="flex min-h-12 min-w-0 items-center gap-3 border border-zinc-200 bg-white/70 px-3 dark:border-zinc-800 dark:bg-zinc-950/35"
                >
                  <FileText aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{file.name}</span>
                    <span className="block text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {file.type}
                    </span>
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <CalendarDays aria-hidden="true" className="h-4 w-4" />
                Deadline
              </span>
              <OptionalButton
                active={hasDeadline}
                onChange={() => {
                  setHasDeadline((current) => {
                    const next = !current

                    if (next) {
                      const visibleDate = deadline ? new Date(`${deadline}T00:00:00`) : new Date()
                      setCalendarMonth(new Date(visibleDate.getFullYear(), visibleDate.getMonth(), 1))
                    }

                    return next
                  })
                }}
              />
            </div>
            {hasDeadline ? (
              <CalendarPicker
                month={calendarMonth}
                selectedDate={deadline}
                onMonthChange={setCalendarMonth}
                onSelect={setDeadline}
              />
            ) : null}
          </section>

          <section className="mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Palette aria-hidden="true" className="h-4 w-4" />
                Description
              </span>
              <OptionalButton
                active={hasDescription}
                onChange={() => {
                  setHasDescription((current) => !current)
                }}
              />
            </div>
            {hasDescription ? (
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What should the agent pay attention to?"
                rows={4}
                className="mt-3 w-full resize-none border border-zinc-300 bg-white/80 px-3 py-3 text-sm leading-6 outline-none transition focus:border-zinc-700 dark:border-zinc-700 dark:bg-zinc-950/55 dark:focus:border-zinc-300"
              />
            ) : null}
          </section>

          <button
            type="button"
            disabled={!projectName.trim()}
            className="mt-6 min-h-11 w-full cursor-pointer bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Create Project
          </button>
        </form>
      </section>
    </main>
  )
}

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function CalendarPicker({
  month,
  selectedDate,
  onMonthChange,
  onSelect,
}: {
  month: Date
  selectedDate: string
  onMonthChange: (month: Date) => void
  onSelect: (date: string) => void
}) {
  const [yearInput, setYearInput] = useState(String(month.getFullYear()))
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const leadingBlanks = firstDay.getDay()
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)
  const changeMonth = (offset: number) => {
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + offset, 1)

    setYearInput(String(nextMonth.getFullYear()))
    onMonthChange(nextMonth)
  }

  const changeYear = (value: string) => {
    setYearInput(value)

    const year = Number(value)

    if (Number.isInteger(year) && year >= 1900 && year <= 9999) {
      onMonthChange(new Date(year, month.getMonth(), 1))
    }
  }

  return (
    <div className="mt-3 border border-zinc-200 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/35">
      <div className="grid grid-cols-[32px_minmax(0,1fr)_32px] items-center gap-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => changeMonth(-1)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center border border-zinc-200 bg-white/70 transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/35 dark:hover:border-zinc-600"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>

        <div className="mx-auto grid w-fit grid-cols-[132px_92px] gap-2">
          <select
            aria-label="Month"
            value={month.getMonth()}
            onChange={(event) =>
              onMonthChange(new Date(month.getFullYear(), Number(event.target.value), 1))
            }
            className="h-9 min-w-0 border border-zinc-200 bg-white/85 px-2 text-sm font-medium outline-none transition focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/45 dark:focus:border-zinc-500"
          >
            {monthNames.map((monthName, index) => (
              <option key={monthName} value={index}>
                {monthName}
              </option>
            ))}
          </select>

          <input
            type="number"
            aria-label="Year"
            value={yearInput}
            min={1900}
            max={9999}
            onChange={(event) => changeYear(event.target.value)}
            onBlur={() => {
              const year = Number(yearInput)

              if (!Number.isInteger(year) || year < 1900 || year > 9999) {
                setYearInput(String(month.getFullYear()))
              }
            }}
            className="h-9 min-w-0 border border-zinc-200 bg-white/85 px-2 text-sm font-medium outline-none transition focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/45 dark:focus:border-zinc-500"
          />
        </div>

        <button
          type="button"
          aria-label="Next month"
          onClick={() => changeMonth(1)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center border border-zinc-200 bg-white/70 transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/35 dark:hover:border-zinc-600"
        >
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1">
        {weekdays.map((weekday, index) => (
          <div key={`${weekday}-${index}`} className="flex h-7 items-center justify-center text-xs font-semibold text-zinc-400">
            {weekday}
          </div>
        ))}

        {Array.from({ length: leadingBlanks }, (_, index) => (
          <div key={`blank-${index}`} className="h-8" />
        ))}

        {days.map((day) => {
          const date = new Date(month.getFullYear(), month.getMonth(), day)
          const value = formatDate(date)
          const isSelected = selectedDate === value

          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              className={`flex h-8 cursor-pointer items-center justify-center text-sm font-medium transition ${
                isSelected
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                  : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function OptionalButton({
  active,
  onChange,
}: {
  active: boolean
  onChange: () => void
}) {
  const Icon = active ? X : Plus

  return (
    <button
      type="button"
      onClick={onChange}
      className={`inline-flex h-7 cursor-pointer items-center gap-1.5 border px-2 text-xs font-semibold transition ${
        active
          ? 'border-zinc-400 bg-zinc-100 text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-500'
          : 'border-zinc-200 bg-white/60 text-zinc-500 hover:border-zinc-400 hover:text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200'
      }`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.2} />
      {active ? 'Remove' : 'Add'}
    </button>
  )
}

export default NewProject
