export type Task = {
  id: string
  userId: string
  name: string
  time: string
  severity: 'high' | 'medium' | 'low'
  createdAt: string
}

export type User = {
  id: string
  username: string
  passwordHash: string
  createdAt: string
}

export type UserSettings = {
  userId: string
  preferredName: string
  email: string
  // Language
  rightToLeft: boolean
  language: string
  // Time zone
  britishSummerTime: boolean
  // Appearance
  theme: string
  notifications: boolean
  // Misc
  emailReminders: boolean
  marketingEmails: boolean
}