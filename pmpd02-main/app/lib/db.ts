import 'server-only'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import type { User, Task, UserSettings } from './types'

const USERS_PATH    = path.join(process.cwd(), 'data', 'users.json')
const TASKS_PATH    = path.join(process.cwd(), 'data', 'tasks.json')
const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json')

// ── Helpers ──────────────────────────────────────────────────────────────────

function ensureFile(filePath: string, empty: string) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, empty, 'utf-8')
}

function readUsers(): User[] {
  ensureFile(USERS_PATH, '[]')
  return JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'))
}

function writeUsers(users: User[]) {
  ensureFile(USERS_PATH, '[]')
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), 'utf-8')
}

function readTasks(): Task[] {
  ensureFile(TASKS_PATH, '[]')
  return JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'))
}

function writeTasks(tasks: Task[]) {
  ensureFile(TASKS_PATH, '[]')
  fs.writeFileSync(TASKS_PATH, JSON.stringify(tasks, null, 2), 'utf-8')
}

function hashPassword(password: string): string {
  return crypto.scryptSync(password, 'student-helper-salt', 64).toString('hex')
}

function verifyPassword(password: string, hash: string): boolean {
  const inputHash = crypto.scryptSync(password, 'student-helper-salt', 64).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(hash))
}

// ── User functions ────────────────────────────────────────────────────────────

export function findUserByUsername(username: string): User | undefined {
  return readUsers().find(u => u.username.toLowerCase() === username.toLowerCase())
}

export function createUser(username: string, password: string): User {
  const users = readUsers()
  const user: User = {
    id: crypto.randomUUID(),
    username,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  writeUsers(users)
  return user
}

export function validateUser(username: string, password: string): User | null {
  const user = findUserByUsername(username)
  if (!user) return null
  if (!verifyPassword(password, user.passwordHash)) return null
  return user
}

// ── Task functions ────────────────────────────────────────────────────────────

export function getTasksForUser(userId: string): Task[] {
  return readTasks()
    .filter(t => t.userId === userId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export function createTask(
  userId: string,
  name: string,
  time: string,
  severity: Task['severity']
): Task {
  const tasks = readTasks()
  const task: Task = {
    id: crypto.randomUUID(),
    userId,
    name,
    time,
    severity,
    createdAt: new Date().toISOString(),
  }
  tasks.push(task)
  writeTasks(tasks)
  return task
}

export function deleteTask(taskId: string, userId: string): boolean {
  const tasks = readTasks()
  const idx = tasks.findIndex(t => t.id === taskId && t.userId === userId)
  if (idx === -1) return false
  tasks.splice(idx, 1)
  writeTasks(tasks)
  return true
}

// ── Settings functions ────────────────────────────────────────────────────────

function readSettings(): UserSettings[] {
  ensureFile(SETTINGS_PATH, '[]')
  return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'))
}

function writeSettings(settings: UserSettings[]) {
  ensureFile(SETTINGS_PATH, '[]')
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8')
}

export function getSettingsForUser(userId: string): UserSettings {
  const all = readSettings()
  return all.find(s => s.userId === userId) ?? {
    userId,
    preferredName: '',
    email: '',
    rightToLeft: false,
    language: 'English',
    britishSummerTime: false,
    theme: 'Light',
    notifications: false,
    emailReminders: false,
    marketingEmails: false,
  }
}

export function saveSettingsForUser(settings: UserSettings): void {
  const all = readSettings()
  const idx = all.findIndex(s => s.userId === settings.userId)
  if (idx === -1) all.push(settings)
  else all[idx] = settings
  writeSettings(all)
}