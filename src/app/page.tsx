import Link from 'next/link'

const DOCUMENT_EXAMPLES = [
  { icon: '📋', label: 'Engagement Letter', desc: 'Professional, signed-ready scope agreements' },
  { icon: '📄', label: 'Tax Return Cover Letter', desc: 'Clear summaries clients actually read' },
  { icon: '📁', label: 'Tax Organizer Request', desc: 'Get the right documents, on time' },
  { icon: '📅', label: 'Extension Notification', desc: 'Reassuring and professional' },
  { icon: '👋', label: 'Welcome Letter', desc: 'Start client relationships right' },
  { icon: '🔒', label: 'Disengagement Letter', desc: 'End engagements with care' },
  { icon: '✏️', label: 'Scope Change Addendum', desc: 'Document changes cleanly' },
  { icon: '⚠️', label: 'IRS Notice Summary', desc: 'Turn IRS jargon into plain English' },
]

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['5 documents/month', '3 document types', 'PDF export', 'Last 10 documents'],
    cta: 'Get started free',
    href: '/login',
    primary: false,
  },
  {
    name: 'Pro',
    price: '$39',
    period: '/mo',
    features: ['Unlimited documents', 'All 8 document types', 'Full history', 'PDF export', '14-day free trial'],
    cta: 'Start free trial',
    href: '/login',
    primary: true,
    badge: 'Most popular',
  },
  {
    name: 'Team',
    price: '$79',
    period: '/mo',
    features: ['Everything in Pro', 'Team collaboration', 'Priority support', 'Custom templates', '14-day free trial'],
    cta: 'Start free trial',
    href: '/login',
    primary: false,
  },
]

