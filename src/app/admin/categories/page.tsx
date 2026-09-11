'use client'

import { useState, useEffect } from 'react'
import { Category } from '@/types'
import { Plus, Edit, Trash2 } from 'lucide-react'
import axios from 'axios'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', description: '', sortOrder: 0 })

  useEffect(() => {
    axios.get('/api/categories').then((res) => {
      setCategories(res.data.data || [])
      setLoading(false)
    })
  }, [])

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setForm({ name: category.name, description: category.description || '', sortOrder: category.sortOrder })
    } else {
      setEditingCategory(null)
      setForm({ name: '', description: '', sortOrder: 0 })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (editingCategory) {
      const res = await axios.put(`/api/admin/categories/${editingCategory.id}`, form)
      if (res.data.success) setCategories(categories.map((c) => c.id === editingCategory.id ? res.data.data : c))
    } else {
      const res = await axios.post('/api/categories', form)
      if (res.data.success) setCategories([...categories, res.data.data])
    }
    setShowModal(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    try {
      await axios.delete(`/api/admin/categories/${id}`)
      setCategories(categories.filter((c) => c.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.error || 'Cannot delete category')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => openModal()} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Slug</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Products</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cat.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cat._count?.products || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
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
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <div className="space-y-4">
              <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl" />
              <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl" />
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
