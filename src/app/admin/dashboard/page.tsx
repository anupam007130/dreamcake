'use client'

import { useState, useEffect } from 'react'
import { DashboardStats } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Users, Package, ShoppingCart, Clock, CheckCircle, XCircle, TrendingUp, CreditCard, AlertTriangle } from 'lucide-react'
import axios from 'axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/admin/dashboard').then((res) => {
      setStats(res.data.data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!stats) return null

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-purple-500' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-pink-500' },
    { label: "Today's Orders", value: stats.todayOrders, icon: Clock, color: 'bg-orange-500' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: AlertTriangle, color: 'bg-yellow-500' },
    { label: 'Confirmed Orders', value: stats.confirmedOrders, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Urgent Orders', value: stats.urgentOrders, icon: Clock, color: 'bg-red-500' },
    { label: 'Delivered', value: stats.deliveredOrders, icon: CheckCircle, color: 'bg-emerald-500' },
  ]

  const revenueCards = [
    { label: 'Total Sales', value: formatPrice(stats.totalSales), icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Online Payments', value: formatPrice(stats.onlinePayments), icon: CreditCard, color: 'bg-blue-500' },
    { label: 'COD Advance Collected', value: formatPrice(stats.codAdvanceCollected), icon: CreditCard, color: 'bg-purple-500' },
    { label: 'Outstanding COD', value: formatPrice(stats.outstandingCod), icon: AlertTriangle, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {revenueCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-lg font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
