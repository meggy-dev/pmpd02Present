"use client"
import { Task, Header } from './components'
import { DesktopAuthButtons, MobileLoginForm } from './components/AuthForms'

export default function Page() {
  return (
    <main className="min-h-screen">

      {/* ── Desktop ── */}
      <div
        className="hidden lg:flex lg:items-center min-h-screen bg-blue-200 overflow-hidden"
        style={{
          backgroundImage: 'url(/desktopbackground.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Header title="Student Helper" />

        <div className="absolute top-8 right-8 z-10">
          <img src="/mobile logo.png" alt="Student Helper" className="h-40" />
        </div>

        <div className="flex flex-row w-dvw justify-center">
          <div className="flex flex-col pl-30">

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-black text-center leading-tight">
                Stay on top of tasks<br />
                with Student Helper
              </h1>
            </div>

            <p className="text-sm text-black mb-6 text-center">
              It&apos;s free up to 15 users - no credit card needed.
            </p>

            {/* Sign up / Log in buttons → open native dialog overlays */}
            <DesktopAuthButtons />

            <div className="flex justify-center mb-4">
              <span className="text-sm text-gray-600">or continue with</span>
            </div>

            <div className="flex gap-4">
              <button className="bg-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-gray-50">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span className="font-semibold text-sm text-black">Google</span>
              </button>
              <button className="bg-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-gray-50">
                <img src="https://www.microsoft.com/favicon.ico" alt="Microsoft" className="w-5 h-5" />
                <span className="font-semibold text-sm text-black">Microsoft</span>
              </button>
            </div>

          </div>

          <div className="w-[30vw] bg-fuchsia-300 mx-24 p-2 rounded-2xl">
            <Task name="homework" time="tomorrow" severity="high" />
            <Task name="more homework" time="next week" severity="medium" />
            <Task name="even more homework" time="tomorrow" severity="low" />
          </div>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="lg:hidden justify-center font-bold text-center grid min-h-screen py-8">
        <MobileLoginForm />
        <img src="/mobile logo.png" alt="Student Helper" className="mx-auto -my-12" />
        <img src="/logo.png" className="w-50 my-4 mx-auto rounded-md" alt="Logo" />
      </div>

    </main>
  )
}