'use client'

import { useState } from 'react'
import { FormField, Input, Select, Textarea } from '../FormField'

interface Props {
  onChange: (data: Record<string, unknown>) => void
}

const NOTICE_TYPES = [
  { value: 'CP2000', label: 'CP2000 — Proposed Changes' },
  { value: 'CP501', label: 'CP501 — Balance Due Reminder' },
  { value: 'CP503', label: 'CP503 — Second Notice' },
  { value: 'CP504', label: 'CP504 — Final Notice Before Levy' },
  { value: 'CP11', label: 'CP11 — Changes to Tax Return' },
  { value: 'CP12', label: 'CP12 — Changes & Overpayment' },
  { value: 'LT11', label: 'LT11 — Final Notice of Intent to Levy' },
  { value: 'other', label: 'Other' },
]

export default function IrsNoticeForm({ onChange }: Props) {
  const [data, setData] = useState({
    client_name: '',
    notice_type: 'CP2000',
    what_notice_says: '',
    action_required: '',
    deadline: '',
    what_we_are_doing: '',
  })

  const update = (key: string, value: unknown) => {
    const next = { ...data, [key]: value }
    setData(next)
    onChange(next)
  }

  return (
    <div className="space-y-4">
      <FormField label="Client Name" required>
        <Input
          placeholder="e.g. Patricia & George Williams"
          value={data.client_name}
          onChange={(e) => update('client_name', e.target.value)}
        />
      </FormField>

      <FormField label="Notice Type">
        <Select value={data.notice_type} onChange={(e) => update('notice_type', e.target.value)}>
          {NOTICE_TYPES.map((n) => (
            <option key={n.value} value={n.value}>{n.label}</option>
          ))}
        </Select>
      </FormField>

      <FormField label="What the Notice Says" hint="Your plain-language summary">
        <Textarea
          placeholder="e.g. The IRS is proposing additional taxes of $4,200 because they believe you underreported income from a 1099 you received from a client..."
          value={data.what_notice_says}
          onChange={(e) => update('what_notice_says', e.target.value)}
          rows={4}
        />
      </FormField>

      <FormField label="Action Required by Client">
        <Textarea
          placeholder="e.g. Sign and return the enclosed authorization form so we can respond on your behalf..."
          value={data.action_required}
          onChange={(e) => update('action_required', e.target.value)}
        />
      </FormField>

      <FormField label="Response Deadline">
        <Input
          placeholder="e.g. March 30, 2025"
          value={data.deadline}
          onChange={(e) => update('deadline', e.target.value)}
        />
      </FormField>

      <FormField label="What We Are Doing">
        <Textarea
          placeholder="e.g. We are reviewing the notice and gathering your records to prepare a written response to the IRS..."
          value={data.what_we_are_doing}
          onChange={(e) => update('what_we_are_doing', e.target.value)}
        />
      </FormField>
    </div>
  )
}
