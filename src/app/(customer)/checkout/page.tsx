'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import { useCartStore, useAuthStore } from '@/store/useStore'
import { formatPrice, isUrgentOrder, getMinDeliveryDate } from '@/lib/utils'
import { Address } from '@/types'
import { MapPin, Calendar, CreditCard, Truck, Clock, CheckCircle } from 'lucide-react'
import axios from 'axios'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { items, clearCart } = useCartStore()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [showNewAddress, setShowNewAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    fullName: '', mobile: '', houseFlat: '', streetArea: '',
    city: '', state: '', pinCode: '', landmark: '', deliveryInstructions: '',
  })
  const [deliveryDate, setDeliveryDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'FULL_ONLINE'>('COD')
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    Promise.all([
      axios.get('/api/addresses'),
      axios.get('/api/settings'),
    ]).then(([addrRes, settingsRes]) => {
      setAddresses(addrRes.data.data || [])
      setSettings(settingsRes.data.data || {})
      setLoading(false)
    })
  }, [user])

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const deliveryCharge = parseFloat(settings.delivery_charge || '0')
  const urgentThreshold = parseInt(settings.urgent_threshold_days || '2')
  const urgentChargeAmount = parseFloat(settings.urgent_charge || '100')
  const urgentChargeEnabled = settings.urgent_charge_enabled !== 'false'
  const codAdvanceAmount = parseFloat(settings.cod_advance_amount || '100')

  const deliveryDateObj = deliveryDate ? new Date(deliveryDate) : null
  const isUrgent = deliveryDateObj ? isUrgentOrder(deliveryDateObj, urgentThreshold) : false
  const urgentCharge = isUrgent && urgentChargeEnabled ? urgentChargeAmount : 0
  const total = subtotal + deliveryCharge + urgentCharge
  const advanceAmount = paymentMethod === 'COD' ? Math.min(codAdvanceAmount, total) : total
  const remainingCod = paymentMethod === 'COD' ? total - advanceAmount : 0

  const handleAddAddress = async () => {
    try {
      const res = await axios.post('/api/addresses', newAddress)
      if (res.data.success) {
        setAddresses([...addresses, res.data.data])
        setSelectedAddress(res.data.data.id)
        setShowNewAddress(false)
        setNewAddress({ fullName: '', mobile: '', houseFlat: '', streetArea: '', city: '', state: '', pinCode: '', landmark: '', deliveryInstructions: '' })
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add address')
    }
  }

  const handlePlaceOrder = async () => {
    setError('')
    if (!selectedAddress) { setError('Please select a delivery address'); return }
    if (!deliveryDate) { setError('Please select a delivery date'); return }

    setProcessing(true)
    try {
      const orderRes = await axios.post('/api/orders', {
        addressId: selectedAddress,
        deliveryDate,
        paymentMethod,
      })

      if (!orderRes.data.success) {
        setError(orderRes.data.error)
        setProcessing(false)
        return
      }

      const order = orderRes.data.data

      const razorpayRes = await axios.post('/api/razorpay', {
        orderId: order.id,
        amount: advanceAmount,
      })

      if (!razorpayRes.data.success) {
        setError(razorpayRes.data.error)
        setProcessing(false)
        return
      }

      const options = {
        key: razorpayRes.data.data.keyId,
        amount: razorpayRes.data.data.amount,
        currency: razorpayRes.data.data.currency,
        name: 'Sweet Cake',
        description: `Order ${order.orderId}`,
        order_id: razorpayRes.data.data.orderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await axios.post('/api/razorpay/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })

            if (verifyRes.data.success) {
              clearCart()
              router.push(`/orders/${order.orderId}?success=true`)
            } else {
              setError('Payment verification failed')
            }
          } catch (err) {
            setError('Payment verification failed. Please contact support.')
          }
          setProcessing(false)
        },
        prefill: {
          name: user?.fullName,
          email: user?.email,
          contact: user?.mobile,
        },
        theme: { color: '#ec4899' },
        modal: {
          ondismiss: () => {
            setProcessing(false)
            setError('Payment was cancelled. Your order is pending.')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to place order')
      setProcessing(false)
    }
  }

  const minDate = getMinDeliveryDate(parseInt(settings.minimum_delivery_days || '1'))
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 animate-shake">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-pink-500" />
                Delivery Address
              </h2>

              {addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedAddress === addr.id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        className="sr-only"
                      />
                      <p className="font-semibold">{addr.fullName} • {addr.mobile}</p>
                      <p className="text-sm text-gray-600">
                        {addr.houseFlat}, {addr.streetArea}, {addr.city}, {addr.state} - {addr.pinCode}
                      </p>
                      {addr.landmark && <p className="text-sm text-gray-500">Landmark: {addr.landmark}</p>}
                    </label>
                  ))}
                </div>
              )}

              {!showNewAddress ? (
                <button
                  onClick={() => setShowNewAddress(true)}
                  className="text-pink-600 font-medium hover:underline"
                >
                  + Add New Address
                </button>
              ) : (
                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Full Name" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} className="p-3 border border-gray-200 rounded-lg text-sm" />
                    <input placeholder="Mobile" value={newAddress.mobile} onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })} className="p-3 border border-gray-200 rounded-lg text-sm" />
                  </div>
                  <input placeholder="House/Flat" value={newAddress.houseFlat} onChange={(e) => setNewAddress({ ...newAddress, houseFlat: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
                  <input placeholder="Street/Area" value={newAddress.streetArea} onChange={(e) => setNewAddress({ ...newAddress, streetArea: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
                  <div className="grid grid-cols-3 gap-3">
                    <input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="p-3 border border-gray-200 rounded-lg text-sm" />
                    <input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="p-3 border border-gray-200 rounded-lg text-sm" />
                    <input placeholder="PIN Code" value={newAddress.pinCode} onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })} className="p-3 border border-gray-200 rounded-lg text-sm" />
                  </div>
                  <input placeholder="Landmark (optional)" value={newAddress.landmark} onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
                  <div className="flex gap-3">
                    <button onClick={handleAddAddress} className="bg-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-600">Save Address</button>
                    <button onClick={() => setShowNewAddress(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-500" />
                Delivery Date
              </h2>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={minDate.toISOString().split('T')[0]}
                max={maxDate.toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {isUrgent && deliveryDate && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="text-orange-700 font-medium">
                    ⚡ Urgent Order - Additional {formatPrice(urgentChargeAmount)} charge applies
                  </span>
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Minimum delivery time: {settings.minimum_delivery_days || 1} day(s)
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-pink-500" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="sr-only" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay {formatPrice(advanceAmount)} advance now</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-pink-600">{formatPrice(advanceAmount)}</p>
                      <p className="text-xs text-gray-500">advance via Razorpay</p>
                    </div>
                  </div>
                </label>

                <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'FULL_ONLINE' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="FULL_ONLINE" checked={paymentMethod === 'FULL_ONLINE'} onChange={() => setPaymentMethod('FULL_ONLINE')} className="sr-only" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Pay Full Amount Online</p>
                      <p className="text-sm text-gray-600">Pay {formatPrice(total)} now, ₹0 on delivery</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-pink-600">{formatPrice(total)}</p>
                      <p className="text-xs text-gray-500">full payment</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.product.title} × {item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span>{deliveryCharge > 0 ? formatPrice(deliveryCharge) : 'Free'}</span>
                </div>
                {urgentCharge > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600">Urgent Charge</span>
                    <span className="text-orange-600">{formatPrice(urgentCharge)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-pink-600">{formatPrice(total)}</span>
                  </div>
                </div>
                <div className="bg-pink-50 rounded-xl p-3 mt-3">
                  <p className="text-sm font-medium text-pink-800">
                    {paymentMethod === 'COD' ? (
                      <>Pay {formatPrice(advanceAmount)} now via Razorpay, {formatPrice(remainingCod)} on delivery</>
                    ) : (
                      <>Pay {formatPrice(total)} now - No payment on delivery</>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={processing || !selectedAddress || !deliveryDate}
                className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
