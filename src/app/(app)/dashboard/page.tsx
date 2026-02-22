import Link from 'next/link'
import { DOCUMENT_TYPES } from '@/types'
import { createClient } from '@/lib/supabase/server'

async function getUserData() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { profile: null, plan: 'free', docsThisMonth: 0 }

    const [profileRes, subRes, docsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('subscriptions').select('plan').eq('user_id', user.id).single(),
      supabase.from('documents')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    ])

    return {
      profile: profileRes.data,
      plan: subRes.data?.plan || 'free',
      docsThisMonth: docsRes.count || 0,
    }
  } catch {
    return { profile: null, plan: 'free', docsThisMonth: 0 }
  }
}

export default async function DashboardPage() {
  const { profile, plan, docsThisMonth } = await getUserData()
  const isFree = plan === 'free'
  const freeTypes = ['engagement_letter', 'welcome', 'tax_cover']

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-light text-[var(--ink)] mb-1"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          {profile?.firm_name
            ? `Welcome back, ${profile.your_name?.split(' ')[0] || 'there'}`
            : 'Welcome to Draftly'}
        </h1>
        <p className="text-[var(--ink-light)] text-sm">
          Select a document type to get started.
        </p>

        {isFree && (
          <div
            className="mt-4 inline-flex items-center gap-3 px-4 py-2.5 rounded-lg border border-[var(--rule)] text-sm"
            style={{ background: 'var(--paper)' }}
          >
            <span className="text-[var(--ink-light)]">
              <span className="font-medium text-[var(--ink)]">{docsThisMonth}/5</span> documents used this month
            </span>
            {docsThisMonth >= 5 && (
              <Link
                href="/settings#billing"
                className="px-3 py-1 rounded-md text-xs font-medium text-white"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Upgrade
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Document type grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DOCUMENT_TYPES.map((doc) => {
          const locked = isFree && !freeTypes.includes(doc.id)
          return (
            <div key={doc.id} className="relative">
              {locked ? (
                <div
                  className="h-full p-5 rounded-xl border border-[var(--rule)] cursor-not-allowed opacity-70"
                  style={{ background: 'var(--paper)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{doc.icon}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                    >
                      Pro
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-[var(--ink)] mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
                    {doc.label}
                  </h3>
                  <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
                    {doc.description}
                  </p>
                  <Link
                    href="/settings#billing"
                    className="mt-4 block text-center text-xs font-medium py-1.5 px-3 rounded-md border border-[var(--rule)] text-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors"
                  >
                    Upgrade to unlock
                  </Link>
                </div>
              ) : (
                <Link
                  href={`/generate/${doc.id}`}
                  className="group block h-full p-5 rounded-xl border border-[var(--rule)] hover:border-[var(--accent)] hover:shadow-md transition-all"
                  style={{ background: 'var(--white)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
                >
                  <div className="text-2xl mb-3">{doc.icon}</div>
                  <h3
                    className="text-sm font-medium text-[var(--ink)] mb-1 group-hover:text-[var(--accent)] transition-colors"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    {doc.label}
                  </h3>
                  <p className="text-xs text-[var(--ink-light)] leading-relaxed">
                    {doc.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[var(--accent)]">
                    Generate
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-0.5 transition-transform">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* Onboarding prompt */}
      {!profile && (
        <div
          className="mt-8 p-5 rounded-xl border border-[var(--rule)]"
          style={{ background: 'var(--paper)' }}
        >
          <h3 className="font-medium text-[var(--ink)] mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
            Set up your firm profile
          </h3>
          <p className="text-sm text-[var(--ink-light)] mb-3">
            Add your firm&apos;s details so they appear in every document you generate.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Set up profile
          </Link>
        </div>
      )}
    </div>
  )
}
