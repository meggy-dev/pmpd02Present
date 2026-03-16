'use client'

import { useActionState, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { loginAction, signupAction } from '../lib/actions'

function TextField({ id, type = 'text' }: { id: string; type?: string }) {
  return (
    <div className="mb-6">
      <label className="block mb-2 font-bold text-6xl text-center pb-2">{id}</label>
      <input
        type={type}
        id={id}
        name={id}
        className="rounded-3xl block w-full bg-blue-200 text-gray-600 text-center px-4 py-3 text-3xl"
        required
      />
    </div>
  )
}

function Modal({ open, onClose, children }: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!open || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div className="w-[90vw] max-w-lg" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  )
}

// ── Desktop: Sign up button → centred modal overlay ───────────────────────────
export function DesktopAuthButtons() {
  const [modal, setModal] = useState<'signup' | 'login' | null>(null)

  const [signupState, signupAction_, signupPending] = useActionState(
    async (_: unknown, fd: FormData) => signupAction(_, fd), null
  )
  const [loginState, loginAction_, loginPending] = useActionState(
    async (_: unknown, fd: FormData) => loginAction(_, fd), null
  )

  return (
    <>
      <button
        onClick={() => setModal('signup')}
        className="bg-blue-500 text-white px-12 py-3 rounded-full font-bold mb-4 hover:bg-blue-600"
      >
        Sign up
      </button>

      {/* Sign-up modal */}
      <Modal open={modal === 'signup'} onClose={() => setModal(null)}>
        <div className="bg-sky-800 rounded-3xl p-6 text-center">
          <form action={signupAction_}>
            <TextField id="Username" />
            <TextField id="Password" type="password" />
            {signupState?.error && (
              <p className="text-red-300 text-center text-2xl mb-4">{signupState.error}</p>
            )}
            <button
              className="rounded-2xl bg-sky-700 px-8 py-4 text-6xl cursor-pointer disabled:opacity-60 text-white"
              type="submit"
              disabled={signupPending}
            >
              {signupPending ? 'Signing up...' : 'Sign Up'}
            </button>
            <p className="mt-4 text-blue-200 text-2xl">
              Already have an account?{' '}
              <button type="button" className="underline" onClick={() => setModal('login')}>
                Log in
              </button>
            </p>
          </form>
        </div>
      </Modal>

      {/* Login modal */}
      <Modal open={modal === 'login'} onClose={() => setModal(null)}>
        <div className="bg-sky-800 rounded-3xl p-6 text-center">
          <form action={loginAction_}>
            <TextField id="Username" />
            <TextField id="Password" type="password" />
            {loginState?.error && (
              <p className="text-red-300 text-center text-2xl mb-4">{loginState.error}</p>
            )}
            <button
              className="rounded-2xl bg-sky-700 px-8 py-4 text-6xl cursor-pointer disabled:opacity-60 text-white"
              type="submit"
              disabled={loginPending}
            >
              {loginPending ? 'Logging in...' : 'Login'}
            </button>
            <p className="mt-4 text-blue-200 text-2xl">
              No account?{' '}
              <button type="button" className="underline" onClick={() => setModal('signup')}>
                Sign up
              </button>
            </p>
          </form>
        </div>
      </Modal>
    </>
  )
}

// ── Mobile: form rendered directly on page ────────────────────────────────────
export function MobileLoginForm() {
  const [state, formAction, pending] = useActionState(
    async (_: unknown, fd: FormData) => loginAction(_, fd), null
  )

  return (
    <form action={formAction}>
      <TextField id="Username" />
      <TextField id="Password" type="password" />
      {state?.error && (
        <p className="text-red-400 text-center text-2xl mb-4">{state.error}</p>
      )}
      <button
        className="rounded-2xl bg-sky-700 px-8 py-4 text-6xl cursor-pointer disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        {pending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}