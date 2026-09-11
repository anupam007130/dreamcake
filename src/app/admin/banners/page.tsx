'use client'

import { useState, useEffect } from 'react'
import { Banner } from '@/types'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [form, setForm] = useState({ imageUrl: '', heading: '', subtitle: '', buttonText: '', buttonLink: '', sortOrder: 0 })

  useEffect(() => {
    axios.get('/api/admin/banners').then((res) => {
      setBanners(res.data.data || [])
      setLoading(false)
    })
  }, [])

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner)
      setForm({ imageUrl: banner.imageUrl, heading: banner.heading, subtitle: banner.subtitle || '', buttonText: banner.buttonText || '', buttonLink: banner.buttonLink || '', sortOrder: banner.sortOrder })
    } else {
      setEditingBanner(null)
      setForm({ imageUrl: '', heading: '', subtitle: '', buttonText: '', buttonLink: '', sortOrder: 0 })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (editingBanner) {
      const res = await axios.put(`/api/admin/banners/${editingBanner.id}`, form)
      if (res.data.success) setBanners(banners.map((b) => b.id === editingBanner.id ? res.data.data : b))
    } else {
      const res = await axios.post('/api/admin/banners', form)
      if (res.data.success) setBanners([...banners, res.data.data])
    }
    setShowModal(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    await axios.delete(`/api/admin/banners/${id}`)
    setBanners(banners.filter((b) => b.id !== id))
  }

  const toggleActive = async (banner: Banner) => {
    const res = await axios.put(`/api/admin/banners/${banner.id}`, { isActive: !banner.isActive })
    if (res.data.success) setBanners(banners.map((b) => b.id === banner.id ? { ...b, isActive: !b.isActive } : b))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => openModal()} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Banner
        </button>
      </div>

      <div className="grid gap-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <img src={banner.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'} alt="" className="w-32 h-20 object-cover rounded-lg" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' }} />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{banner.heading}</h3>
              <p className="text-sm text-gray-500">{banner.subtitle}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {banner.isActive ? 'Active' : 'Inactive'}
            </span>
            <div className="flex gap-2">
              <button onClick={() => toggleActive(banner)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => openModal(banner)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(banner.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">{editingBanner ? 'Edit Banner' : 'Add Banner'}</h2>
            <div className="space-y-4">
              <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl" />
              <input placeholder="Heading" value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl" />
              <input placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl" />
              <input placeholder="Button Text" value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl" />
              <input placeholder="Button Link" value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl" />
              <input type="number" placeholder="Sort Order" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) })} className="w-full p-3 border border-gray-200 rounded-xl" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-medium hover:bg-pink-600">Save</button>
              <button onClick={() => setShowModal(false)} className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
