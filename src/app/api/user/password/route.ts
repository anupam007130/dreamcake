import { NextRequest, NextResponse } from 'next/server'
import { getUserById, updateUser } from '@/lib/db'
import { getUserFromRequest, verifyPassword, hashPassword } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Current and new password are required' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'New password must be at least 6 characters' }, { status: 400 })
    }

    const user = await getUserById(authUser.userId)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const isValid = await verifyPassword(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(newPassword)
    await updateUser(authUser.userId, { password: hashedPassword })

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (error: any) {
    console.error('Password update error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
