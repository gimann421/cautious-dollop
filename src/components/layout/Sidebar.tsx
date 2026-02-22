'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DOCUMENT_TYPES } from '@/types'
import { useState } from 'react'

interface SidebarProps {
  plan?: string
  userName?: string
}

export default function Sidebar({ plan = 'free', userName }: SidebarProps) {
  const pathname = usePathname()
  const [generateOpen, setGenerateOpen] = useState(
    pathname.startsWith('/generate')
  )

  const navLinkClass = (href: string) => {
    const active = pathname === href || pathname.startsWith(href + '/')
    return `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
      active
        ? 'bg-[var(--accent-light)] text-[var(--accent)] font-medium'
        : 'text-[var(--ink-light)] hover:bg-[var(--paper)] hover:text-[var(--ink)]'
    }`
  }

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 h-full bg-[var(--white)] border-r border-[var(--rule)] w-60 z-30"
      style={{ fontFamily: 'DM Sans, sans-serif' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--rule)]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm font-medium"
            style={{ backgroundColor: 'var(--accent)', fontFamily: 'Fraunces, serif' }}
          >
            D
          </div>
          <span
            className="text-lg font-light text-[var(--ink)]"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            Draftly
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <Link href="/dashboard" className={navLinkClass('/dashboard')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Dashboard
        </Link>

        {/* Generate expandable */}
        <div>
          <button
            onClick={() => setGenerateOpen(!generateOpen)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              pathname.startsWith('/generate')
                ? 'bg-[var(--accent-light)] text-[var(--accent)] font-medium'
                : 'text-[var(--ink-light)] hover:bg-[var(--paper)] hover:text-[var(--ink)]'
            }`}
          >
            <span className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Generate
            </span>
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={`transition-transform ${generateOpen ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {generateOpen && (
            <div className="mt-1 ml-3 pl-3 border-l border-[var(--rule)] space-y-0.5">
              {DOCUMENT_TYPES.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/generate/${doc.id}`}
                  className={`block px-2 py-1.5 rounded text-xs transition-colors ${
                    pathname === `/generate/${doc.id}`
                      ? 'text-[var(--accent)] font-medium'
                      : 'text-[var(--ink-light)] hover:text-[var(--ink)]'
                  }`}
                >
                  {doc.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/history" className={navLinkClass('/history')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3M3 12a9 9 0 1118 0 9 9 0 01-18 0z"/>
          </svg>
          History
        </Link>

        <Link href="/settings" className={navLinkClass('/settings')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          Settings
        </Link>
      </nav>

      {/* Bottom: upgrade banner or user info */}
      <div className="px-3 pb-4 space-y-3">
        {plan === 'free' && (
          <div
            className="p-3 rounded-lg border border-[var(--rule)] text-center"
            style={{ background: 'var(--accent-light)' }}
          >
            <p className="text-xs font-medium text-[var(--accent)] mb-1">Free Plan</p>
            <p className="text-xs text-[var(--ink-light)] mb-2">5 docs/month · 3 doc types</p>
            <Link
              href="/settings#billing"
              className="block w-full py-1.5 px-3 rounded-md text-xs font-medium text-white transition-colors"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Upgrade to Pro
            </Link>
          </div>
        )}

        {userName && (
          <div className="flex items-center gap-2 px-2 py-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
              style={{ backgroundColor: 'var(--accent-mid)' }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-[var(--ink-light)] truncate">{userName}</span>
          </div>
        )}
      </div>
    </aside>
  )
}
