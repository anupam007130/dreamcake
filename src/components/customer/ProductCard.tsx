'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Eye } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore, useAuthStore } from '@/store/useStore'
import { useState } from 'react'
import axios from 'axios'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuthStore()
  const { addItem } = useCartStore()
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      window.location.href = '/login'
      return
    }

    setAdding(true)
    try {
      await axios.post('/api/cart', { productId: product.id, quantity: 1 })
      addItem({
        id: '',
        productId: product.id,
        quantity: 1,
        product: {
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          primaryImage: product.primaryImage,
          availability: product.availability,
        },
      })
    } catch (error) {
      console.error('Add to cart error:', error)
    } finally {
      setAdding(false)
    }
  }

  return (
    <Link href={`/cakes/${product.slug}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-pink-200">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.primaryImage || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'
            }}
          />
          {!product.availability && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                Unavailable
              </span>
            </div>
          )}
          {product._count && product._count.reviews > 0 && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
              ⭐ {product._avg?.rating?.toFixed(1) || 'New'}
            </div>
          )}
        </div>

        <div className="p-4">
          {product.category && (
            <span className="text-xs font-medium text-pink-500 bg-pink-50 px-2 py-1 rounded-full">
              {product.category.name}
            </span>
          )}
          <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xl font-bold text-pink-600">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.availability || adding}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:from-pink-600 hover:to-purple-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <div className="bg-pink-50 text-pink-600 py-2 px-4 rounded-lg font-medium text-sm hover:bg-pink-100 transition-colors flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
