'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import ProductCard from '@/components/customer/ProductCard'
import { Product, Banner } from '@/types'
import { Cake, Truck, Shield, ChevronRight, ChevronLeft, Clock, Gift } from 'lucide-react'
import axios from 'axios'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [popularProducts, setPopularProducts] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    axios.get('/api/products?limit=4&featured=true').then((res) => setFeaturedProducts(res.data.data?.items || []))
    axios.get('/api/products?limit=4&popular=true').then((res) => setPopularProducts(res.data.data?.items || []))
    axios.get('/api/products?limit=4&newest=true').then((res) => setNewProducts(res.data.data?.items || []))
    axios.get('/api/admin/banners').then((res) => {
      const active = (res.data.data || []).filter((b: Banner) => b.isActive)
      setBanners(active)
    })
  }, [])

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [banners.length])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />

        {banners.length > 0 ? (
          <>
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
              {banners.map((banner, i) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    i === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={banner.imageUrl}
                    alt={banner.heading}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                        {banner.heading}
                      </h2>
                      {banner.subtitle && (
                        <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/90 max-w-lg">{banner.subtitle}</p>
                      )}
                      {banner.buttonText && (
                        <Link
                          href={banner.buttonLink || '/cakes'}
                          className="inline-block mt-4 sm:mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                        >
                          {banner.buttonText}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {banners.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentBanner(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === currentBanner ? 'bg-pink-500 w-8' : 'bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <span className="inline-block bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  🎂 Premium Cake Shop
                </span>
                <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                  Freshly Baked{' '}
                  <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    Happiness
                  </span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                  Indulge in our handcrafted cakes made with the finest ingredients.
                  Every bite is a celebration of flavor and artistry.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/cakes"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
                  >
                    Order Now
                  </Link>
                  <Link
                    href="/cakes"
                    className="border-2 border-pink-500 text-pink-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-pink-50 transition-all"
                  >
                    Explore Cakes
                  </Link>
                </div>
              </div>
              <div className="relative animate-slide-up-delay-2">
                <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 border border-pink-100">
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
                    alt="Premium Cake"
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              How It <span className="text-pink-600">Works</span>
            </h2>
            <p className="mt-4 text-gray-600">Ordering your favorite cake is just 4 steps away</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Cake, title: 'Choose Your Cake', desc: 'Browse our delicious collection' },
              { icon: Clock, title: 'Select Delivery Date', desc: 'Pick when you want it delivered' },
              { icon: Shield, title: 'Make Payment', desc: 'Secure online payment via Razorpay' },
              { icon: Truck, title: 'Get Your Cake', desc: 'Fresh cake delivered to your door' },
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-pink-600" />
                </div>
                <div className="text-sm font-bold text-pink-500 mb-2">Step {i + 1}</div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-pink-50/50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Cakes</h2>
                <p className="text-gray-600 mt-1">Our most loved selections</p>
              </div>
              <Link href="/cakes" className="text-pink-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View All <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {popularProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Popular Cakes</h2>
                <p className="text-gray-600 mt-1">Customer favorites</p>
              </div>
              <Link href="/cakes" className="text-pink-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View All <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {newProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-purple-50/50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
                <p className="text-gray-600 mt-1">Fresh from our kitchen</p>
              </div>
              <Link href="/cakes" className="text-pink-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View All <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Why Choose <span className="text-pink-600">Sweet Cake</span>?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Cake, title: 'Premium Quality', desc: 'Made with finest ingredients' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Same day & urgent delivery' },
              { icon: Shield, title: 'Secure Payment', desc: '100% safe via Razorpay' },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl text-center hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Gift className="w-16 h-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Make Your Celebration Sweeter?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Order now and get fresh, delicious cakes delivered to your doorstep
          </p>
          <Link
            href="/cakes"
            className="inline-block bg-white text-pink-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl active:scale-95"
          >
            Order Your Cake Now 🎂
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
