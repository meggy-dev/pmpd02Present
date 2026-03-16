import { redirect } from 'next/navigation'
import { getSession, addTaskAction, deleteTaskAction, logoutAction, getUserTasks } from '../lib/actions'
import type { Task } from '../../lib/types'
import { TaskCreateDialog, NavDialog } from '../components/MainDialogs'

// ── Shared components ─────────────────────────────────────────────────────────

function Header({ title }: { title: string }) {
  return (
    <div className="flex justify-center items-center py-4 bg-pink-400 relative">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  )
}

function Circle({ colour }: { colour: string }) {
  const map: Record<string, string> = {
    red: 'bg-red-500', amber: 'bg-amber-500', green: 'bg-green-500',
  }
  return <span className={`inline-block w-5 h-5 rounded-full mx-0.5 align-middle ${map[colour] ?? ''}`} />
}

function Overview({ due, overdue }: { due: number; overdue: number }) {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
  return (
    <div className="flex flex-row font-bold border-indigo-300 bg-indigo-200 border-[12px] rounded-2xl w-[85vw] text-center justify-evenly [&_.entry]:p-2 [&_:not(.entry)]:p-2 my-4 text-[120%]">
      <div className="entry">
        <h1>Tasks Due</h1>
        <p>{due}</p>
      </div>
      <div className="bg-indigo-300"></div>
      <div className="entry">
        <h1>Overdue</h1>
        <p className={overdue >= 1 ? 'text-red-500' : ''}>{overdue}</p>
      </div>
      <div className="bg-indigo-300"></div>
      <div className="entry">
        <h1>Week</h1>
        <p>{week}</p>
      </div>
    </div>
  )
}

function TaskRow({ task }: { task: Task }) {
  const circleColour: Record<string, string> = { high: 'red', medium: 'amber', low: 'green' }
  return (
    <div className="flex flex-row items-center justify-between bg-indigo-100 rounded-2xl px-4 py-3 my-2 w-[85vw] text-left">
      <div className="flex items-center gap-3 flex-1">
        <Circle colour={circleColour[task.severity]} />
        <div>
          <p className="font-bold capitalize">{task.name}</p>
          <p className="text-sm text-gray-500">{task.time}</p>
        </div>
      </div>
      <form action={deleteTaskAction}>
        <input type="hidden" name="taskId" value={task.id} />
        <button type="submit" className="text-gray-400 hover:text-red-500 text-2xl font-bold leading-none px-2 cursor-pointer" title="Delete">×</button>
      </form>
    </div>
  )
}

function MobileTaskRow({ task }: { task: Task }) {
  const circleColour: Record<string, string> = { high: 'red', medium: 'amber', low: 'green' }
  let dateDisplay = task.time
  try {
    const [y, m, d] = task.time.split('-').map(Number)
    const dt = new Date(y, m - 1, d)
    const days = ['SUN','MON','TUES','WED','THUR','FRI','SAT']
    dateDisplay = `${days[dt.getDay()]} ${d}`
  } catch {}
  return (
    <div className="flex flex-row items-center justify-between bg-indigo-100 rounded-2xl px-4 py-3 my-2 mx-2 text-left">
      <div className="flex items-center gap-3 flex-1">
        <Circle colour={circleColour[task.severity]} />
        <div>
          <p className="font-bold capitalize">{task.name}</p>
          <p className="text-sm text-gray-500">🗓 {dateDisplay}</p>
        </div>
      </div>
      <form action={deleteTaskAction}>
        <input type="hidden" name="taskId" value={task.id} />
        <button type="submit" className="text-gray-400 hover:text-red-500 text-2xl font-bold leading-none px-2 cursor-pointer" title="Delete">×</button>
      </form>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/')

  const tasks = await getUserTasks()
  const today = new Date().toISOString().slice(0, 10)
  const overdue = tasks.filter(t => t.time < today).length

  return (
    <main className="text-center text-2xl bg-pink-300 text-black h-dvh w-dvw">

      {/* ── Mobile header — avatar left, title centre, menu right ── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-pink-300">
        <a href="/settings">
          <img src="/user.png" className="w-12 h-12 rounded-full hover:opacity-70" />
        </a>
        <h1 className="text-3xl font-black">Dashboard</h1>
        <NavDialog logoutAction={logoutAction} />
      </div>

      {/* ── Mobile sub-header — Task list left, Difficulty right ── */}
      <div className="lg:hidden flex items-center justify-between px-5 pb-2">
        <span className="font-black text-xl">Task list</span>
        <span className="font-bold text-base">
          Difficulty <Circle colour="green" /><Circle colour="amber" /><Circle colour="red" />
        </span>
      </div>

      {/* ── Desktop header ── */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between py-4 bg-pink-400 px-6">
          <a href="/settings">
            <img src="/user.png" className="w-12 h-12 hover:opacity-65" />
          </a>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <NavDialog logoutAction={logoutAction} />
        </div>
        <div className="my-2 w-[80vw] mx-[10vw] text-left">
          <span className="font-bold">Tasks due</span>
          <span className="font-normal float-right">
            Difficulty <Circle colour="red" /><Circle colour="amber" /><Circle colour="green" />
          </span>
        </div>
      </div>

      {/* ── Task list card ── */}
      <div className="flex flex-row w-dvw">
        <div className="rounded-4xl bg-white p-1 flex flex-col w-[90vw] mx-[5vw] h-[70vh] lg:h-[80vh] flex-1 items-center">
          <div className="overflow-x-auto overflow-y-scroll w-full flex flex-col items-center">
            <Overview due={tasks.length} overdue={overdue} />
            {tasks.length === 0 && (
              <p className="text-gray-400 text-xl py-8">No tasks yet — add one below!</p>
            )}
            {/* Desktop rows */}
            <div className="hidden lg:block">
              {tasks.map(task => <TaskRow key={task.id} task={task} />)}
            </div>
            {/* Mobile rows */}
            <div className="lg:hidden">
              {tasks.map(task => <TaskRow key={task.id} task={task} />)}
            </div>
          </div>
          <div className="hidden lg:flex flex-row justify-right h-[10vh]">
            <TaskCreateDialog addTaskAction={addTaskAction} />
          </div>
        </div>
      </div>

      {/* ── Mobile bottom bar ── */}
      <div className="absolute bottom-0 flex justify-center w-dvw my-8 font-bold lg:hidden">
        <a href="/calendar" className="rounded-3xl bg-rose-400 hover:bg-red-300 text-white py-6 mx-[1vw] px-[5vw] flex-initial">
          Calendar
        </a>
        <TaskCreateDialog addTaskAction={addTaskAction} mobile />
      </div>

    </main>
  )
}