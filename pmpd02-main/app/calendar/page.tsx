'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Task } from '../../lib/types'

// ── Constants ─────────────────────────────────────────────────────────────────

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
const monthLengths = [31,29,31,30,31,30,31,31,30,31,30,31]

// ── Helpers ───────────────────────────────────────────────────────────────────

function padded(n: number) { return n.toString().padStart(2, '0') }

function severityColour(s: Task['severity']) {
  return s === 'high' ? 'bg-red-500' : s === 'medium' ? 'bg-amber-500' : 'bg-green-500'
}

function buildTaskMap(tasks: Task[]): Record<string, Task[]> {
  const map: Record<string, Task[]> = {}
  for (const task of tasks) {
    if (!map[task.time]) map[task.time] = []
    map[task.time].push(task)
  }
  return map
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Header({ title }: { title: string }) {
  return (
    <div className="flex justify-center items-center py-4 bg-pink-400">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  )
}

function DateHeader({ date }: { date: Date }) {
  return (
    <section className="lg:absolute lg:bottom-0 w-dvw">
      <span className="bg-fuchsia-300 block rounded-b-[400%] lg:rounded-b-[0%] lg:rounded-t-[400%] py-20 w-dvw lg:absolute lg:bottom-0 lg:w-[30vw] lg:ml-[35vw]"></span>
      <div className="text-[400%] font-bold flex flex-row absolute top-5 lg:relative lg:pb-10 justify-center w-dvw">
        <span>{date.getDate().toString()}</span>
        <span className="px-1 mx-10 bg-black"></span>
        <div className="flex flex-col text-[40%] items-center justify-center">
          <span>{monthNames[date.getMonth()]}</span>
          <span>{date.getFullYear().toString()}</span>
        </div>
      </div>
    </section>
  )
}

function CalendarRow({ dayIndex, date, taskMap }: {
  dayIndex: number
  date: Date
  taskMap: Record<string, Task[]>
}) {
  const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  const offset = dayIndex - startDay
  return (
    <tr>
      {Array.from(Array(7).keys()).map((index) => {
        const dayNum = offset + index + 1
        const inMonth = dayNum >= 1 && dayNum <= monthLengths[date.getMonth()]
        const isSelected = dayNum === date.getDate()
        const dateKey = inMonth ? `${date.getFullYear()}-${padded(date.getMonth()+1)}-${padded(dayNum)}` : null
        const dayTasks = dateKey ? (taskMap[dateKey] ?? []) : []
        return (
          <td key={index} className="relative">
            <a
              className={isSelected ? 'bg-indigo-400 rounded-full px-4 py-2 cursor-pointer' : ''}
              href={inMonth ? `/calendar?date=${date.getFullYear()}-${date.getMonth()+1}-${dayNum}` : ''}
            >
              {inMonth ? dayNum.toString() : ''}
            </a>
            {inMonth && dayTasks.length > 0 && (
              <div className="flex justify-center gap-0.5 mt-0.5">
                {dayTasks.slice(0, 3).map((t) => (
                  <span key={t.id} className={`w-2 h-2 rounded-full ${severityColour(t.severity)}`} />
                ))}
                {dayTasks.length > 3 && (
                  <span className="text-[8px] text-gray-500 leading-none">+{dayTasks.length - 3}</span>
                )}
              </div>
            )}
          </td>
        )
      })}
    </tr>
  )
}

function Calendar({ date, taskMap }: { date: Date; taskMap: Record<string, Task[]> }) {
  const prevYear  = date.getMonth() === 0  ? date.getFullYear() - 1 : date.getFullYear()
  const prevMonth = date.getMonth() === 0  ? 12 : date.getMonth()
  const nextYear  = date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear()
  const nextMonth = date.getMonth() === 11 ? 1  : date.getMonth() + 2
  return (
    <div className="lg:pr-24">
      <div className="text-center font-bold text-5xl flex flex-row justify-evenly items-center py-8">
        <a href={`/calendar?date=${prevYear}-${prevMonth}-1`} className="bg-fuchsia-300 hover:bg-fuchsia-200 cursor-pointer text-fuchsia-500 text-6xl py-1 px-4 rounded-full">&#60;</a>
        <span className="text-indigo-500">📆 My Calendar</span>
        <a href={`/calendar?date=${nextYear}-${nextMonth}-1`} className="bg-fuchsia-300 hover:bg-fuchsia-200 cursor-pointer text-fuchsia-500 text-6xl py-1 px-4 rounded-full">&#62;</a>
      </div>
      <table className="bg-white text-gray-600 w-[80vw] lg:w-[50vw] text-center font-extrabold">
        <tbody className="**:w-[10%] **:h-[5vh] lg:**:h-[8vh] lg:text-4xl">
          <tr className="text-indigo-500">
            <td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td>
          </tr>
          {Array.from(Array(6).keys()).map((index) => (
            <CalendarRow key={index} dayIndex={index * 7} date={date} taskMap={taskMap} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TaskItem({ task }: { task: Task }) {
  const colour: Record<string, string> = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-green-500' }
  return (
    <div className="flex items-center gap-3 bg-indigo-300 rounded-2xl mx-3 my-2 px-4 py-3">
      <span className={`w-4 h-4 rounded-full flex-shrink-0 ${colour[task.severity]}`} />
      <div className="text-left">
        <p className="font-bold capitalize text-xl">{task.name}</p>
        <p className="text-sm text-indigo-900">{task.time}</p>
      </div>
    </div>
  )
}

function Tasklist({ date, taskMap }: { date: Date; taskMap: Record<string, Task[]> }) {
  const monthdate = date.getDate()
  let datesuffix = 'th'
  if (monthdate === 1 || monthdate === 21 || monthdate === 31) datesuffix = 'st'
  else if (monthdate === 2 || monthdate === 22) datesuffix = 'nd'
  else if (monthdate === 3 || monthdate === 23) datesuffix = 'rd'
  const dateKey = `${date.getFullYear()}-${padded(date.getMonth()+1)}-${padded(monthdate)}`
  const dayTasks = taskMap[dateKey] ?? []
  return (
    <div className="w-[90vw] lg:w-[30%] mx-5 my-5 h-[32vh] lg:h-[90%] rounded-3xl bg-indigo-400 overflow-y-scroll overflow-x-hidden lg:mt-10">
      <p className="text-center font-bold text-3xl py-8">
        Due for {`${dayNames[date.getDay()]}, ${monthdate}${datesuffix} ${monthNames[date.getMonth()]}`}
      </p>
      {dayTasks.length === 0
        ? <p className="text-center text-indigo-200 text-xl pb-8">No tasks due</p>
        : dayTasks.map((task) => <TaskItem key={task.id} task={task} />)
      }
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  const dateParam = useSearchParams().get('date')
  const [tasks, setTasks] = useState<Task[]>([])

  // Parse date safely without timezone shift
  let date = new Date()
  if (dateParam) {
    const [y, m, d] = dateParam.split('-').map(Number)
    date = new Date(y, m - 1, d)
  }

  // Fetch tasks from API route (avoids server-only fs module in client bundle)
  useEffect(() => {
    fetch('/api/tasks', { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(setTasks)
      .catch(() => setTasks([]))
  }, [])

  const taskMap = buildTaskMap(tasks)

  return (
    <main className="text-black text-2xl bg-indigo-200 h-dvh">
      <section className="hidden lg:flex">
        <Header title="Calendar" />
      </section>
      <DateHeader date={date} />
      <a href="/main" className="text-5xl absolute top-8 right-12 hover:opacity-50 cursor-pointer rounded-full bg-white px-2 py-2 lg:-my-4 lg:rounded-t-[0%]">&#60;</a>
      <div className="flex flex-col lg:flex-row justify-center items-center lg:h-[70vh]">
        <Calendar date={date} taskMap={taskMap} />
        <Tasklist date={date} taskMap={taskMap} />
      </div>
    </main>
  )
}