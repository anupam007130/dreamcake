'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cake, Phone, Mail, MapPin } from 'lucide-react'
import axios from 'axios'

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    axios.get('/api/settings').then((res) => {
      setSettings(res.data.data || {})
    }).catch(() => {})
  }, [])

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Cake className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">{settings.brand_name || 'Dream Cake'}</span>
            </div>
            <p className="text-gray-400 text-sm">
              Premium cakes baked with love. Making your celebrations sweeter since 2024.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-pink-400 transition-colors">Home</Link></li>
              <li><Link href="/cakes" className="hover:text-pink-400 transition-colors">Cakes</Link></li>
              <li><Link href="/dashboard" className="hover:text-pink-400 transition-colors">My Account</Link></li>
              <li><Link href="/orders" className="hover:text-pink-400 transition-colors">My Orders</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Policies</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/terms" className="hover:text-pink-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-pink-400 transition-colors">Refund Policy</Link></li>
              <li><Link href="/delivery" className="hover:text-pink-400 transition-colors">Delivery Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              {settings.contact_number && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-pink-400" />
                  {settings.contact_number}
                </li>
              )}
              {settings.contact_email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-pink-400" />
                  {settings.contact_email}
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-pink-400 mt-0.5" />
                  {settings.address}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {settings.brand_name || 'Dream Cake'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