export default function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--cream)', fontFamily: 'DM Sans, sans-serif' }}
    >
      {/* Nav */}
      <nav
        className="sticky top-0 z-40 border-b border-[var(--rule)]"
        style={{ background: 'rgba(250, 248, 244, 0.95)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm font-medium"
              style={{ backgroundColor: 'var(--accent)', fontFamily: 'Fraunces, serif', fontSize: '16px' }}
            >
              D
            </div>
            <span
              className="text-xl font-light text-[var(--ink)]"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              Draftly
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 border border-[var(--rule)]"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          Built for accountants and bookkeepers
        </div>

        <h1
          className="text-5xl sm:text-6xl font-light text-[var(--ink)] leading-tight mb-6"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          Professional client documents,{' '}
          <em className="italic not-italic" style={{ color: 'var(--accent)' }}>
            in seconds
          </em>
        </h1>

        <p className="text-lg text-[var(--ink-light)] max-w-xl mx-auto mb-8 leading-relaxed">
          Draftly generates polished, firm-branded engagement letters, tax cover letters,
          IRS notice summaries, and more — ready to send in under 2 minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="px-6 py-3 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Start free — no credit card
          </Link>
          <Link
            href="#how-it-works"
            className="px-6 py-3 rounded-md text-sm font-medium border border-[var(--rule)] text-[var(--ink-light)] hover:text-[var(--ink)] hover:border-[var(--ink-light)] transition-colors"
          >
            See how it works
          </Link>
        </div>

        <p className="mt-4 text-xs text-[var(--ink-faint)]">
          Free plan: 5 documents/month, no credit card required
        </p>
      </section>

      {/* Document preview mockup */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div
          className="rounded-xl border border-[var(--rule)] overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}
        >
          {/* Fake browser bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--rule)]" style={{ background: 'var(--paper)' }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-300" />
              <div className="w-3 h-3 rounded-full bg-yellow-300" />
              <div className="w-3 h-3 rounded-full bg-green-300" />
            </div>
            <div
              className="flex-1 mx-4 px-3 py-1 rounded text-xs text-[var(--ink-faint)] border border-[var(--rule)]"
              style={{ background: 'var(--white)', maxWidth: '320px' }}
            >
              app.draftly.io/generate/engagement_letter
            </div>
          </div>

          {/* Split pane */}
          <div className="flex" style={{ height: '400px' }}>
            {/* Form side */}
            <div
              className="w-72 flex-shrink-0 border-r border-[var(--rule)] p-5 overflow-hidden"
              style={{ background: 'var(--paper)' }}
            >
              <div className="text-xs font-medium text-[var(--ink-faint)] uppercase tracking-wide mb-3">Firm Profile</div>
              {['Johnson & Associates CPA', 'Sarah Johnson, CPA'].map((v) => (
                <div key={v} className="mb-2 px-3 py-1.5 rounded border border-[var(--rule)] text-xs text-[var(--ink-light)]" style={{ background: 'var(--white)' }}>
                  {v}
                </div>
              ))}
              <div className="text-xs font-medium text-[var(--ink-faint)] uppercase tracking-wide mb-3 mt-4">Document Details</div>
              {[
                { label: 'Client Name', value: 'Mark & Julia Thompson' },
                { label: 'Services', value: 'Individual Tax, Bookkeeping' },
                { label: 'Fee', value: '$1,200 / flat fee' },
              ].map(({ label, value }) => (
                <div key={label} className="mb-3">
                  <div className="text-xs text-[var(--ink-faint)] mb-1">{label}</div>
                  <div className="px-3 py-1.5 rounded border border-[var(--rule)] text-xs text-[var(--ink)]" style={{ background: 'var(--white)' }}>
                    {value}
                  </div>
                </div>
              ))}
              <div
                className="mt-4 w-full py-2 rounded-md text-xs font-medium text-white text-center"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                ⚡ Generate Document
              </div>
            </div>

            {/* Preview side */}
            <div className="flex-1 p-8 overflow-hidden" style={{ background: 'var(--white)' }}>
              <div className="text-base font-medium text-[var(--ink)] mb-0.5" style={{ fontFamily: 'Fraunces, serif' }}>
                Johnson & Associates CPA
              </div>
              <div className="text-xs text-[var(--ink-faint)] mb-5">Sarah Johnson, CPA · sarah@johnsonandassc.com</div>
              <div className="text-xs text-[var(--ink-faint)] mb-4">February 22, 2026</div>
              <div className="space-y-2">
                <div className="text-xs text-[var(--ink)] leading-relaxed">
                  Dear Mark and Julia,
                </div>
                <div className="text-xs text-[var(--ink-light)] leading-relaxed">
                  Thank you for choosing Johnson & Associates CPA for your accounting needs. We are pleased to confirm our engagement for the 2025 tax year and look forward to supporting you.
                </div>
                <div className="text-xs text-[var(--ink-light)] leading-relaxed">
                  This letter outlines the scope of services we will provide, your responsibilities as our client, and our fee arrangement...
                </div>
                <div className="h-1.5 rounded shimmer w-4/5" style={{ marginTop: '8px' }} />
                <div className="h-1.5 rounded shimmer w-full" />
                <div className="h-1.5 rounded shimmer w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-light text-[var(--ink)]"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            From blank page to client-ready in minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Set up your firm profile',
              desc: 'Enter your firm name, your name, title, and contact info once. It appears in every document automatically.',
            },
            {
              step: '2',
              title: 'Fill in client details',
              desc: 'Select a document type and fill in a short form. No writing required — just the facts.',
            },
            {
              step: '3',
              title: 'Generate, edit, and send',
              desc: 'Claude writes a polished letter in seconds. Edit inline, copy to clipboard, or download as PDF.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium mx-auto mb-4"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {step}
              </div>
              <h3
                className="text-base font-medium text-[var(--ink)] mb-2"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                {title}
              </h3>
              <p className="text-sm text-[var(--ink-light)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Document types */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2
            className="text-3xl font-light text-[var(--ink)]"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            8 document types, one tool
          </h2>
          <p className="text-sm text-[var(--ink-light)] mt-2">
            Everything accountants write to clients, covered.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DOCUMENT_EXAMPLES.map((doc) => (
            <div
              key={doc.label}
              className="p-4 rounded-xl border border-[var(--rule)]"
              style={{ background: 'var(--white)' }}
            >
              <div className="text-2xl mb-2">{doc.icon}</div>
              <div className="text-sm font-medium text-[var(--ink)] mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
                {doc.label}
              </div>
              <div className="text-xs text-[var(--ink-faint)]">{doc.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2
            className="text-3xl font-light text-[var(--ink)]"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            Simple, transparent pricing
          </h2>
          <p className="text-sm text-[var(--ink-light)] mt-2">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-xl border ${
                plan.primary ? 'border-[var(--accent)]' : 'border-[var(--rule)]'
              } relative`}
              style={{
                background: plan.primary ? 'var(--accent-light)' : 'var(--white)',
                boxShadow: plan.primary ? '0 8px 40px rgba(45,90,61,0.15)' : '0 4px 24px rgba(0,0,0,0.06)',
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 left-6 text-xs font-medium px-3 py-1 rounded-full text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  {plan.badge}
                </div>
              )}
              <div
                className="text-xl font-light text-[var(--ink)] mb-1"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                {plan.name}
              </div>
              <div className="flex items-baseline gap-0.5 mb-4">
                <span className="text-3xl font-medium text-[var(--ink)]">{plan.price}</span>
                <span className="text-sm text-[var(--ink-light)]">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[var(--ink)]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block w-full text-center py-2.5 rounded-md text-sm font-medium transition-colors ${
                  plan.primary
                    ? 'text-white hover:opacity-90'
                    : 'border border-[var(--rule)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
                style={plan.primary ? { backgroundColor: 'var(--accent)' } : {}}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="max-w-4xl mx-auto px-6 py-20 text-center"
      >
        <div
          className="rounded-2xl p-12"
          style={{ background: 'var(--accent)', boxShadow: '0 8px 40px rgba(45,90,61,0.25)' }}
        >
          <h2
            className="text-3xl font-light text-white mb-3"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            Ready to stop writing from scratch?
          </h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Join accountants and bookkeepers who use Draftly to communicate professionally with every client.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium bg-white transition-opacity hover:opacity-90"
            style={{ color: 'var(--accent)' }}
          >
            Get started free — no credit card
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--rule)] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-white text-xs"
              style={{ backgroundColor: 'var(--accent)', fontFamily: 'Fraunces, serif' }}
            >
              D
            </div>
            <span className="text-sm text-[var(--ink-light)]">Draftly</span>
          </div>
          <p className="text-xs text-[var(--ink-faint)]">
            © {new Date().getFullYear()} Draftly. Built for accounting professionals.
          </p>
        </div>
      </footer>
    </div>
  )
}
