'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore, useAuthStore } from '@/store/useStore'
import { ShoppingCart, Minus, Plus, ChevronLeft, ChevronRight, Truck, Shield, Clock } from 'lucide-react'
import axios from 'axios'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const { addItem } = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    axios.get(`/api/products/${slug}`).then((res) => {
      setProduct(res.data.data)
      setLoading(false)
    })
  }, [slug])

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    if (!product) return

    setAdding(true)
    try {
      await axios.post('/api/cart', { productId: product.id, quantity })
      addItem({
        id: '',
        productId: product.id,
        quantity,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gray-100 rounded-3xl h-96 animate-pulse" />
            <div className="space-y-4">
              <div className="bg-gray-100 h-8 w-3/4 rounded animate-pulse" />
              <div className="bg-gray-100 h-4 w-1/2 rounded animate-pulse" />
              <div className="bg-gray-100 h-12 w-1/3 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <Link href="/cakes" className="text-pink-600 font-semibold mt-4 inline-block">
            Browse Cakes
          </Link>
        </div>
      </div>
    )
  }

  const images = product.images?.length ? product.images.map((img) => img.imageUrl) : [product.primaryImage]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-pink-600">Home</Link>
          <span>/</span>
          <Link href="/cakes" className="hover:text-pink-600">Cakes</Link>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="animate-slide-up">
            <div className="relative bg-gray-50 rounded-3xl overflow-hidden aspect-square">
              <img
                src={images[currentImage]}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'
                }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {!product.availability && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      currentImage === i ? 'border-pink-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="animate-slide-up-delay-1">
            {product.category && (
              <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {product.category.name}
              </span>
            )}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.title}</h1>

            <div className="mt-6">
              <span className="text-4xl font-bold text-pink-600">{formatPrice(product.price)}</span>
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

            <div className="mt-8 flex items-center gap-4">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.availability || adding}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={() => {
                  handleAddToCart()
                  router.push('/cart')
                }}
                disabled={!product.availability}
                className="border-2 border-pink-500 text-pink-600 py-4 px-8 rounded-xl font-semibold text-lg hover:bg-pink-50 transition-all disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Truck className="w-6 h-6 text-pink-500" />
                <div>
                  <p className="text-sm font-medium">Fast Delivery</p>
                  <p className="text-xs text-gray-500">Same day available</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Shield className="w-6 h-6 text-pink-500" />
                <div>
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% safe</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Clock className="w-6 h-6 text-pink-500" />
                <div>
                  <p className="text-sm font-medium">Fresh Baked</p>
                  <p className="text-xs text-gray-500">Made to order</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
