import { NextRequest, NextResponse } from 'next/server'
import { getProductById, updateProduct, deleteProduct, createAuditLog } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const product = await getProductById(id)
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: product })
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
    const { title, description, price, categoryId, primaryImage, images, availability, status } = body

    const existing = await getProductById(id)
    if (!existing) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })

    let slug = existing.slug
    if (title && title !== existing.title) {
      slug = slugify(title)
    }

    const updateData: Record<string, unknown> = { slug }
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (price) updateData.price = parseFloat(price)
    if (categoryId) updateData.categoryId = categoryId
    if (primaryImage) updateData.primaryImage = primaryImage
    if (availability !== undefined) updateData.availability = availability
    if (status) updateData.status = status
    if (images && Array.isArray(images)) updateData.images = images.filter((i: string) => i.trim())

    const updatedProduct = await updateProduct(id, updateData)

    await createAuditLog({ adminId: admin.adminId, action: 'PRODUCT_UPDATED', target: `Product: ${title || existing.title}`, oldValue: JSON.stringify(existing), newValue: JSON.stringify(updatedProduct) })

    return NextResponse.json({ success: true, data: updatedProduct })
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
    const product = await getProductById(id)
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })

    await deleteProduct(id)
    await createAuditLog({ adminId: admin.adminId, action: 'PRODUCT_DELETED', target: `Product: ${product.title}`, oldValue: JSON.stringify(product) })

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
