'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function OnboardingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firm_name: '',
    your_name: '',
    title: '',
    email: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Upsert profile
      const { error: profileErr } = await supabase.from('profiles').upsert({
        id: user.id,
        ...formData,
      })
      if (profileErr) throw profileErr

      // Create default subscription record
      await supabase.from('subscriptions').upsert({
        user_id: user.id,
        plan: 'free',
        status: 'active',
      }, { onConflict: 'user_id' })

      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 rounded-md border border-[var(--rule)] bg-white text-sm text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors'

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'var(--cream)' }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm font-medium"
              style={{ backgroundColor: 'var(--accent)', fontFamily: 'Fraunces, serif' }}
            >
              D
            </div>
            <span className="text-xl font-light" style={{ fontFamily: 'Fraunces, serif', color: 'var(--ink)' }}>
              Draftly
            </span>
          </Link>
          <h1
            className="text-2xl font-light text-[var(--ink)]"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            Set up your firm profile
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-light)]">
            This information will appear in every document you generate. You can update it anytime in Settings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[var(--rule)] p-6 space-y-4"
          style={{ background: 'var(--white)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <div>
            <label className="block text-xs font-medium text-[var(--ink-light)] mb-1.5">
              Firm Name <span className="text-red-400">*</span>
            </label>
            <input
              required
              className={inputClass}
              placeholder="e.g. Johnson & Associates CPA"
              value={formData.firm_name}
              onChange={(e) => update('firm_name', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink-light)] mb-1.5">
              Your Full Name <span className="text-red-400">*</span>
            </label>
            <input
              required
              className={inputClass}
              placeholder="e.g. Sarah Johnson"
              value={formData.your_name}
              onChange={(e) => update('your_name', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink-light)] mb-1.5">
              Title / Credentials
            </label>
            <input
              className={inputClass}
              placeholder="e.g. CPA, EA, Bookkeeper"
              value={formData.title}
              onChange={(e) => update('title', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink-light)] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              className={inputClass}
              placeholder="sarah@johnsonandassc.com"
              value={formData.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink-light)] mb-1.5">
              Phone Number
            </label>
            <input
              className={inputClass}
              placeholder="(555) 867-5309"
              value={formData.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md text-sm font-medium text-white transition-opacity disabled:opacity-50 mt-2"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {loading ? 'Saving...' : 'Save and go to dashboard →'}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--ink-faint)] mt-4">
          You can skip this and set it up later from Settings.{' '}
          <Link href="/dashboard" className="text-[var(--accent)] hover:underline">
            Skip for now
          </Link>
        </p>
      </div>
    </div>
  )
}
