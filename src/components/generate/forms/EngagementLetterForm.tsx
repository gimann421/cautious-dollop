'use client'

import { useState } from 'react'
import { FormField, Input, Select, CheckboxGroup, Toggle } from '../FormField'

interface Props {
  onChange: (data: Record<string, unknown>) => void
}

const SERVICE_OPTIONS = [
  { value: 'individual_tax', label: 'Individual Tax Preparation' },
  { value: 'bookkeeping', label: 'Bookkeeping' },
  { value: 'tax_planning', label: 'Tax Planning' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'advisory', label: 'Advisory Services' },
  { value: 'other', label: 'Other' },
]

export default function EngagementLetterForm({ onChange }: Props) {
  const [data, setData] = useState({
    client_name: '',
    services: [] as string[],
    fee_amount: '',
    fee_structure: 'flat_fee',
    engagement_year: '2025',
    doc_deadline: '',
    auto_renew: false,
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
          placeholder="e.g. Mark & Julia Thompson"
          value={data.client_name}
          onChange={(e) => update('client_name', e.target.value)}
        />
      </FormField>

      <FormField label="Services to Provide" required>
        <CheckboxGroup
          options={SERVICE_OPTIONS}
          value={data.services}
          onChange={(v) => update('services', v)}
        />
      </FormField>

      <FormField label="Fee Amount">
        <Input
          placeholder='e.g. $1,200'
          value={data.fee_amount}
          onChange={(e) => update('fee_amount', e.target.value)}
        />
      </FormField>

      <FormField label="Fee Structure">
        <Select value={data.fee_structure} onChange={(e) => update('fee_structure', e.target.value)}>
          <option value="flat_fee">Flat Fee</option>
          <option value="hourly">Hourly</option>
          <option value="monthly_retainer">Monthly Retainer</option>
        </Select>
      </FormField>

      <FormField label="Engagement Year">
        <Select value={data.engagement_year} onChange={(e) => update('engagement_year', e.target.value)}>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </Select>
      </FormField>

      <FormField label="Client Document Deadline" hint="e.g. February 15">
        <Input
          placeholder='e.g. February 15'
          value={data.doc_deadline}
          onChange={(e) => update('doc_deadline', e.target.value)}
        />
      </FormField>

      <FormField label="">
        <Toggle
          checked={data.auto_renew}
          onChange={(v) => update('auto_renew', v)}
          label="Auto-renews annually"
        />
      </FormField>
    </div>
  )
}
