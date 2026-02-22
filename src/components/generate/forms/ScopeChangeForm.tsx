'use client'

import { useState } from 'react'
import { FormField, Input, Textarea } from '../FormField'

interface Props {
  onChange: (data: Record<string, unknown>) => void
}

export default function ScopeChangeForm({ onChange }: Props) {
  const [data, setData] = useState({
    client_name: '',
    original_services: '',
    new_services: '',
    new_fee: '',
    effective_date: '',
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
          placeholder="e.g. Martinez Family Trust"
          value={data.client_name}
          onChange={(e) => update('client_name', e.target.value)}
        />
      </FormField>

      <FormField label="Original Services">
        <Textarea
          placeholder="e.g. Annual individual tax preparation only"
          value={data.original_services}
          onChange={(e) => update('original_services', e.target.value)}
        />
      </FormField>

      <FormField label="New / Added Services">
        <Textarea
          placeholder="e.g. Annual individual tax preparation plus monthly bookkeeping and quarterly payroll filing"
          value={data.new_services}
          onChange={(e) => update('new_services', e.target.value)}
        />
      </FormField>

      <FormField label="New Fee">
        <Input
          placeholder="e.g. $450/month"
          value={data.new_fee}
          onChange={(e) => update('new_fee', e.target.value)}
        />
      </FormField>

      <FormField label="Effective Date">
        <Input
          type="date"
          value={data.effective_date}
          onChange={(e) => update('effective_date', e.target.value)}
        />
      </FormField>
    </div>
  )
}
