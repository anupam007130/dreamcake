'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore, useCartStore } from '@/store/useStore'
import { ShoppingCart, User, Menu, X, Cake, LogOut, ChevronDown, Bell } from 'lucide-react'
import axios from 'axios'

export default function Header() {
  const { user, logout } = useAuthStore()
  const { items } = useCartStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [brandName, setBrandName] = useState('Dream Cake')

  useEffect(() => {
    axios.get('/api/settings').then((res) => {
      if (res.data.data?.brand_name) setBrandName(res.data.data.brand_name)
    }).catch(() => {})
    if (user) {
      axios.get('/api/notifications').then((res) => {
        setUnreadCount(res.data.data?.unreadCount || 0)
      })
    }
  }, [user])

  const handleLogout = async () => {
    await axios.post('/api/auth/logout')
    logout()
    setUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Cake className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {brandName}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/cakes" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
              Cakes
            </Link>
            <Link href="/#about" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
              About
            </Link>
            <Link href="/#contact" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-scale-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user.fullName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Dashboard
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-pink-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-up">
            <nav className="flex flex-col gap-2">
              <Link href="/" className="px-4 py-2 text-gray-700 hover:bg-pink-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/cakes" className="px-4 py-2 text-gray-700 hover:bg-pink-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Cakes
              </Link>
              <Link href="/#about" className="px-4 py-2 text-gray-700 hover:bg-pink-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/#contact" className="px-4 py-2 text-gray-700 hover:bg-pink-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
