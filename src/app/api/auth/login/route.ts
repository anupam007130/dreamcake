import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmailOrMobile } from '@/lib/db'
import { verifyPassword, generateToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { login, password } = body

    if (!login || !password) {
      return NextResponse.json({ success: false, error: 'Email/Mobile and password are required' }, { status: 400 })
    }

    const user = await getUserByEmailOrMobile(login)

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ success: false, error: 'Account is deactivated' }, { status: 403 })
    }

    if (user.isBlocked) {
      return NextResponse.json({ success: false, error: 'Account has been blocked' }, { status: 403 })
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({
      success: true,
      data: {
        user: { id: user.id, fullName: user.fullName, mobile: user.mobile, email: user.email, role: user.role },
        token,
      },
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
