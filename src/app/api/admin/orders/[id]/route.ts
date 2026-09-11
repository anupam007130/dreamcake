import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, getOrderByOrderId, updateOrder, createNotification, createAuditLog, getAllUsers } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    let order = await getOrderById(id)
    if (!order) order = await getOrderByOrderId(id)
    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })

    const users = await getAllUsers()
    const user = users.find((u: any) => u.id === order.userId)

    return NextResponse.json({ success: true, data: { ...order, user: user ? { id: user.id, fullName: user.fullName, email: user.email, mobile: user.mobile } : null } })
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
    const { orderStatus, paymentStatus } = body

    let order = await getOrderById(id)
    if (!order) order = await getOrderByOrderId(id)
    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })

    const updateData: Record<string, unknown> = {}
    if (orderStatus) updateData.orderStatus = orderStatus
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const updatedOrder = await updateOrder(order.id, updateData)

    const statusMessages: Record<string, string> = {
      ACCEPTED: 'Your order has been accepted',
      PREPARING: 'Your order is being prepared',
      BAKING: 'Your cake is being baked',
      READY: 'Your order is ready',
      OUT_FOR_DELIVERY: 'Your order is out for delivery',
      DELIVERED: 'Your order has been delivered',
      CANCELLED: 'Your order has been cancelled',
      REJECTED: 'Your order has been rejected',
    }

    if (orderStatus && statusMessages[orderStatus]) {
      await createNotification(order.userId, { type: orderStatus, title: 'Order Update', message: statusMessages[orderStatus], orderId: order.id })
    }

    await createAuditLog({ adminId: admin.adminId, action: 'ORDER_UPDATED', target: `Order: ${order.orderId}`, oldValue: orderStatus ? order.orderStatus : undefined, newValue: orderStatus })

    return NextResponse.json({ success: true, data: updatedOrder })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
