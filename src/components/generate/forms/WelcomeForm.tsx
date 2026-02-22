'use client'

import { useState } from 'react'
import { FormField, Input, Textarea } from '../FormField'

interface Props {
  onChange: (data: Record<string, unknown>) => void
}

export default function WelcomeForm({ onChange }: Props) {
  const [data, setData] = useState({
    client_name: '',
    services_signed_up: '',
    portal_link: '',
    first_steps: '',
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
          placeholder="e.g. Jennifer & Michael Park"
          value={data.client_name}
          onChange={(e) => update('client_name', e.target.value)}
        />
      </FormField>

      <FormField label="Services Signed Up For">
        <Textarea
          placeholder="e.g. Annual tax preparation, quarterly bookkeeping, and payroll processing"
          value={data.services_signed_up}
          onChange={(e) => update('services_signed_up', e.target.value)}
        />
      </FormField>

      <FormField label="Client Portal Link" hint="Optional — link to your client portal">
        <Input
          placeholder="e.g. https://portal.yourfirm.com"
          value={data.portal_link}
          onChange={(e) => update('portal_link', e.target.value)}
          type="url"
        />
      </FormField>

      <FormField label="First Steps / Next 30 Days" hint="What happens after signing up?">
        <Textarea
          placeholder="e.g. We will schedule an onboarding call, send you access to our secure portal, and collect last year's tax return..."
          value={data.first_steps}
          onChange={(e) => update('first_steps', e.target.value)}
          rows={4}
        />
      </FormField>
    </div>
  )
}
