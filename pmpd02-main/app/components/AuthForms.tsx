'use client'

import { useActionState, useRef } from 'react'
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

// ── Desktop: buttons open native <dialog> overlays ───────────────────────────
export function DesktopAuthButtons() {
  const signupRef = useRef<HTMLDialogElement>(null)
  const loginRef  = useRef<HTMLDialogElement>(null)

  const [signupState, signupAction_, signupPending] = useActionState(
    async (_: unknown, fd: FormData) => signupAction(_, fd), null
  )
  const [loginState, loginAction_, loginPending] = useActionState(
    async (_: unknown, fd: FormData) => loginAction(_, fd), null
  )

  return (
    <>
      {/* Trigger buttons — identical to original */}
      <button
        onClick={() => signupRef.current?.showModal()}
        className="bg-blue-500 text-white px-12 py-3 rounded-full font-bold mb-4 hover:bg-blue-600"
      >
        Sign up
      </button>

      {/* Sign-up dialog */}
      <dialog
        ref={signupRef}
        className="rounded-4xl bg-sky-800 p-4 text-center backdrop:bg-black/50 w-full max-w-lg"
        onClick={(e) => { if (e.target === signupRef.current) signupRef.current?.close() }}
      >
        <form action={signupAction_}>
          <TextField id="Username" />
          <TextField id="Password" type="password" />
          {signupState?.error && (
            <p className="text-red-300 text-center text-2xl mb-4">{signupState.error}</p>
          )}
          <button
            className="rounded-2xl bg-sky-700 px-8 py-4 text-6xl cursor-pointer disabled:opacity-60"
            type="submit"
            disabled={signupPending}
          >
            {signupPending ? 'Signing up...' : 'Sign Up'}
          </button>
          <p className="mt-4 text-blue-200 text-2xl">
            Already have an account?{' '}
            <button
              type="button"
              className="underline"
              onClick={() => { signupRef.current?.close(); loginRef.current?.showModal() }}
            >
              Log in
            </button>
          </p>
        </form>
      </dialog>

      {/* Login dialog */}
      <dialog
        ref={loginRef}
        className="rounded-4xl bg-sky-800 p-4 text-center backdrop:bg-black/50 w-full max-w-lg"
        onClick={(e) => { if (e.target === loginRef.current) loginRef.current?.close() }}
      >
        <form action={loginAction_}>
          <TextField id="Username" />
          <TextField id="Password" type="password" />
          {loginState?.error && (
            <p className="text-red-300 text-center text-2xl mb-4">{loginState.error}</p>
          )}
          <button
            className="rounded-2xl bg-sky-700 px-8 py-4 text-6xl cursor-pointer disabled:opacity-60"
            type="submit"
            disabled={loginPending}
          >
            {loginPending ? 'Logging in...' : 'Login'}
          </button>
          <p className="mt-4 text-blue-200 text-2xl">
            No account?{' '}
            <button
              type="button"
              className="underline"
              onClick={() => { loginRef.current?.close(); signupRef.current?.showModal() }}
            >
              Sign up
            </button>
          </p>
        </form>
      </dialog>
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