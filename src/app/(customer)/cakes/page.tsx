'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import ProductCard from '@/components/customer/ProductCard'
import { Product, Category } from '@/types'
import { Search, Filter, X } from 'lucide-react'
import axios from 'axios'

export default function CakesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    axios.get('/api/categories').then((res) => setCategories(res.data.data || []))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('limit', '12')
    if (search) params.set('search', search)
    if (selectedCategory) params.set('category', selectedCategory)

    axios.get(`/api/products?${params.toString()}`).then((res) => {
      setProducts(res.data.data?.items || [])
      setTotalPages(res.data.data?.totalPages || 1)
      setLoading(false)
    })
  }, [page, search, selectedCategory])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Our Cake Collection</h1>
          <p className="text-white/80 text-lg">Discover our delicious range of freshly baked cakes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cakes..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => { setSelectedCategory(''); setPage(1) }}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                !selectedCategory
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); setPage(1) }}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No cakes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
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
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
