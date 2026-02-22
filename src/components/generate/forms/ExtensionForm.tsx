'use client'

import { useState } from 'react'
import { FormField, Input, Select, Toggle } from '../FormField'

interface Props {
  onChange: (data: Record<string, unknown>) => void
}

export default function ExtensionForm({ onChange }: Props) {
  const currentYear = new Date().getFullYear()
  const [data, setData] = useState({
    client_name: '',
    tax_year: String(currentYear - 1),
    entity_type: 'individual',
    extension_deadline: '',
    reason: 'waiting_on_k1s',
    estimated_payment_required: false,
    estimated_payment_amount: '',
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
          placeholder="e.g. David & Linda Chen"
          value={data.client_name}
          onChange={(e) => update('client_name', e.target.value)}
        />
      </FormField>

      <FormField label="Tax Year">
        <Select value={data.tax_year} onChange={(e) => update('tax_year', e.target.value)}>
          {[currentYear - 1, currentYear - 2, currentYear - 3].map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </Select>
      </FormField>

      <FormField label="Entity Type">
        <Select value={data.entity_type} onChange={(e) => update('entity_type', e.target.value)}>
          <option value="individual">Individual</option>
          <option value="s_corp">S Corporation</option>
          <option value="llc">LLC</option>
          <option value="partnership">Partnership</option>
          <option value="c_corp">C Corporation</option>
        </Select>
      </FormField>

      <FormField label="Extension Deadline">
        <Input
          placeholder="e.g. October 15, 2025"
          value={data.extension_deadline}
          onChange={(e) => update('extension_deadline', e.target.value)}
        />
      </FormField>

      <FormField label="Reason for Extension">
        <Select value={data.reason} onChange={(e) => update('reason', e.target.value)}>
          <option value="waiting_on_k1s">Waiting on K-1s</option>
          <option value="missing_documents">Missing Documents</option>
          <option value="complexity">Return Complexity</option>
          <option value="other">Other</option>
        </Select>
      </FormField>

      <FormField label="">
        <Toggle
          checked={data.estimated_payment_required}
          onChange={(v) => update('estimated_payment_required', v)}
          label="Estimated tax payment required"
        />
      </FormField>

      {data.estimated_payment_required && (
        <FormField label="Estimated Payment Amount">
          <Input
            placeholder="e.g. $3,500"
            value={data.estimated_payment_amount}
            onChange={(e) => update('estimated_payment_amount', e.target.value)}
          />
        </FormField>
      )}
    </div>
  )
}
