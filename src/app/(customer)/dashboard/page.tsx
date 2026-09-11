'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import { useAuthStore } from '@/store/useStore'
import { User, Package, MapPin, CreditCard, Settings, LogOut, ChevronRight, Bell } from 'lucide-react'
import axios from 'axios'

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [stats, setStats] = useState({ orders: 0, pending: 0, delivered: 0 })

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    axios.get('/api/orders?limit=100').then((res) => {
      const orders = res.data.data?.items || []
      setStats({
        orders: orders.length,
        pending: orders.filter((o: any) => !['DELIVERED', 'CANCELLED'].includes(o.orderStatus)).length,
        delivered: orders.filter((o: any) => o.orderStatus === 'DELIVERED').length,
      })
    })
  }, [user])

  const handleLogout = async () => {
    await axios.post('/api/auth/logout')
    logout()
    router.push('/')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <p className="text-white/80">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{stats.orders}</p>
              <p className="text-sm text-white/80">Total Orders</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-white/80">Active Orders</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{stats.delivered}</p>
              <p className="text-sm text-white/80">Delivered</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/orders" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-pink-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">My Orders</h3>
              <p className="text-sm text-gray-500">View order history & tracking</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link href="/dashboard" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">My Addresses</h3>
              <p className="text-sm text-gray-500">Manage delivery addresses</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link href="/cart" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">My Cart</h3>
              <p className="text-sm text-gray-500">View items in your cart</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link href="/dashboard/settings" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Account Settings</h3>
              <p className="text-sm text-gray-500">Update name, email, password</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Logout</h3>
              <p className="text-sm text-gray-500">Sign out of your account</p>
            </div>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
