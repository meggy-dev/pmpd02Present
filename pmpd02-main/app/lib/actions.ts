'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createUser, findUserByUsername, validateUser, createTask, deleteTask, getTasksForUser } from './db'
import type { Task } from './types'



// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginAction(_: unknown, formData: FormData) {
  const username = formData.get('Username') as string
  const password = formData.get('Password') as string
  if (!username || !password) return { error: 'Username and password are required' }
  const user = validateUser(username, password)
  if (!user) return { error: 'Invalid username or password' }
  const cookieStore = await cookies()
  cookieStore.set('session', JSON.stringify({ userId: user.id, username: user.username }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  redirect('/main')
}

export async function signupAction(_: unknown, formData: FormData) {
  const username = formData.get('Username') as string
  const password = formData.get('Password') as string
  if (!username || !password) return { error: 'Username and password are required' }
  if (password.length < 6) return { error: 'Password must be at least 6 characters' }
  if (findUserByUsername(username)) return { error: 'Username already taken' }
  const user = createUser(username, password)
  const cookieStore = await cookies()
  cookieStore.set('session', JSON.stringify({ userId: user.id, username: user.username }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  redirect('/main')
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  if (!session) return null
  try {
    return JSON.parse(session.value) as { userId: string; username: string }
  } catch {
    return null
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect('/')
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export async function addTaskAction(formData: FormData) {
  const session = await getSession()
  if (!session) redirect('/')

  const name     = (formData.get('taskName') as string)?.trim()
  const year     = (formData.get('year')  as string)?.trim()
  const month    = (formData.get('month') as string)?.trim()
  const day      = (formData.get('day')   as string)?.trim()
  const priority = (formData.get('priority') as string) || 'green'

  if (!name || !year || !month || !day) return

  const time = `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`

  // map colour → severity
  const severityMap: Record<string, 'high' | 'medium' | 'low'> = {
    red: 'high', amber: 'medium', green: 'low',
  }
  const severity = severityMap[priority] ?? 'low'

  createTask(session.userId, name, time, severity)
  revalidatePath('/main')
}

export async function deleteTaskAction(formData: FormData) {
  const session = await getSession()
  if (!session) redirect('/')
  const taskId = formData.get('taskId') as string
  if (!taskId) return
  deleteTask(taskId, session.userId)
  revalidatePath('/main')
}

export async function getUserTasks(): Promise<Task[]> {
  const session = await getSession()
  if (!session) return []
  return getTasksForUser(session.userId)
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getUserSettings() {
  const session = await getSession()
  if (!session) return null
  const { getSettingsForUser } = await import('./db')
  return getSettingsForUser(session.userId)
}

export async function saveSettingsAction(formData: FormData) {
  const session = await getSession()
  if (!session) redirect('/')
  const { saveSettingsForUser } = await import('./db')
  saveSettingsForUser({
    userId:            session.userId,
    preferredName:     (formData.get('preferredName') as string) ?? '',
    email:             (formData.get('email') as string) ?? '',
    rightToLeft:       formData.get('rightToLeft') === 'true',
    language:          (formData.get('language') as string) ?? 'English',
    britishSummerTime: formData.get('britishSummerTime') === 'true',
    theme:             (formData.get('theme') as string) ?? 'Light',
    notifications:     formData.get('notifications') === 'true',
    emailReminders:    formData.get('emailReminders') === 'true',
    marketingEmails:   formData.get('marketingEmails') === 'true',
  })
  revalidatePath('/settings')
}