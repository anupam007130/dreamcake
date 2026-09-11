import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug, getAllCategories } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const product = await getProductBySlug(slug)

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    const categories = await getAllCategories()
    const category = categories.find((c: any) => c.id === product.categoryId)

    return NextResponse.json({
      success: true,
      data: { ...product, category },
    })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
