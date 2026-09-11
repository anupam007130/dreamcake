'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import { useAuthStore } from '@/store/useStore'
import { Order } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'
import axios from 'axios'

const statusColors: Record<string, string> = {
  PAYMENT_PENDING: 'bg-yellow-100 text-yellow-800',
  PAYMENT_FAILED: 'bg-red-100 text-red-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  BAKING: 'bg-orange-100 text-orange-800',
  READY: 'bg-green-100 text-green-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REJECTED: 'bg-red-100 text-red-800',
}

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    axios.get(`/api/orders?page=${page}&limit=10`).then((res) => {
      setOrders(res.data.data?.items || [])
      setTotalPages(res.data.data?.totalPages || 1)
      setLoading(false)
    })
  }, [user, page])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start ordering delicious cakes!</p>
            <Link
              href="/cakes"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Browse Cakes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.orderId}`}
                className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">#{order.orderId}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-600">{formatPrice(order.totalAmount)}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span>{order.items?.length || 0} item(s)</span>
                    <span>{order.paymentMethod === 'COD' ? 'COD' : 'Online'}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 hidden sm:block" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  page === i + 1
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
