'use client'

import { useState, useEffect } from 'react'
import { Order } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import { Search, Eye, ChevronDown } from 'lucide-react'
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

const statusOptions = ['PAYMENT_PENDING', 'CONFIRMED', 'ACCEPTED', 'PREPARING', 'BAKING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REJECTED']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    axios.get('/api/orders/auto-reject').catch(() => {})

    const params = new URLSearchParams()
    params.set('limit', '50')
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)

    axios.get(`/api/admin/orders?${params.toString()}`).then((res) => {
      setOrders(res.data.data?.items || [])
      setLoading(false)
    })
  }, [search, statusFilter])

  const updateOrderStatus = async (orderId: string, status: string) => {
    const res = await axios.put(`/api/admin/orders/${orderId}`, { orderStatus: status })
    if (res.data.success) {
      setOrders(orders.map((o) => o.id === orderId ? { ...o, orderStatus: status } : o))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: status })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
        >
          <option value="">All Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Payment</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">#{order.orderId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.user?.fullName || '-'}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{formatPrice(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.orderType === 'URGENT' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                      {order.orderType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Order #{selectedOrder.orderId}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Customer</h3>
                <p className="text-gray-600">{selectedOrder.user?.fullName}</p>
                <p className="text-gray-600">{selectedOrder.user?.email}</p>
                <p className="text-gray-600">{selectedOrder.user?.mobile}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Delivery</h3>
                <p className="text-gray-600">{formatDate(selectedOrder.deliveryDate)}</p>
                {selectedOrder.address && (
                  <p className="text-sm text-gray-500">
                    {selectedOrder.address.houseFlat}, {selectedOrder.address.streetArea}, {selectedOrder.address.city}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Items</h3>
              {selectedOrder.items?.map((item, index) => (
                <div key={item.productId || item.id || index} className="flex justify-between py-2 border-b border-gray-100">
                  <span>{item.title} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.total)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-bold">
                <span>Total</span>
                <span className="text-pink-600">{formatPrice(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(selectedOrder.id, status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedOrder.orderStatus === status
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
