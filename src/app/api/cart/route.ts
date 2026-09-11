import { NextRequest, NextResponse } from 'next/server'
import { getCartItems, addCartItem, updateCartItem, deleteCartItem, clearCart } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const items = await getCartItems(user.userId)
    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { productId, quantity = 1 } = body
    if (!productId) return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 })

    const item = await addCartItem(user.userId, productId, quantity)
    return NextResponse.json({ success: true, data: item })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { productId, quantity } = body
    if (!productId || quantity < 1) return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 })

    const item = await updateCartItem(user.userId, productId, quantity)
    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (productId) {
      await deleteCartItem(user.userId, productId)
    } else {
      await clearCart(user.userId)
    }

    return NextResponse.json({ success: true, message: 'Cart updated' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
