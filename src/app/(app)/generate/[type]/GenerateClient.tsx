'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { DocumentType, DOCUMENT_TYPES, Profile } from '@/types'
import DocumentPreview from '@/components/generate/DocumentPreview'
import EngagementLetterForm from '@/components/generate/forms/EngagementLetterForm'
import TaxCoverForm from '@/components/generate/forms/TaxCoverForm'
import TaxOrganizerForm from '@/components/generate/forms/TaxOrganizerForm'
import ExtensionForm from '@/components/generate/forms/ExtensionForm'
import WelcomeForm from '@/components/generate/forms/WelcomeForm'
import DisengagementForm from '@/components/generate/forms/DisengagementForm'
import ScopeChangeForm from '@/components/generate/forms/ScopeChangeForm'
import IrsNoticeForm from '@/components/generate/forms/IrsNoticeForm'
import { ReadOnlyField } from '@/components/generate/FormField'

interface Props {
  type: DocumentType
  profile: Profile | null
}

const FORM_MAP: Record<DocumentType, React.ComponentType<{ onChange: (d: Record<string, unknown>) => void }>> = {
  engagement_letter: EngagementLetterForm,
  tax_cover: TaxCoverForm,
  tax_organizer: TaxOrganizerForm,
  extension: ExtensionForm,
  welcome: WelcomeForm,
  disengagement: DisengagementForm,
  scope_change: ScopeChangeForm,
  irs_notice: IrsNoticeForm,
}

export default function GenerateClient({ type, profile }: Props) {
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const docConfig = DOCUMENT_TYPES.find((d) => d.id === type)
  const FormComponent = FORM_MAP[type]

  const handleGenerate = async () => {
    if (isLoading) return
    setIsLoading(true)
    setError('')
    setOutput('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: type,
          inputs: formData,
          profile: profile || {
            firm_name: 'Your Firm Name',
            your_name: 'Your Name',
            title: 'CPA',
            email: 'email@yourfirm.com',
            phone: '(555) 000-0000',
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'limit_reached') {
          setError(data.message)
        } else {
          setError(data.error || 'Something went wrong. Please try again.')
        }
        return
      }

      setOutput(data.output)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = useCallback(async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const handleDownload = useCallback(async () => {
    if (!output) return
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          output,
          profile,
          document_type: type,
        }),
      })
      if (!res.ok) throw new Error('PDF generation failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type.replace(/_/g, '-')}-${Date.now()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // Fallback: download as text
      const blob = new Blob([output], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type.replace(/_/g, '-')}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }, [output, profile, type])

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Form Panel */}
      <div
        className="w-full md:w-[380px] md:flex-shrink-0 flex flex-col border-r border-[var(--rule)] overflow-hidden"
        style={{ background: 'var(--paper)' }}
      >
        {/* Form header */}
        <div className="px-5 py-4 border-b border-[var(--rule)] flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </Link>
          <div>
            <h1
              className="text-base font-medium text-[var(--ink)] leading-tight"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              {docConfig?.label}
            </h1>
            <p className="text-xs text-[var(--ink-faint)] mt-0.5">{docConfig?.description}</p>
          </div>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Firm profile read-only */}
          <div
            className="p-4 rounded-lg border border-[var(--rule)] space-y-3"
            style={{ background: 'var(--white)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--ink-faint)] uppercase tracking-wide">
                Firm Profile
              </span>
              <Link
                href="/settings"
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Edit
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ReadOnlyField label="Firm Name" value={profile?.firm_name || 'Not set'} />
              <ReadOnlyField label="Your Name" value={profile?.your_name || 'Not set'} />
              <ReadOnlyField label="Title" value={profile?.title || ''} />
              <ReadOnlyField label="Email" value={profile?.email || ''} />
            </div>
          </div>

          {/* Document fields */}
          <div
            className="p-4 rounded-lg border border-[var(--rule)]"
            style={{ background: 'var(--white)' }}
          >
            <h2 className="text-xs font-medium text-[var(--ink-faint)] uppercase tracking-wide mb-4">
              Document Details
            </h2>
            <FormComponent onChange={setFormData} />
          </div>
        </div>

        {/* Generate button */}
        <div className="px-5 py-4 border-t border-[var(--rule)]" style={{ background: 'var(--white)' }}>
          {error && (
            <div className="mb-3 px-3 py-2 rounded-md bg-red-50 border border-red-100 text-xs text-red-600">
              {error}
              {error.includes('limit') && (
                <Link href="/settings#billing" className="block mt-1 font-medium text-[var(--accent)] hover:underline">
                  Upgrade to Pro →
                </Link>
              )}
            </div>
          )}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                Generate Document
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <DocumentPreview
          output={output}
          isLoading={isLoading}
          profile={profile}
          onOutputChange={setOutput}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onRegenerate={handleGenerate}
          copied={copied}
        />
      </div>
    </div>
  )
}
