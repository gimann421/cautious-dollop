'use client'

import { useState } from 'react'
import { FormField, Input, Select, Textarea } from '../FormField'

interface Props {
  onChange: (data: Record<string, unknown>) => void
}

export default function TaxCoverForm({ onChange }: Props) {
  const currentYear = new Date().getFullYear()
  const [data, setData] = useState({
    client_name: '',
    tax_year: String(currentYear - 1),
    refund_or_owe: 'refund',
    amount: '',
    key_notes: '',
    action_items: '',
    due_date: '',
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
          placeholder="e.g. Robert & Janet Williams"
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

      <FormField label="Return Result">
        <Select value={data.refund_or_owe} onChange={(e) => update('refund_or_owe', e.target.value)}>
          <option value="refund">Refund</option>
          <option value="balance_due">Balance Due</option>
          <option value="breakeven">Breakeven</option>
        </Select>
      </FormField>

      {data.refund_or_owe !== 'breakeven' && (
        <FormField label={data.refund_or_owe === 'refund' ? 'Refund Amount' : 'Balance Due Amount'}>
          <Input
            placeholder="e.g. $2,450"
            value={data.amount}
            onChange={(e) => update('amount', e.target.value)}
          />
        </FormField>
      )}

      <FormField label="Key Notes" hint="2–3 notable items from the return">
        <Textarea
          placeholder="e.g. Significant mortgage interest deduction; new dependent added this year..."
          value={data.key_notes}
          onChange={(e) => update('key_notes', e.target.value)}
        />
      </FormField>

      <FormField label="Action Items" hint="What does the client need to do?">
        <Textarea
          placeholder="e.g. Sign and return Form 8879; mail estimated tax payment by April 15..."
          value={data.action_items}
          onChange={(e) => update('action_items', e.target.value)}
        />
      </FormField>

      {data.refund_or_owe === 'balance_due' && (
        <FormField label="Payment Due Date">
          <Input
            placeholder="e.g. April 15, 2025"
            value={data.due_date}
            onChange={(e) => update('due_date', e.target.value)}
          />
        </FormField>
      )}
    </div>
  )
}
