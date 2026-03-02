import { NextResponse, NextRequest } from 'next/server'
import { getUserSettings, saveSettingsAction } from '../../lib/actions'

export async function GET() {
  const settings = await getUserSettings()
  if (!settings) return NextResponse.json(null, { status: 401 })
  return NextResponse.json(settings)
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  await saveSettingsAction(formData)
  return NextResponse.json({ ok: true })
}