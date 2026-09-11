import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined

    const products = await getAllProducts({ category, search, status: 'ACTIVE' })
    const total = products.length
    const start = (page - 1) * limit
    const paginatedProducts = products.slice(start, start + limit)

    return NextResponse.json({
      success: true,
      data: { items: paginatedProducts, total, page, limit, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
