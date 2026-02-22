'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Profile {
  firm_name: string
  your_name: string
  title: string
  email: string
  phone: string
}

interface Subscription {
  plan: string
  status: string
  stripe_subscription_id?: string
}

interface Props {
  profile: Profile | null
  subscription: Subscription | null
}

const PLAN_INFO = {
  free: { label: 'Free', price: '$0/mo', color: 'var(--ink-faint)' },
  pro: { label: 'Pro', price: '$39/mo', color: 'var(--accent)' },
  team: { label: 'Team', price: '$79/mo', color: 'var(--accent-mid)' },
}

export default function SettingsClient({ profile, subscription }: Props) {
  const router = useRouter()
  const plan = (subscription?.plan as 'free' | 'pro' | 'team') || 'free'
  const planInfo = PLAN_INFO[plan]

  const [formData, setFormData] = useState<Profile>({
    firm_name: profile?.firm_name || '',
    your_name: profile?.your_name || '',
    title: profile?.title || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [billingLoading, setBillingLoading] = useState<string | null>(null)

  const update = (key: keyof Profile, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }))

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: err } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...formData })
      if (err) throw err

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleSubscribe = async (planName: 'pro' | 'team') => {
    setBillingLoading(planName)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else throw new Error('No checkout URL')
    } catch {
      setError('Failed to start checkout. Please try again.')
    } finally {
      setBillingLoading(null)
    }
  }

  const handleManageBilling = async () => {
    setBillingLoading('portal')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setError('Failed to open billing portal.')
    } finally {
      setBillingLoading(null)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const inputClass =
    'w-full px-3 py-2 rounded-md border border-[var(--rule)] bg-white text-sm text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors'

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto space-y-8">
      <h1
        className="text-2xl font-light text-[var(--ink)]"
        style={{ fontFamily: 'Fraunces, serif' }}
      >
        Settings
      </h1>

      {/* Profile Section */}
      <section
        className="rounded-xl border border-[var(--rule)] overflow-hidden"
        style={{ background: 'var(--white)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
      >
        <div className="px-6 py-4 border-b border-[var(--rule)]" style={{ background: 'var(--paper)' }}>
          <h2 className="text-sm font-medium text-[var(--ink)]">Firm Profile</h2>
          <p className="text-xs text-[var(--ink-light)] mt-0.5">
            This information appears in all generated documents.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-light)] mb-1.5">
                Firm Name <span className="text-red-400">*</span>
              </label>
              <input
                required
                className={inputClass}
                value={formData.firm_name}
                onChange={(e) => update('firm_name', e.target.value)}
                placeholder="Johnson & Associates CPA"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-light)] mb-1.5">
                Your Name <span className="text-red-400">*</span>
              </label>
              <input
                required
                className={inputClass}
                value={formData.your_name}
                onChange={(e) => update('your_name', e.target.value)}
                placeholder="Sarah Johnson"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-light)] mb-1.5">Title</label>
              <input
                className={inputClass}
                value={formData.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="CPA, EA, Bookkeeper"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-light)] mb-1.5">Email</label>
              <input
                type="email"
                className={inputClass}
                value={formData.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="sarah@yourfirm.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-light)] mb-1.5">Phone</label>
              <input
                className={inputClass}
                value={formData.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="(555) 867-5309"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md text-sm font-medium text-white transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            {saved && (
              <span className="text-sm text-[var(--accent)] flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Saved
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Billing Section */}
      <section
        id="billing"
        className="rounded-xl border border-[var(--rule)] overflow-hidden"
        style={{ background: 'var(--white)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
      >
        <div className="px-6 py-4 border-b border-[var(--rule)]" style={{ background: 'var(--paper)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-[var(--ink)]">Billing & Plan</h2>
              <p className="text-xs text-[var(--ink-light)] mt-0.5">
                Current plan:{' '}
                <span className="font-medium" style={{ color: planInfo.color }}>
                  {planInfo.label}
                </span>{' '}
                — {planInfo.price}
              </p>
            </div>
            {plan !== 'free' && (
              <button
                onClick={handleManageBilling}
                disabled={billingLoading === 'portal'}
                className="text-xs font-medium text-[var(--accent)] hover:underline disabled:opacity-50"
              >
                {billingLoading === 'portal' ? 'Loading...' : 'Manage billing →'}
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {plan === 'free' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pro */}
              <div
                className="p-5 rounded-xl border-2 border-[var(--accent)] relative"
                style={{ background: 'var(--accent-light)' }}
              >
                <div
                  className="absolute -top-2.5 left-5 text-xs font-medium px-2.5 py-0.5 rounded-full text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  Most popular
                </div>
                <div
                  className="text-lg font-light mb-0.5"
                  style={{ fontFamily: 'Fraunces, serif', color: 'var(--accent)' }}
                >
                  Pro
                </div>
                <div className="text-2xl font-medium text-[var(--ink)] mb-3">
                  $39<span className="text-sm font-normal text-[var(--ink-light)]">/mo</span>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {['Unlimited documents', 'All 8 document types', 'Full history', 'PDF export', '14-day free trial'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[var(--ink)]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe('pro')}
                  disabled={billingLoading === 'pro'}
                  className="w-full py-2 rounded-md text-sm font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {billingLoading === 'pro' ? 'Loading...' : 'Start free trial →'}
                </button>
              </div>

              {/* Team */}
              <div
                className="p-5 rounded-xl border border-[var(--rule)]"
                style={{ background: 'var(--white)' }}
              >
                <div
                  className="text-lg font-light mb-0.5"
                  style={{ fontFamily: 'Fraunces, serif', color: 'var(--ink)' }}
                >
                  Team
                </div>
                <div className="text-2xl font-medium text-[var(--ink)] mb-3">
                  $79<span className="text-sm font-normal text-[var(--ink-light)]">/mo</span>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {['Everything in Pro', 'Team collaboration', 'Priority support', 'Custom templates', '14-day free trial'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[var(--ink)]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mid)" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe('team')}
                  disabled={billingLoading === 'team'}
                  className="w-full py-2 rounded-md text-sm font-medium border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors disabled:opacity-50"
                >
                  {billingLoading === 'team' ? 'Loading...' : 'Start free trial →'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: 'var(--paper)' }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                ✓
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--ink)]">
                  You&apos;re on the {planInfo.label} plan
                </p>
                <p className="text-xs text-[var(--ink-light)]">
                  Status: {subscription?.status || 'active'} · {planInfo.price}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sign out */}
      <section
        className="rounded-xl border border-[var(--rule)] p-6"
        style={{ background: 'var(--white)' }}
      >
        <h2 className="text-sm font-medium text-[var(--ink)] mb-3">Account</h2>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 rounded-md text-sm font-medium border border-[var(--rule)] text-[var(--ink-light)] hover:border-red-300 hover:text-red-600 transition-colors"
        >
          Sign out
        </button>
      </section>
    </div>
  )
}
