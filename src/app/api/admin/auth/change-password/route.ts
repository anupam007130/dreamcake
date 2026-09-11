import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest, hashPassword, verifyPassword } from '@/lib/auth'
import { dbGet, dbUpdate } from '@/lib/firebase'

export async function PUT(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { currentPassword, newPassword, email } = body

    const admins = (await dbGet('admins')) || {}
    const adminData = Object.values(admins).find((a: any) => a.id === admin.adminId) as any

    if (!adminData) return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 })

    if (email && email !== adminData.email) {
      const emailExists = Object.values(admins).some((a: any) => a.email === email && a.id !== admin.adminId)
      if (emailExists) return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 })
    }

    if (newPassword) {
      if (!currentPassword) return NextResponse.json({ success: false, error: 'Current password required' }, { status: 400 })

      const valid = await verifyPassword(currentPassword, adminData.password)
      if (!valid) return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 })

      const hashed = await hashPassword(newPassword)
      await dbUpdate(`admins/${adminData.id}`, { password: hashed })
    }

    if (email || body.fullName) {
      const updates: any = {}
      if (email) updates.email = email
      if (body.fullName) updates.fullName = body.fullName
      await dbUpdate(`admins/${adminData.id}`, updates)
    }

    return NextResponse.json({ success: true, message: 'Admin updated successfully' })
  } catch (error) {
    console.error('Admin update error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
