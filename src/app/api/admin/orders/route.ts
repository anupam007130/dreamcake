import { NextRequest, NextResponse } from 'next/server'
import { getAllOrders, getOrderById, getOrderByOrderId, updateOrder, createNotification, createAuditLog, getAllUsers } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const paymentMethod = searchParams.get('paymentMethod') || undefined
    const orderType = searchParams.get('orderType') || undefined

    const orders = await getAllOrders({ search, status, paymentMethod, orderType })

    const users = await getAllUsers()
    const usersMap: Record<string, any> = {}
    users.forEach((u: any) => { usersMap[u.id] = u })

    const ordersWithUsers = orders.map((o: any) => ({ ...o, user: usersMap[o.userId] ? { id: usersMap[o.userId].id, fullName: usersMap[o.userId].fullName, email: usersMap[o.userId].email, mobile: usersMap[o.userId].mobile } : null }))

    return NextResponse.json({ success: true, data: { items: ordersWithUsers, total: ordersWithUsers.length, page: 1, limit: 100, totalPages: 1 } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
