import { NextRequest, NextResponse } from 'next/server'
import { getCartItems, clearCart, getAddresses, createOrder, getOrderById, getOrdersByUser, getSettings } from '@/lib/db'
import { getUserFromRequest, generateOrderId } from '@/lib/auth'
import { isUrgentOrder } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const orders = await getOrdersByUser(user.userId)
    return NextResponse.json({ success: true, data: { items: orders, total: orders.length, page: 1, limit: 100, totalPages: 1 } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { addressId, deliveryDate, paymentMethod, notes } = body

    if (!addressId || !deliveryDate || !paymentMethod) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const addresses = await getAddresses(user.userId)
    const address = addresses.find((a: any) => a.id === addressId)
    if (!address) return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 })

    const cartItems = await getCartItems(user.userId)
    if (cartItems.length === 0) return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 })

    const deliveryDateObj = new Date(deliveryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    deliveryDateObj.setHours(0, 0, 0, 0)
    if (deliveryDateObj < today) return NextResponse.json({ success: false, error: 'Cannot select a past delivery date' }, { status: 400 })

    const settings = await getSettings()
    const urgentThreshold = parseInt(settings.urgent_threshold_days || '2')
    const urgentChargeAmount = parseFloat(settings.urgent_charge || '100')
    const urgentChargeEnabled = settings.urgent_charge_enabled !== 'false'
    const deliveryChargeAmount = parseFloat(settings.delivery_charge || '0')
    const codAdvanceAmount = parseFloat(settings.cod_advance_amount || '100')

    const orderType = isUrgentOrder(deliveryDateObj, urgentThreshold) ? 'URGENT' : 'NORMAL'
    const urgentCharge = orderType === 'URGENT' && urgentChargeEnabled ? urgentChargeAmount : 0

    let subtotal = 0
    const orderItems = cartItems.map((item: any) => {
      const itemTotal = item.product.price * item.quantity
      subtotal += itemTotal
      return {
        productId: item.productId,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        total: itemTotal,
        image: item.product.primaryImage,
      }
    })

    const totalAmount = subtotal + deliveryChargeAmount + urgentCharge
    const advanceAmount = paymentMethod === 'COD' ? Math.min(codAdvanceAmount, totalAmount) : 0

    const orderId = generateOrderId()

    const order = await createOrder({
      orderId, userId: user.userId, addressId, subtotal,
      deliveryCharge: deliveryChargeAmount, urgentCharge, totalAmount,
      paymentMethod, advanceAmount, amountPaid: 0,
      remainingCod: paymentMethod === 'COD' ? totalAmount : 0,
      deliveryDate: deliveryDateObj.toISOString(), orderType,
      paymentStatus: 'PENDING', orderStatus: 'PAYMENT_PENDING',
      notes, items: orderItems, address,
    })

    await clearCart(user.userId)

    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    console.error('Order create error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
