import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DOCUMENT_TYPES, DocumentType } from '@/types'

function typeLabel(type: DocumentType) {
  return DOCUMENT_TYPES.find((d) => d.id === type)?.label || type
}

function typeIcon(type: DocumentType) {
  return DOCUMENT_TYPES.find((d) => d.id === type)?.icon || '📄'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getClientName(inputs: Record<string, unknown>): string {
  return (inputs.client_name as string) || 'Unknown client'
}

export default async function HistoryPage() {
  let documents: Array<{
    id: string
    document_type: DocumentType
    inputs: Record<string, unknown>
    output: string
    created_at: string
  }> = []

  let plan = 'free'

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .single()
      plan = sub?.plan || 'free'

      const limit = plan === 'free' ? 10 : 500
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      documents = (data || []) as typeof documents
    }
  } catch {
    // Supabase not configured
  }

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-light text-[var(--ink)]"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            Document History
          </h1>
          <p className="text-sm text-[var(--ink-light)] mt-0.5">
            {plan === 'free' ? 'Showing last 10 documents.' : `${documents.length} documents`}
            {plan === 'free' && (
              <Link href="/settings#billing" className="ml-1 text-[var(--accent)] hover:underline">
                Upgrade for full history.
              </Link>
            )}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Document
        </Link>
      </div>

      {documents.length === 0 ? (
        <div
          className="rounded-xl border border-[var(--rule)] p-12 text-center"
          style={{ background: 'var(--white)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--paper)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6"/>
            </svg>
          </div>
          <h2
            className="text-lg font-light text-[var(--ink)] mb-1"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            No documents yet
          </h2>
          <p className="text-sm text-[var(--ink-light)] mb-4">
            Generate your first document to see it here.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div
          className="rounded-xl border border-[var(--rule)] overflow-hidden"
          style={{ background: 'var(--white)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--rule)]" style={{ background: 'var(--paper)' }}>
                <th className="text-left px-5 py-3 text-xs font-medium text-[var(--ink-faint)] uppercase tracking-wide">
                  Document
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[var(--ink-faint)] uppercase tracking-wide hidden sm:table-cell">
                  Client
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[var(--ink-faint)] uppercase tracking-wide hidden md:table-cell">
                  Preview
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[var(--ink-faint)] uppercase tracking-wide">
                  Date
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, i) => (
                <tr
                  key={doc.id}
                  className={`border-b border-[var(--rule)] hover:bg-[var(--paper)] transition-colors ${
                    i === documents.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{typeIcon(doc.document_type)}</span>
                      <span className="font-medium text-[var(--ink)] text-sm">
                        {typeLabel(doc.document_type)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[var(--ink-light)] hidden sm:table-cell">
                    {getClientName(doc.inputs)}
                  </td>
                  <td className="px-5 py-4 text-[var(--ink-faint)] hidden md:table-cell max-w-xs">
                    <span className="truncate block text-xs">
                      {doc.output.slice(0, 80)}…
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[var(--ink-faint)] text-xs whitespace-nowrap">
                    {formatDate(doc.created_at)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/generate/${doc.document_type}`}
                      className="text-xs font-medium text-[var(--accent)] hover:underline"
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
