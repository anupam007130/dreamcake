import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmailOrMobile } from '@/lib/db'
import { generateToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, mobile, email, password } = body

    if (!fullName || !mobile || !email || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const existingEmail = await getUserByEmailOrMobile(email)
    if (existingEmail) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 })
    }

    const existingMobile = await getUserByEmailOrMobile(mobile)
    if (existingMobile) {
      return NextResponse.json({ success: false, error: 'Mobile number already registered' }, { status: 400 })
    }

    const user = await createUser({ fullName, mobile, email, password })

    const token = generateToken({ userId: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({ success: true, data: { user, token } })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
