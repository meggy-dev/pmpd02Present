'use client'

import { useState, useEffect } from 'react'
import type { UserSettings } from '../../lib/types'

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

// ── Dark mode colour maps ─────────────────────────────────────────────────────

const c = {
  // page bg
  pageBg:        (dark: boolean) => dark ? 'bg-gray-900'    : 'lg:bg-indigo-200',
  // outer row
  outerRow:      (dark: boolean) => dark ? 'bg-gray-800'    : 'lg:bg-white',
  // scroll panel
  panel:         (dark: boolean) => dark ? 'bg-gray-800 text-gray-100' : 'bg-white text-black',
  // profile card
  profileCard:   (dark: boolean) => dark ? 'bg-indigo-900'  : 'bg-indigo-300',
  // input
  input:         (dark: boolean) => dark ? 'bg-indigo-700 text-white' : 'bg-indigo-300',
  // save btn inside card
  saveBtn:       (dark: boolean) => dark ? 'bg-indigo-700 hover:bg-indigo-600 text-white' : 'bg-indigo-200 hover:bg-indigo-100',
  // dropdown
  dropdown:      (dark: boolean) => dark ? 'bg-fuchsia-900' : 'bg-fuchsia-300',
  dropdownText:  (dark: boolean) => dark ? 'text-gray-200 hover:text-gray-400' : 'hover:text-gray-500',
  // toggle on
  toggleOn:      'bg-indigo-300 hover:bg-indigo-400',
  toggleOff:     'bg-gray-500 hover:bg-gray-600',
  // multichoice
  choiceBase:    (dark: boolean) => dark ? 'bg-indigo-900'  : 'bg-indigo-100',
  choiceChecked: (dark: boolean) => dark ? 'peer-checked:bg-indigo-500' : 'peer-checked:bg-indigo-300',
  choiceHover:   (dark: boolean) => dark ? 'hover:bg-indigo-800' : 'hover:bg-indigo-200',
  labelText:     (dark: boolean) => dark ? 'text-gray-200'  : '',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Header({ title, dark }: { title: string; dark: boolean }) {
  return (
    <div className={`flex justify-center items-center py-4 ${dark ? 'bg-pink-800' : 'bg-pink-400'}`}>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
    </div>
  )
}

function Toggle({ name, value, onChange, dark }: { name: string; value: boolean; onChange: (v: boolean) => void; dark: boolean }) {
  return (
    <div className="text-left my-4">
      <span className={c.labelText(dark)}>{name}</span>
      <div className="float-right inline cursor-pointer" onClick={() => onChange(!value)}>
        <span className={`relative inline-flex rounded-full p-1 h-8 w-16 ${value ? c.toggleOn : c.toggleOff}`}>
          <span className={`h-6 w-6 rounded-full bg-white inline-block transition-transform ${value ? 'translate-x-8' : 'translate-x-0'}`}></span>
        </span>
      </div>
    </div>
  )
}

function Multichoice({ name, choices, value, onChange, dark }: {
  name: string; choices: string[]; value: string; onChange: (v: string) => void; dark: boolean
}) {
  return (
    <div className="text-left my-4">
      <span className={c.labelText(dark)}>{name}</span>
      <ul className="float-right max-w-[40vw] inline overflow-x-scroll pb-2">
        {choices.map((choice, index) => (
          <li key={index} className="inline pl-4">
            <input type="radio" className="peer hidden" readOnly checked={value === choice} value={choice} />
            <label
              onClick={() => onChange(choice)}
              className={`cursor-pointer p-5 px-8 py-0 rounded-full ${c.labelText(dark)} ${c.choiceBase(dark)} ${c.choiceChecked(dark)} ${c.choiceHover(dark)}`}
            >
              {choice}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Details({ name, field, value, onChange, dark }: {
  name: string; field: string; value: string; onChange: (field: string, v: string) => void; dark: boolean
}) {
  return (
    <div>
      <p className={`text-left ${c.labelText(dark)}`}>{name}:</p>
      <input
        type="text"
        value={value}
        placeholder={name}
        onChange={(e) => onChange(field, e.target.value)}
        className={`text-center border-none text-2xl rounded-2xl w-[80%] outline-none ${c.input(dark)}`}
      />
    </div>
  )
}

function Dropdown({ name, children, dark }: { name: string; children: React.ReactNode; dark: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${c.dropdown(dark)} w-[95%] rounded-3xl my-2`}>
      <div className={`text-4xl text-left py-2 px-6 cursor-pointer ${c.dropdownText(dark)}`} onClick={() => setOpen(!open)}>
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
  const [loading, setLoading] = useState(false)

  const dark = settings.theme === 'Dark'

  useEffect(() => {
    // Read theme cookie first for instant render, then overlay full settings from API
    const match = document.cookie.match(/(?:^|; )theme=([^;]*)/)
    if (match) {
      setSettings(prev => ({ ...prev, theme: decodeURIComponent(match[1]) as 'Light' | 'Dark' }))
    }

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
      const res = await fetch('/api/settings', { method: 'POST', credentials: 'include', body: fd })
      if (res.ok) {
        document.cookie = `theme=${encodeURIComponent(settings.theme)}; path=/; max-age=${60 * 60 * 24 * 365}`
        setStatus('saved')
      } else {
        setStatus('error')
      }
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }


  return (
    <main className={`font-bold text-2xl text-center h-dvh justify-center transition-colors duration-300 ${c.pageBg(dark)}`}>
      <Header title="Settings" dark={dark} />
      <div className={`flex flex-col lg:flex-row mx-16 rounded-4xl ${c.outerRow(dark)}`}>

        <div className={`rounded-4xl p-1 flex flex-col w-[90%] mx-[5%] lg:mx-0 h-[75vh] lg:h-[85vh] items-center overflow-scroll transition-colors duration-300 ${c.panel(dark)}`}>

          {/* Profile */}
          <div className={`rounded-4xl w-[95%] my-8 transition-colors duration-300 ${c.profileCard(dark)}`}>
            <img src="/user.png" className="float-left p-4 w-[30%] min-w-[200px]" />
            <div className="h-[25vh] flex flex-col justify-center p-8">
              <Details name="Preferred name" field="preferredName" value={settings.preferredName} onChange={(f, v) => set(f as keyof typeof settings, v)} dark={dark} />
              <Details name="Email"          field="email"         value={settings.email}         onChange={(f, v) => set(f as keyof typeof settings, v)} dark={dark} />
            </div>
            <button onClick={handleSave} className={`rounded-3xl py-2 px-25 m-2 cursor-pointer transition-colors ${c.saveBtn(dark)}`}>
              {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : status === 'error' ? 'Error ✗' : 'Save'}
            </button>
          </div>

          <Dropdown name="Language" dark={dark}>
            <section>
              <Toggle name="Right to left"      value={settings.rightToLeft}     onChange={(v) => set('rightToLeft', v)}     dark={dark} />
              <Multichoice name="Override language" choices={['English','Spanish','Polish']} value={settings.language} onChange={(v) => set('language', v)} dark={dark} />
            </section>
          </Dropdown>

          <Dropdown name="Time zone" dark={dark}>
            <section>
              <Toggle name="British summer time" value={settings.britishSummerTime} onChange={(v) => set('britishSummerTime', v)} dark={dark} />
            </section>
          </Dropdown>

          <Dropdown name="Appearance" dark={dark}>
            <section>
              <Multichoice name="Theme" choices={['Light','Dark']} value={settings.theme} onChange={(v) => set('theme', v)} dark={dark} />
              <Toggle name="Notifications" value={settings.notifications} onChange={(v) => set('notifications', v)} dark={dark} />
            </section>
          </Dropdown>

          <Dropdown name="Misc" dark={dark}>
            <section>
              <Toggle name="Receive email reminders" value={settings.emailReminders}  onChange={(v) => set('emailReminders', v)}  dark={dark} />
              <Toggle name="Receive marketing emails" value={settings.marketingEmails} onChange={(v) => set('marketingEmails', v)} dark={dark} />
            </section>
          </Dropdown>

          <img src="/logo.png" />
        </div>

        {/* Side buttons — unchanged */}
        <div className="flex justify-center my-4 lg:flex-col lg:justify-evenly lg:w-[30vw] lg:pr-8">
          <a href="/main" className="rounded-3xl bg-rose-400 hover:bg-red-300 text-white py-6 mx-[1vw] px-[5%] flex-initial">Go Back</a>
          <button onClick={handleSave} className="rounded-3xl bg-rose-400 hover:bg-red-300 text-white py-6 mx-[1vw] px-[20%] flex-initial cursor-pointer">
            {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save'}
          </button>
        </div>

      </div>
    </main>
  )
}