import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, createProduct, updateProduct, deleteProduct, createAuditLog } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined

    const products = await getAllProducts({ search, status })

    return NextResponse.json({ success: true, data: { items: products, total: products.length, page: 1, limit: 100, totalPages: 1 } })
  } catch (error) {
    console.error('Admin products fetch error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, description, price, categoryId, primaryImage, images, availability } = body

    if (!title || !description || !price || !categoryId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    let slug = slugify(title)
    const existing = await getAllProducts({ search: title })
    if (existing.find((p: any) => p.slug === slug)) slug = `${slug}-${Date.now()}`

    const product = await createProduct({
      title, slug, description, price: parseFloat(price), categoryId,
      primaryImage: primaryImage || '', status: 'ACTIVE',
      availability: availability !== false,
      images: images?.filter((i: string) => i.trim()) || [],
    })

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Admin product create error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
