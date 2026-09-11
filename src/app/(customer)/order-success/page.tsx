'use client'

import Link from 'next/link'
import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import { CheckCircle, Package, ShoppingBag } from 'lucide-react'

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 animate-scale-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>

          <p className="text-gray-600 text-lg mb-8">
            Thank you for ordering from Dream Cake. Your delicious cake is being prepared with love!
          </p>

          <div className="bg-pink-50 rounded-2xl p-6 mb-8">
            <p className="text-sm text-gray-600 mb-1">What happens next?</p>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-pink-500" />
                <span className="text-gray-700">We&apos;ll confirm your order shortly</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-pink-500" />
                <span className="text-gray-700">Your cake will be freshly baked</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-pink-500" />
                <span className="text-gray-700">Delivered right to your doorstep</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Track Order
            </Link>
            <Link
              href="/cakes"
              className="border-2 border-pink-500 text-pink-600 px-8 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
