import { NextRequest, NextResponse } from 'next/server'
import { createPayment, getSettings, getOrderById, getOrderByOrderId, updateOrder } from '@/lib/db'
import { getUserFromRequest, generatePaymentId } from '@/lib/auth'

const Razorpay = require('razorpay')

async function getRazorpayInstance() {
  const settings = await getSettings()
  const environment = settings.payment_environment || 'TEST'
  const keyId = environment === 'LIVE' ? settings.razorpay_live_key_id : settings.razorpay_test_key_id
  const keySecret = environment === 'LIVE' ? settings.razorpay_live_key_secret : settings.razorpay_test_key_secret
  if (!keyId || !keySecret) throw new Error('Razorpay not configured')
  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { orderId, amount } = body
    if (!orderId || !amount) return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })

    let order = await getOrderById(orderId)
    if (!order) order = await getOrderByOrderId(orderId)
    if (!order || order.userId !== user.userId) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })

    const razorpay = await getRazorpayInstance()
    const razorpayOrder = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: 'INR', receipt: order.orderId })

    const paymentId = generatePaymentId()
    await createPayment({
      paymentId, orderId: order.id, userId: user.userId,
      gatewayOrderId: razorpayOrder.id, amount, currency: 'INR',
      paymentMethod: order.paymentMethod,
      paymentType: order.paymentMethod === 'COD' ? 'COD_ADVANCE' : 'FULL_PAYMENT',
      status: 'PENDING',
    })

    await updateOrder(order.id, { razorpayOrderId: razorpayOrder.id })

    const settings = await getSettings()
    const environment = settings.payment_environment || 'TEST'
    const keyId = environment === 'LIVE' ? settings.razorpay_live_key_id : settings.razorpay_test_key_id

    return NextResponse.json({
      success: true,
      data: { orderId: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency, keyId },
    })
  } catch (error: any) {
    console.error('Razorpay order error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
