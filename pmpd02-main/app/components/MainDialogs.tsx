'use client'

import { useRef, useState } from 'react'

// ── Task Create Dialog ────────────────────────────────────────────────────────
// Matches original TaskCreatePopup exactly

export function TaskCreateDialog({
  addTaskAction,
  mobile = false,
}: {
  addTaskAction: (formData: FormData) => Promise<void>
  mobile?: boolean
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [priority, setPriority] = useState<'red' | 'amber' | 'green'>('green')

  const trigger = mobile ? (
    <button
      onClick={() => dialogRef.current?.showModal()}
      className="rounded-3xl bg-rose-400 hover:bg-red-300 text-white py-6 mx-[1vw] px-[20vw] flex-initial"
    >
      Add Task
    </button>
  ) : (
    <button
      onClick={() => dialogRef.current?.showModal()}
      className="bg-indigo-300 hover:bg-indigo-200 my-2 px-16 rounded-full font-bold cursor-pointer"
    >
      Add task
    </button>
  )

  return (
    <>
      {trigger}

      <dialog
        ref={dialogRef}
        className="rounded-2xl p-0 border-0 shadow-2xl backdrop:bg-black/50 w-full max-w-md"
        onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current?.close() }}
      >
        {/* Matches original TaskCreatePopup form exactly */}
        <form
          action={async (fd) => {
            fd.set('priority', priority)
            await addTaskAction(fd)
            dialogRef.current?.close()
          }}
          className="bg-white rounded-2xl text-black flex flex-col items-center text-3xl text-center animate-popup"
        >
          <label className="m-4 bg-indigo-200 rounded-2xl p-4 w-[80%]">Add Task</label>

          <div className="flex flex-col bg-indigo-200 m-4 p-4 rounded-2xl font-bold *:py-2 **:rounded-full">
            <label>Name</label>
            <input
              type="text"
              name="taskName"
              placeholder="Task name"
              className="border-none bg-indigo-300 text-center"
              required
            />

            <label>Priority</label>
            <ul className="table-row *:inline *:p-2">
              {(['red', 'amber', 'green'] as const).map((c) => {
                const dark:   Record<string, string> = { red: 'bg-red-700',   amber: 'bg-amber-700',   green: 'bg-green-700'   }
                const light:  Record<string, string> = { red: 'bg-red-500',   amber: 'bg-amber-500',   green: 'bg-green-500'   }
                const border: Record<string, string> = { red: 'border-red-500', amber: 'border-amber-500', green: 'border-green-500' }
                return (
                  <li key={c}>
                    <label
                      onClick={() => setPriority(c)}
                      className={`${priority === c ? light[c] : dark[c]} text-[90%] px-4 rounded-full border-4 ${border[c]} cursor-pointer inline-block`}
                    >
                      &nbsp;
                    </label>
                  </li>
                )
              })}
            </ul>

            <label>Date</label>
            <div className="table-row">
              <input type="text" name="year"  placeholder="Year"  className="border-none bg-indigo-300 mx-2 text-center" required />
              <input type="text" name="month" placeholder="Month" className="border-none bg-indigo-300 mx-2 text-center" required />
              <input type="text" name="day"   placeholder="Day"   className="border-none bg-indigo-300 mx-2 text-center" required />
            </div>
          </div>

          <button
            type="submit"
            className="w-max cursor-pointer bg-indigo-200 m-4 rounded-full py-2 px-8 hover:bg-indigo-300"
          >
            Confirm
          </button>
        </form>
      </dialog>
    </>
  )
}

// ── Nav Dialog ────────────────────────────────────────────────────────────────
// Matches original NavPopup exactly

export function NavDialog({
  logoutAction,
}: {
  logoutAction: () => Promise<void>
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button onClick={() => dialogRef.current?.showModal()}>
        <img src="/menu.png" className="w-20 hover:opacity-65 lg:bg-white lg:rounded-b-full cursor-pointer" />
      </button>

      <dialog
        ref={dialogRef}
        className="border-0 p-0 rounded-2xl shadow-2xl backdrop:bg-transparent"
        style={{ position: 'fixed', top: '4.5rem', right: '1.25rem', left: 'auto', margin: 0 }}
        onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current?.close() }}
      >
        {/* Matches original NavPopup exactly */}
        <div className="bg-fuchsia-300 text-black rounded-2xl flex flex-col text-center *:py-4 px-2 text-4xl *:bg-fuchsia-100 *:hover:bg-fuchsia-200 *:my-1 *:px-16 *:rounded-2xl animate-popup">
          <a href="/calendar" onClick={() => dialogRef.current?.close()}>Calendar</a>
          <a href="/settings" onClick={() => dialogRef.current?.close()}>Settings</a>
          <form action={logoutAction} className="p-0 m-0">
            <button type="submit" className="w-full py-4 px-16 my-1 bg-fuchsia-100 hover:bg-fuchsia-200 rounded-2xl text-red-400">
              Log out
            </button>
          </form>
        </div>
      </dialog>
    </>
  )
}