'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import { useAuthStore } from '@/store/useStore'
import { Order } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import { Package, MapPin, CreditCard, Clock, CheckCircle, ArrowLeft } from 'lucide-react'
import axios from 'axios'

const statusSteps = [
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'PREPARING', label: 'Preparing' },
  { key: 'BAKING', label: 'Baking' },
  { key: 'READY', label: 'Ready' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
]

export default function OrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    axios.get(`/api/orders/${id}`).then((res) => {
      setOrder(res.data.data)
      setLoading(false)
    })
  }, [id, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="bg-white rounded-2xl h-64 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
          <Link href="/orders" className="text-pink-600 font-semibold mt-4 inline-block">
            View Orders
          </Link>
        </div>
      </div>
    )
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.orderStatus)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </Link>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderId}</h1>
              <p className="text-gray-500">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
              order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {order.orderStatus.replace(/_/g, ' ')}
            </span>
          </div>

          {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'REJECTED' && (
            <div className="mb-8 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[500px]">
                {statusSteps.map((step, i) => (
                  <div key={step.key} className="flex-1 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      i <= currentStepIndex
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {i <= currentStepIndex ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-xs font-bold">{i + 1}</span>
                      )}
                    </div>
                    <p className={`text-xs text-center ${i <= currentStepIndex ? 'text-pink-600 font-medium' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {i < statusSteps.length - 1 && (
                      <div className={`absolute top-4 left-1/2 w-full h-0.5 ${
                        i < currentStepIndex ? 'bg-pink-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-pink-500" />
                Order Items
              </h3>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={item.productId || item.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100'}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100'
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">{formatPrice(item.total)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-pink-500" />
                  Delivery Address
                </h3>
                {order.address && (
                  <div className="p-3 bg-gray-50 rounded-xl text-sm">
                    <p className="font-medium">{order.address.fullName} • {order.address.mobile}</p>
                    <p className="text-gray-600">
                      {order.address.houseFlat}, {order.address.streetArea}, {order.address.city}, {order.address.state} - {order.address.pinCode}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-pink-500" />
                  Payment Details
                </h3>
                <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.deliveryCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span>{formatPrice(order.deliveryCharge)}</span>
                    </div>
                  )}
                  {order.urgentCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-orange-600">Urgent ({order.orderType})</span>
                      <span className="text-orange-600">{formatPrice(order.urgentCharge)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-pink-600">{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid</span>
                      <span className="text-green-600 font-medium">{formatPrice(order.amountPaid)}</span>
                    </div>
                    {order.remainingCod > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining (COD)</span>
                        <span className="text-orange-600 font-medium">{formatPrice(order.remainingCod)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-pink-500" />
                  <span className="font-semibold">Delivery Date: {formatDate(order.deliveryDate)}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Payment: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Full Online Payment'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
