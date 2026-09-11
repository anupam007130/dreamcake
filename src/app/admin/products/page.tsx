'use client'

import { useState, useEffect } from 'react'
import { Product, Category } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react'
import axios from 'axios'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState({
    title: '', description: '', price: '', categoryId: '', primaryImage: '', images: [''], availability: true,
  })

  useEffect(() => {
    Promise.all([
      axios.get('/api/admin/products?limit=100'),
      axios.get('/api/categories'),
    ]).then(([prodRes, catRes]) => {
      setProducts(prodRes.data.data?.items || [])
      setCategories(catRes.data.data || [])
      setLoading(false)
    })
  }, [])

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setForm({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        categoryId: product.categoryId,
        primaryImage: product.primaryImage,
        images: product.images?.length ? product.images.map((img) => img.imageUrl) : [''],
        availability: product.availability,
      })
    } else {
      setEditingProduct(null)
      setForm({ title: '', description: '', price: '', categoryId: '', primaryImage: '', images: [''], availability: true })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    const data = {
      ...form,
      price: parseFloat(form.price),
      images: form.images.filter((img) => img.trim()),
    }

    if (editingProduct) {
      const res = await axios.put(`/api/admin/products/${editingProduct.id}`, data)
      if (res.data.success) {
        setProducts(products.map((p) => p.id === editingProduct.id ? res.data.data : p))
      }
    } else {
      const res = await axios.post('/api/admin/products', data)
      if (res.data.success) {
        setProducts([res.data.data, ...products])
      }
    }
    setShowModal(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    await axios.delete(`/api/admin/products/${id}`)
    setProducts(products.filter((p) => p.id !== id))
  }

  const toggleAvailability = async (product: Product) => {
    const res = await axios.put(`/api/admin/products/${product.id}`, {
      availability: !product.availability,
    })
    if (res.data.success) {
      setProducts(products.map((p) => p.id === product.id ? { ...p, availability: !p.availability } : p))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.primaryImage || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100'} alt="" className="w-12 h-12 rounded-lg object-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100' }} />
                      <div>
                        <p className="font-medium text-gray-900">{product.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name || '-'}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleAvailability(product)} className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                        {product.availability ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openModal(product)} className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <div className="space-y-4">
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl h-24" />
              <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl" />
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl">
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input placeholder="Primary Image URL" value={form.primaryImage} onChange={(e) => setForm({ ...form, primaryImage: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl" />
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Additional Images</label>
                {form.images.map((img, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input placeholder={`Image URL ${i + 1}`} value={img} onChange={(e) => { const newImages = [...form.images]; newImages[i] = e.target.value; setForm({ ...form, images: newImages }) }} className="flex-1 p-3 border border-gray-200 rounded-xl" />
                    {form.images.length > 1 && (
                      <button onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} className="text-red-500 hover:text-red-700 px-3">✕</button>
                    )}
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, images: [...form.images, ''] })} className="text-pink-600 text-sm font-medium hover:underline">+ Add Image</button>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.checked })} className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Available for purchase</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-medium hover:bg-pink-600">
                {editingProduct ? 'Update' : 'Create'}
              </button>
              <button onClick={() => setShowModal(false)} className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
