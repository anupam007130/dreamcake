'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Cake, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import axios from 'axios'

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [form, setForm] = useState({ login: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post('/api/auth/login', form)
      if (res.data.success) {
        setUser(res.data.data.user)
        setToken(res.data.data.token)
        router.push('/')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-40 right-20 w-20 h-20 bg-pink-300/20 rounded-full animate-float" />
      <div className="absolute bottom-40 left-20 w-16 h-16 bg-purple-300/20 rounded-full animate-float-delayed" />

      <div className="absolute top-1/4 left-1/4 text-6xl animate-float opacity-20">🎂</div>
      <div className="absolute bottom-1/4 right-1/4 text-5xl animate-float-delayed opacity-20">🍰</div>
      <div className="absolute top-1/3 right-1/3 text-4xl animate-float opacity-15">🧁</div>

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
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
            <p className="text-gray-500 mt-1">Login to order your favorite cakes</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-11 w-5 h-5 text-gray-400" />
              <Input
                label="Email or Mobile Number"
                type="text"
                placeholder="Enter email or mobile"
                className="pl-10"
                value={form.login}
                onChange={(e) => setForm({ ...form, login: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-11 w-5 h-5 text-gray-400" />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loading}
            >
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-pink-600 font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
