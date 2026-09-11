import { NextRequest, NextResponse } from 'next/server'
import { getAdminByEmail } from '@/lib/db'
import { verifyPassword, generateAdminToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }

    const admin = await getAdminByEmail(email)

    if (!admin) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    if (!admin.isActive) {
      return NextResponse.json({ success: false, error: 'Admin account is deactivated' }, { status: 403 })
    }

    const isValidPassword = await verifyPassword(password, admin.password)
    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const token = generateAdminToken({ adminId: admin.id, email: admin.email, role: admin.role })

    const response = NextResponse.json({
      success: true,
      data: {
        admin: { id: admin.id, fullName: admin.fullName, email: admin.email, role: admin.role },
        token,
      },
    })

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
