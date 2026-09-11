import { NextRequest, NextResponse } from 'next/server'
import { updateBanner, deleteBanner } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()

    const banner = await updateBanner(id, body)
    return NextResponse.json({ success: true, data: banner })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await deleteBanner(id)
    return NextResponse.json({ success: true, message: 'Banner deleted' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
