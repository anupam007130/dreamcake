import { NextRequest, NextResponse } from 'next/server'
import { getPaymentByGatewayOrderId, updatePayment, getSettings, getOrderById, updateOrder, createNotification } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const settings = await getSettings()
    const environment = settings.payment_environment || 'TEST'
    const keySecret = environment === 'LIVE' ? settings.razorpay_live_key_secret : settings.razorpay_test_key_secret

    if (!keySecret) return NextResponse.json({ success: false, error: 'Payment gateway not configured' }, { status: 500 })

    const expectedSignature = crypto.createHmac('sha256', keySecret).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex')
    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 })
    }

    const payment = await getPaymentByGatewayOrderId(razorpayOrderId)
    if (!payment) return NextResponse.json({ success: false, error: 'Payment record not found' }, { status: 404 })

    if (payment.status === 'SUCCESSFUL') {
      const order = await getOrderById(payment.orderId)
      return NextResponse.json({ success: true, message: 'Payment already verified', data: { orderId: order?.orderId } })
    }

    await updatePayment(payment.id, { gatewayPaymentId: razorpayPaymentId, status: 'SUCCESSFUL', signatureVerified: true })

    const order = await getOrderById(payment.orderId)
    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })

    const amountPaid = payment.amount
    const remainingCod = order.paymentMethod === 'COD' ? Math.max(0, order.totalAmount - amountPaid) : 0

    await updateOrder(order.id, { amountPaid, remainingCod, paymentStatus: 'SUCCESSFUL', orderStatus: 'CONFIRMED' })

    await createNotification(order.userId, { type: 'PAYMENT_SUCCESSFUL', title: 'Payment Successful', message: `Your payment of ₹${payment.amount} has been received successfully`, orderId: order.id })

    return NextResponse.json({ success: true, message: 'Payment verified successfully', data: { orderId: order.orderId } })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
