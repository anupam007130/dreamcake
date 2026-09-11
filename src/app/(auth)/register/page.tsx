'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Cake, User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import axios from 'axios'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required'
    else if (!/^[6-9]\d{9}$/.test(form.mobile)) newErrors.mobile = 'Invalid mobile number'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email'
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setLoading(true)
    try {
      const res = await axios.post('/api/auth/register', {
        fullName: form.fullName,
        mobile: form.mobile,
        email: form.email,
        password: form.password,
      })
      if (res.data.success) {
        setUser(res.data.data.user)
        setToken(res.data.data.token)
        router.push('/')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/4 right-1/4 text-6xl animate-float opacity-20">🎂</div>
      <div className="absolute bottom-1/3 left-1/4 text-5xl animate-float-delayed opacity-20">🍰</div>
      <div className="absolute top-1/2 left-1/3 text-4xl animate-float opacity-15">🧁</div>

      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-pink-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse-glow">
              <Cake className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-1">Join us for delicious cake deliveries</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-11 w-5 h-5 text-gray-400" />
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                className="pl-10"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                error={errors.fullName}
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-11 w-5 h-5 text-gray-400" />
              <Input
                label="Mobile Number"
                placeholder="Enter 10-digit mobile number"
                className="pl-10"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                error={errors.mobile}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-11 w-5 h-5 text-gray-400" />
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-11 w-5 h-5 text-gray-400" />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                className="pl-10 pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-11 w-5 h-5 text-gray-400" />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                className="pl-10"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-pink-600 font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
