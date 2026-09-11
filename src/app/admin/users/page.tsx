'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { formatDate } from '@/lib/utils'
import { Search, UserCheck, UserX, Ban, CheckCircle, Edit, X } from 'lucide-react'
import axios from 'axios'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editUser, setEditUser] = useState<any>(null)
  const [editForm, setEditForm] = useState({ fullName: '', email: '', mobile: '' })
  const [editLoading, setEditLoading] = useState(false)
  const [editMsg, setEditMsg] = useState('')
  const [editError, setEditError] = useState('')

  useEffect(() => {
    axios.get(`/api/admin/users?limit=100&search=${search}`).then((res) => {
      setUsers(res.data.data?.items || [])
      setLoading(false)
    })
  }, [search])

  const toggleUserStatus = async (userId: string, field: 'isActive' | 'isBlocked', currentValue: boolean) => {
    const res = await axios.put(`/api/admin/users/${userId}`, { [field]: !currentValue })
    if (res.data.success) {
      setUsers(users.map((u) => u.id === userId ? { ...u, [field]: !currentValue } : u))
    }
  }

  const openEdit = (user: any) => {
    setEditUser(user)
    setEditForm({ fullName: user.fullName, email: user.email, mobile: user.mobile })
    setEditMsg('')
    setEditError('')
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError('')
    setEditMsg('')
    setEditLoading(true)

    try {
      const res = await axios.put(`/api/admin/users/${editUser.id}`, editForm)
      if (res.data.success) {
        setUsers(users.map((u) => u.id === editUser.id ? { ...u, ...editForm } : u))
        setEditMsg('User updated successfully!')
        setTimeout(() => setEditUser(null), 1000)
      }
    } catch (err: any) {
      setEditError(err.response?.data?.error || 'Update failed')
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Orders</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Joined</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.mobile}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user._count?.orders || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isBlocked ? 'bg-red-100 text-red-800' :
                      user.isActive ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isBlocked ? 'Blocked' : user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-2 rounded-lg text-blue-500 hover:bg-blue-50"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id, 'isActive', user.isActive)}
                        className={`p-2 rounded-lg ${user.isActive ? 'text-green-500 hover:bg-green-50' : 'text-gray-500 hover:bg-gray-100'}`}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id, 'isBlocked', user.isBlocked)}
                        className={`p-2 rounded-lg ${user.isBlocked ? 'text-red-500 hover:bg-red-50' : 'text-orange-500 hover:bg-orange-50'}`}
                        title={user.isBlocked ? 'Unblock' : 'Block'}
                      >
                        {user.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
              <button onClick={() => setEditUser(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEdit} className="p-6 space-y-4">
              {editMsg && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{editMsg}</div>
              )}
              {editError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{editError}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  type="tel"
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
