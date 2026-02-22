'use client'

import { useState } from 'react'
import { FormField, Input, Select, Textarea } from '../FormField'

interface Props {
  onChange: (data: Record<string, unknown>) => void
}

export default function DisengagementForm({ onChange }: Props) {
  const [data, setData] = useState({
    client_name: '',
    effective_date: '',
    reason_internal: 'client_request',
    outstanding_balance: '',
    file_retrieval_instructions: '',
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
          placeholder="e.g. Thomas Anderson"
          value={data.client_name}
          onChange={(e) => update('client_name', e.target.value)}
        />
      </FormField>

      <FormField label="Effective Date">
        <Input
          type="date"
          value={data.effective_date}
          onChange={(e) => update('effective_date', e.target.value)}
        />
      </FormField>

      <FormField
        label="Reason (Internal Only)"
        hint="This affects the tone of the letter but is never disclosed to the client."
      >
        <Select value={data.reason_internal} onChange={(e) => update('reason_internal', e.target.value)}>
          <option value="client_request">Client Request</option>
          <option value="non_payment">Non-Payment</option>
          <option value="scope_mismatch">Scope Mismatch</option>
          <option value="ethical">Ethical Concerns</option>
        </Select>
      </FormField>

      <FormField label="Outstanding Balance" hint="Optional — leave blank if none">
        <Input
          placeholder="e.g. $850"
          value={data.outstanding_balance}
          onChange={(e) => update('outstanding_balance', e.target.value)}
        />
      </FormField>

      <FormField label="File Retrieval Instructions">
        <Textarea
          placeholder="e.g. Your documents will be available for pickup at our office for 30 days. Please call to schedule a convenient time..."
          value={data.file_retrieval_instructions}
          onChange={(e) => update('file_retrieval_instructions', e.target.value)}
          rows={4}
        />
      </FormField>
    </div>
  )
}
