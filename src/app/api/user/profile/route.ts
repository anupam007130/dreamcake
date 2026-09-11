import { NextRequest, NextResponse } from 'next/server'
import { updateUser } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fullName } = body

    if (!fullName) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
    }

    const updated = await updateUser(authUser.userId, { fullName })

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
