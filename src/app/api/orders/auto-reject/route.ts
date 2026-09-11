import { NextRequest, NextResponse } from 'next/server'
import { autoRejectExpiredOrders } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await autoRejectExpiredOrders()
    return NextResponse.json({ success: true, message: 'Auto-reject check completed' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await autoRejectExpiredOrders()
    return NextResponse.json({ success: true, message: 'Auto-reject check completed' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
