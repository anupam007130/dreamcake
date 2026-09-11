import { NextRequest, NextResponse } from 'next/server'
import { getUserById, updateUser, createAuditLog } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const user = await getUserById(id)
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: { ...user, password: undefined } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const { isActive, isBlocked, fullName, email, mobile } = body

    const user = await getUserById(id)
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    const updateData: Record<string, unknown> = {}
    if (isActive !== undefined) updateData.isActive = isActive
    if (isBlocked !== undefined) updateData.isBlocked = isBlocked
    if (fullName !== undefined) updateData.fullName = fullName
    if (email !== undefined) updateData.email = email
    if (mobile !== undefined) updateData.mobile = mobile

    const updatedUser = await updateUser(id, updateData)

    await createAuditLog({ adminId: admin.adminId, action: isBlocked ? 'USER_BLOCKED' : 'USER_UPDATED', target: `User: ${user.fullName}`, oldValue: JSON.stringify({ email: user.email, mobile: user.mobile }), newValue: JSON.stringify({ email: email || user.email, mobile: mobile || user.mobile }) })

    return NextResponse.json({ success: true, data: { ...updatedUser, password: undefined } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
