import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const users = await getAllUsers()
    return NextResponse.json({ success: true, data: { items: users, total: users.length, page: 1, limit: 100, totalPages: 1 } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
