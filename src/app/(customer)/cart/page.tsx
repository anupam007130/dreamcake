'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import { useCartStore, useAuthStore } from '@/store/useStore'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import axios from 'axios'

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { items, updateQuantity, removeItem, setItems } = useCartStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    axios.get('/api/cart').then((res) => {
      if (res.data.success) {
        setItems(res.data.data)
      }
      setLoading(false)
    })
  }, [user])

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await axios.put('/api/cart', { productId, quantity: newQuantity })
      updateQuantity(productId, newQuantity)
    } catch (error) {
      console.error('Update quantity error:', error)
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      await axios.delete(`/api/cart?productId=${productId}`)
      removeItem(productId)
    } catch (error) {
      console.error('Remove item error:', error)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some delicious cakes to get started</p>
            <Link
              href="/cakes"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              Browse Cakes
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id || item.productId} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex gap-4">
                    <img
                      src={item.product.primaryImage || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200'}
                      alt={item.product.title}
                      className="w-24 h-24 object-cover rounded-xl"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200'
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.title}</h3>
                      <p className="text-pink-600 font-bold mt-1">{formatPrice(item.product.price)}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-500 hover:text-red-600 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charge</span>
                    <span className="text-green-600">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-pink-600">{formatPrice(subtotal)}</span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/cakes"
                  className="mt-3 w-full text-center text-pink-600 font-medium py-2 block hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
