'use client'

import { useState, useEffect } from 'react'
import { Payment } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import { Search } from 'lucide-react'
import axios from 'axios'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  SUCCESSFUL: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/admin/payments?limit=100').then((res) => {
      setPayments(res.data.data?.items || [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Payment ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Order</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Method</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{payment.paymentId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.user?.fullName || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">#{payment.order?.orderId || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.paymentMethod} ({payment.paymentType})</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{formatPrice(payment.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[payment.status] || 'bg-gray-100 text-gray-800'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(payment.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
