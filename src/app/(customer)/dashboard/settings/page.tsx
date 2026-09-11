'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import { useAuthStore } from '@/store/useStore'
import { User, Lock, Save, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

export default function SettingsPage() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [profile, setProfile] = useState({ fullName: '', email: '', mobile: '' })
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [profileMsg, setProfileMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    setProfile({ fullName: user.fullName, email: user.email, mobile: user.mobile || '' })
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError('')
    setProfileMsg('')
    setProfileLoading(true)

    try {
      const res = await axios.put('/api/user/profile', { fullName: profile.fullName })
      if (res.data.success) {
        setUser({ ...user!, fullName: profile.fullName } as any)
        setProfileMsg('Profile updated successfully!')
      }
    } catch (err: any) {
      setProfileError(err.response?.data?.error || 'Update failed')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordMsg('')

    if (password.newPassword !== password.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    setPasswordLoading(true)
    try {
      const res = await axios.put('/api/user/password', {
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      })
      if (res.data.success) {
        setPasswordMsg('Password changed successfully!')
        setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }
    } catch (err: any) {
      setPasswordError(err.response?.data?.error || 'Password change failed')
    } finally {
      setPasswordLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          </div>

          {profileMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {profileMsg}
            </div>
          )}

          {profileError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {profileError}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={profile.mobile}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Mobile number cannot be changed</p>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>

          {passwordMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {passwordMsg}
            </div>
          )}

          {passwordError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={password.currentPassword}
                onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={password.newPassword}
                onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={password.confirmPassword}
                onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-5 h-5" />
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
