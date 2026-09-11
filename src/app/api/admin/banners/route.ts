import { NextRequest, NextResponse } from 'next/server'
import { getAllBanners, createBanner } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET() {
  try {
    const banners = await getAllBanners()
    return NextResponse.json({ success: true, data: banners })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { imageUrl, heading, subtitle, buttonText, buttonLink, sortOrder } = body

    if (!imageUrl || !heading) return NextResponse.json({ success: false, error: 'Image URL and heading are required' }, { status: 400 })

    const banner = await createBanner({ imageUrl, heading, subtitle, buttonText, buttonLink, sortOrder: sortOrder || 0, isActive: true })
    return NextResponse.json({ success: true, data: banner })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
