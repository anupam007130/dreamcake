import { NextRequest, NextResponse } from 'next/server'
import { getAllCategories as getAllCats, updateCategory, deleteCategory } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const { name, description, sortOrder, isActive } = body

    const updateData: Record<string, unknown> = {}
    if (name) { updateData.name = name; updateData.slug = slugify(name) }
    if (description !== undefined) updateData.description = description
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder
    if (isActive !== undefined) updateData.isActive = isActive

    const category = await updateCategory(id, updateData)
    return NextResponse.json({ success: true, data: category })
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
    await deleteCategory(id)
    return NextResponse.json({ success: true, message: 'Category deleted' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
