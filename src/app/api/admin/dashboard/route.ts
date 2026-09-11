import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers, getAllProducts, getAllOrders, getAllPayments } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const [users, products, orders, payments] = await Promise.all([
      getAllUsers(), getAllProducts({}), getAllOrders(), getAllPayments(),
    ])

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayOrders = orders.filter((o: any) => new Date(o.createdAt) >= today).length
    const pendingOrders = orders.filter((o: any) => o.orderStatus === 'PAYMENT_PENDING').length
    const confirmedOrders = orders.filter((o: any) => ['CONFIRMED', 'ACCEPTED', 'PREPARING', 'BAKING', 'READY', 'OUT_FOR_DELIVERY'].includes(o.orderStatus)).length
    const urgentOrders = orders.filter((o: any) => o.orderType === 'URGENT').length
    const normalOrders = orders.filter((o: any) => o.orderType === 'NORMAL').length
    const deliveredOrders = orders.filter((o: any) => o.orderStatus === 'DELIVERED').length
    const cancelledOrders = orders.filter((o: any) => o.orderStatus === 'CANCELLED').length

    const totalSales = orders.filter((o: any) => o.paymentStatus === 'SUCCESSFUL').reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
    const onlinePayments = payments.filter((p: any) => p.paymentMethod === 'FULL_ONLINE' && p.status === 'SUCCESSFUL').reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
    const codAdvanceCollected = payments.filter((p: any) => p.paymentMethod === 'COD' && p.paymentType === 'COD_ADVANCE' && p.status === 'SUCCESSFUL').reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
    const outstandingCod = orders.filter((o: any) => o.paymentMethod === 'COD' && o.remainingCod > 0).reduce((sum: number, o: any) => sum + (o.remainingCod || 0), 0)

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: users.length, totalProducts: products.length, totalOrders: orders.length,
        todayOrders, pendingOrders, confirmedOrders, urgentOrders, normalOrders,
        deliveredOrders, cancelledOrders, totalSales, onlinePayments, codAdvanceCollected, outstandingCod,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
