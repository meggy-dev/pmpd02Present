'use client'

import { useState, useEffect } from 'react'
import type { UserSettings } from '../../lib/types'

// ── Default settings ──────────────────────────────────────────────────────────

const DEFAULTS: Omit<UserSettings, 'userId'> = {
  preferredName:     '',
  email:             '',
  rightToLeft:       false,
  language:          'English',
  britishSummerTime: false,
  theme:             'Light',
  notifications:     false,
  emailReminders:    false,
  marketingEmails:   false,
}

// ── Original sub-components ───────────────────────────────────────────────────

function Header({ title }: { title: string }) {
  return (
    <div className="flex justify-center items-center py-4 bg-pink-400">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  )
}

function Toggle({ name, value, onChange }: { name: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="text-left my-4">
      <span>{name}</span>
      <div className="float-right inline cursor-pointer" onClick={() => onChange(!value)}>
        <span className={`relative inline-flex rounded-full p-1 h-8 w-16 ${value ? 'bg-indigo-300 hover:bg-indigo-400' : 'bg-gray-400 hover:bg-gray-500'}`}>
          <span className={`h-6 w-6 rounded-full bg-white inline-block transition-transform ${value ? 'translate-x-8' : 'translate-x-0'}`}></span>
        </span>
      </div>
    </div>
  )
}

function Multichoice({ name, choices, value, onChange }: {
  name: string
  choices: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="text-left my-4">
      <span>{name}</span>
      <ul className="float-right max-w-[40vw] inline overflow-x-scroll pb-2">
        {choices.map((choice, index) => (
          <li key={index} className="inline pl-4">
            <input type="radio" className="peer hidden" readOnly checked={value === choice} value={choice} />
            <label
              onClick={() => onChange(choice)}
              className="cursor-pointer p-5 bg-indigo-100 peer-checked:bg-indigo-300 hover:bg-indigo-200 hover:peer-checked:bg-indigo-400 px-8 py-0 rounded-full"
            >
              {choice}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Details({ name, field, value, onChange }: {
  name: string
  field: string
  value: string
  onChange: (field: string, v: string) => void
}) {
  return (
    <div>
      <p className="text-left">{name}:</p>
      <input
        type="text"
        value={value}
        placeholder={name}
        onChange={(e) => onChange(field, e.target.value)}
        className="text-center bg-indigo-300 border-none text-2xl rounded-2xl w-[80%] outline-none"
      />
    </div>
  )
}

function Dropdown({ name, children }: { name: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-fuchsia-300 w-[95%] rounded-3xl my-2">
      <div className="text-4xl text-left py-2 px-6 cursor-pointer hover:text-gray-500" onClick={() => setOpen(!open)}>
        <span>{name}</span>
        <span className="float-right">{open ? 'v' : '<'}</span>
      </div>
      <div className={`px-16 py-2 ${open ? 'visible block' : 'invisible hidden'}`}>{children}</div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  const [settings, setSettings] = useState<Omit<UserSettings, 'userId'>>(DEFAULTS)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [loading, setLoading] = useState(true)

  // Load settings on mount
  useEffect(() => {
    fetch('/api/settings', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          const { userId: _userId, ...rest } = data
          setSettings(rest)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function set<K extends keyof typeof settings>(key: K, value: typeof settings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setStatus('saving')
    try {
      const fd = new FormData()
      Object.entries(settings).forEach(([k, v]) => fd.set(k, String(v)))
      const res = await fetch('/api/settings', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      })
      setStatus(res.ok ? 'saved' : 'error')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  if (loading) {
    return (
      <main className="font-bold text-2xl text-center lg:bg-indigo-200 h-dvh flex items-center justify-center">
        <p className="text-indigo-400">Loading settings...</p>
      </main>
    )
  }

  return (
    <main className="font-bold text-2xl text-center lg:bg-indigo-200 h-dvh justify-center">
      <Header title="Settings" />
      <div className="flex flex-col lg:flex-row lg:bg-white mx-16 rounded-4xl">

        {/* Scrollable settings panel */}
        <div className="rounded-4xl bg-white p-1 flex flex-col w-[90%] mx-[5%] lg:mx-0 h-[75vh] lg:h-[85vh] items-center overflow-scroll text-black">

          {/* Profile section */}
          <div className="rounded-4xl bg-indigo-300 w-[95%] my-8">
            <img src="/user.png" className="float-left p-4 w-[30%] min-w-[200px]" />
            <div className="h-[25vh] flex flex-col justify-center p-8">
              <Details
                name="Preferred name"
                field="preferredName"
                value={settings.preferredName}
                onChange={(f, v) => set(f as keyof typeof settings, v)}
              />
              <Details
                name="Email"
                field="email"
                value={settings.email}
                onChange={(f, v) => set(f as keyof typeof settings, v)}
              />
            </div>
            <button
              onClick={handleSave}
              className="rounded-3xl bg-indigo-200 py-2 px-25 m-2 cursor-pointer hover:bg-indigo-100"
            >
              {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : status === 'error' ? 'Error ✗' : 'Save'}
            </button>
          </div>

          
          <Dropdown name="Language">
            <section>
              <Toggle
                name="Right to left"
                value={settings.rightToLeft}
                onChange={(v) => set('rightToLeft', v)}
              />
              <Multichoice
                name="Override language"
                choices={['English', 'Spanish', 'Polish']}
                value={settings.language}
                onChange={(v) => set('language', v)}
              />
            </section>
          </Dropdown>

          {/* Time zone */}
          <Dropdown name="Time zone">
            <section>
              <Toggle
                name="British summer time"
                value={settings.britishSummerTime}
                onChange={(v) => set('britishSummerTime', v)}
              />
            </section>
          </Dropdown>

          {/* Appearance */}
          <Dropdown name="Appearance">
            <section>
              <Multichoice
                name="Theme"
                choices={['Light', 'Dark']}
                value={settings.theme}
                onChange={(v) => set('theme', v)}
              />
              <Toggle
                name="Notifications"
                value={settings.notifications}
                onChange={(v) => set('notifications', v)}
              />
            </section>
          </Dropdown>

          {/* Misc */}
          <Dropdown name="Misc">
            <section>
              <Toggle
                name="Receive email reminders"
                value={settings.emailReminders}
                onChange={(v) => set('emailReminders', v)}
              />
              <Toggle
                name="Receive marketing emails"
                value={settings.marketingEmails}
                onChange={(v) => set('marketingEmails', v)}
              />
            </section>
          </Dropdown>

          <img src="/logo.png" />
        </div>

        {/* Side buttons */}
        <div className="flex justify-center my-4 lg:flex-col lg:justify-evenly lg:w-[30vw] lg:pr-8">
          <a href="/main" className="rounded-3xl bg-rose-400 hover:bg-red-300 text-white py-6 mx-[1vw] px-[5%] flex-initial">
            Go Back
          </a>
          <button
            onClick={handleSave}
            className="rounded-3xl bg-rose-400 hover:bg-red-300 text-white py-6 mx-[1vw] px-[20%] flex-initial cursor-pointer"
          >
            {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save'}
          </button>
        </div>

      </div>
    </main>
  )
}