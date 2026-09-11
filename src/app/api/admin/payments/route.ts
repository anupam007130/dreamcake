import { NextRequest, NextResponse } from 'next/server'
import { getAllPayments, getAllUsers, getAllOrders } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const payments = await getAllPayments()
    const users = await getAllUsers()
    const orders = await getAllOrders()

    const usersMap: Record<string, any> = {}
    users.forEach((u: any) => { usersMap[u.id] = u })
    const ordersMap: Record<string, any> = {}
    orders.forEach((o: any) => { ordersMap[o.id] = o })

    const enrichedPayments = payments.map((p: any) => ({
      ...p,
      user: usersMap[p.userId] ? { fullName: usersMap[p.userId].fullName, email: usersMap[p.userId].email } : null,
      order: ordersMap[p.orderId] ? { orderId: ordersMap[p.orderId].orderId, totalAmount: ordersMap[p.orderId].totalAmount } : null,
    }))

    return NextResponse.json({ success: true, data: { items: enrichedPayments, total: enrichedPayments.length, page: 1, limit: 100, totalPages: 1 } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
