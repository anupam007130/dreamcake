'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import axios from 'axios'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('/api/admin/settings').then((res) => {
      setSettings(res.data.data || {})
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      await axios.put('/api/admin/settings', settings)
      setMessage('Settings saved successfully!')
    } catch (error) {
      setMessage('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value })
  }

  if (loading) {
    return <div className="bg-white rounded-2xl h-64 animate-pulse" />
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-xl ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">General Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Brand Name</label>
            <input value={settings.brand_name || ''} onChange={(e) => updateSetting('brand_name', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Contact Number</label>
            <input value={settings.contact_number || ''} onChange={(e) => updateSetting('contact_number', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Contact Email</label>
            <input value={settings.contact_email || ''} onChange={(e) => updateSetting('contact_email', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
            <input value={settings.address || ''} onChange={(e) => updateSetting('address', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">COD Advance Amount (₹)</label>
            <input type="number" value={settings.cod_advance_amount || '100'} onChange={(e) => updateSetting('cod_advance_amount', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Urgent Threshold (days)</label>
            <input type="number" value={settings.urgent_threshold_days || '2'} onChange={(e) => updateSetting('urgent_threshold_days', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Urgent Charge (₹)</label>
            <input type="number" value={settings.urgent_charge || '100'} onChange={(e) => updateSetting('urgent_charge', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Urgent Charge Enabled</label>
            <select value={settings.urgent_charge_enabled !== 'false' ? 'true' : 'false'} onChange={(e) => updateSetting('urgent_charge_enabled', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl">
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Delivery Charge (₹)</label>
            <input type="number" value={settings.delivery_charge || '0'} onChange={(e) => updateSetting('delivery_charge', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Minimum Delivery Days</label>
            <input type="number" value={settings.minimum_delivery_days || '1'} onChange={(e) => updateSetting('minimum_delivery_days', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Razorpay Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Payment Environment</label>
            <select value={settings.payment_environment || 'TEST'} onChange={(e) => updateSetting('payment_environment', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl">
              <option value="TEST">TEST</option>
              <option value="LIVE">LIVE</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Test Key ID</label>
            <input value={settings.razorpay_test_key_id || ''} onChange={(e) => updateSetting('razorpay_test_key_id', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="rzp_test_xxxxx" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Test Key Secret</label>
            <input type="password" value={settings.razorpay_test_key_secret || ''} onChange={(e) => updateSetting('razorpay_test_key_secret', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="••••••••" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Live Key ID</label>
            <input value={settings.razorpay_live_key_id || ''} onChange={(e) => updateSetting('razorpay_live_key_id', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="rzp_live_xxxxx" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Live Key Secret</label>
            <input type="password" value={settings.razorpay_live_key_secret || ''} onChange={(e) => updateSetting('razorpay_live_key_secret', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="••••••••" />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all flex items-center gap-2 disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  )
}
