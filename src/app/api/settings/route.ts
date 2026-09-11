import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/db'

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
