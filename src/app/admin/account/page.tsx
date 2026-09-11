'use client'

import { useState, useEffect } from 'react'
import { Lock, Save, User, Mail } from 'lucide-react'
import axios from 'axios'

export default function AdminAccountPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [adminId, setAdminId] = useState('')

  useEffect(() => {
    axios.get('/api/admin/settings').then((res) => {
      const settings = res.data.data || {}
      setFullName(settings.admin_name || '')
      setEmail(settings.admin_email || '')
      setLoading(false)
    }).catch(() => {
      const admins = JSON.parse(localStorage.getItem('admin') || '{}')
      setFullName(admins.fullName || '')
      setEmail(admins.email || '')
      setAdminId(admins.id || '')
      setLoading(false)
    })
  }, [])

  const handleUpdateProfile = async () => {
    setSaving(true)
    setMessage('')
    try {
      const res = await axios.put('/api/admin/auth/change-password', { fullName, email })
      if (res.data.success) setMessage('Profile updated successfully!')
      else setMessage(res.data.error || 'Failed to update profile')
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters')
      return
    }
    setSaving(true)
    setMessage('')
    try {
      const res = await axios.put('/api/admin/auth/change-password', { currentPassword, newPassword })
      if (res.data.success) {
        setMessage('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setMessage(res.data.error || 'Failed to change password')
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="bg-white rounded-2xl h-64 animate-pulse" />

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">My Account</h1>

      {message && (
        <div className={`p-4 rounded-xl ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-pink-500" />
          Profile Info
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <button
            onClick={handleUpdateProfile}
            disabled={saving}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-pink-500" />
          Change Password
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <button
            onClick={handleChangePassword}
            disabled={saving}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Lock className="w-5 h-5" />
            {saving ? 'Saving...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  )
}
