import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, getOrderByOrderId } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    let order = await getOrderById(id)
    if (!order || order.userId !== user.userId) {
      order = await getOrderByOrderId(id)
      if (!order || order.userId !== user.userId) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
      }
    }

    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
