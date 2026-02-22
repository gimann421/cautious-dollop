'use client'

import { useRef } from 'react'

interface DocumentPreviewProps {
  output: string
  isLoading: boolean
  profile?: {
    firm_name: string
    your_name: string
    title: string
    email: string
    phone: string
  } | null
  onOutputChange: (val: string) => void
  onCopy: () => void
  onDownload: () => void
  onRegenerate: () => void
  copied: boolean
}

export default function DocumentPreview({
  output,
  isLoading,
  profile,
  onOutputChange,
  onCopy,
  onDownload,
  onRegenerate,
  copied,
}: DocumentPreviewProps) {
  const editRef = useRef<HTMLDivElement>(null)

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      {output && !isLoading && (
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--rule)] bg-[var(--paper)]">
          <button
            onClick={onCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--rule)] bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                Copy
              </>
            )}
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--rule)] bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Download PDF
          </button>
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--rule)] bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors ml-auto"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
            Regenerate
          </button>
        </div>
      )}

      {/* Document area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 rounded shimmer w-1/3 mb-6" />
            <div className="h-4 rounded shimmer w-2/3" />
            <div className="h-4 rounded shimmer w-full" />
            <div className="h-4 rounded shimmer w-5/6" />
            <div className="h-4 rounded shimmer w-3/4" />
            <div className="h-4 rounded shimmer w-full mt-4" />
            <div className="h-4 rounded shimmer w-4/5" />
            <div className="h-4 rounded shimmer w-full" />
            <div className="h-4 rounded shimmer w-2/3" />
            <div className="h-4 rounded shimmer w-full mt-4" />
            <div className="h-4 rounded shimmer w-5/6" />
            <div className="h-4 rounded shimmer w-3/4" />
          </div>
        ) : output ? (
          <div
            className="max-w-2xl mx-auto"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {/* Letter header */}
            {profile && (
              <div className="mb-8">
                <div className="font-medium text-[var(--ink)]" style={{ fontFamily: 'Fraunces, serif', fontSize: '18px' }}>
                  {profile.firm_name}
                </div>
                <div className="text-sm text-[var(--ink-light)] mt-0.5">
                  {profile.your_name}{profile.title ? `, ${profile.title}` : ''}
                </div>
                {profile.email && (
                  <div className="text-xs text-[var(--ink-faint)]">{profile.email}</div>
                )}
                {profile.phone && (
                  <div className="text-xs text-[var(--ink-faint)]">{profile.phone}</div>
                )}
              </div>
            )}

            <div className="text-sm text-[var(--ink-light)] mb-6">{today}</div>

            {/* Editable document body */}
            <div
              ref={editRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => onOutputChange(e.currentTarget.innerText)}
              className="text-sm leading-relaxed text-[var(--ink)] outline-none whitespace-pre-wrap focus:ring-1 focus:ring-[var(--accent)] focus:ring-offset-2 rounded px-1 -mx-1"
            >
              {output}
            </div>

            {/* Signature line */}
            {profile && (
              <div className="mt-10">
                <div className="text-sm text-[var(--ink-light)]">Sincerely,</div>
                <div className="mt-6 text-sm font-medium text-[var(--ink)]">{profile.your_name}</div>
                {profile.title && (
                  <div className="text-xs text-[var(--ink-light)]">{profile.title}</div>
                )}
                {profile.firm_name && (
                  <div className="text-xs text-[var(--ink-light)]">{profile.firm_name}</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'var(--paper)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
              </svg>
            </div>
            <p className="text-sm text-[var(--ink-faint)]">
              Fill in the form and click Generate to preview your document here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
