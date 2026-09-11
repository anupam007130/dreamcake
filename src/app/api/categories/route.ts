import { NextRequest, NextResponse } from 'next/server'
import { getAllCategories as getAllCats, createCategory as createCat, updateCategory, deleteCategory } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET() {
  try {
    const categories = await getAllCats()
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { name, description, sortOrder } = body

    if (!name) return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 })

    const slug = slugify(name)
    const category = await createCat({ name, slug, description, sortOrder: sortOrder || 0 })

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
