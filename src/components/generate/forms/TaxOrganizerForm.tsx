'use client'

import { useState } from 'react'
import { FormField, Input, Select, CheckboxGroup } from '../FormField'

interface Props {
  onChange: (data: Record<string, unknown>) => void
}

const LIFE_CHANGES = [
  { value: 'new_job', label: 'New job or change in employment' },
  { value: 'sold_property', label: 'Sold property or investments' },
  { value: 'new_business', label: 'Started a new business' },
  { value: 'had_child', label: 'Had a child' },
  { value: 'got_married', label: 'Got married or divorced' },
  { value: 'retired', label: 'Retired' },
  { value: 'inherited_money', label: 'Inherited money or assets' },
  { value: 'other', label: 'Other life changes' },
]

export default function TaxOrganizerForm({ onChange }: Props) {
  const currentYear = new Date().getFullYear()
  const [data, setData] = useState({
    client_name: '',
    tax_year: String(currentYear - 1),
    entity_type: 'individual',
    life_changes: [] as string[],
    doc_deadline: '',
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
          placeholder="e.g. Sarah Johnson"
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

      <FormField label="Life Changes This Year" hint="Select all that apply">
        <CheckboxGroup
          options={LIFE_CHANGES}
          value={data.life_changes}
          onChange={(v) => update('life_changes', v)}
        />
      </FormField>

      <FormField label="Document Submission Deadline">
        <Input
          placeholder="e.g. February 15, 2025"
          value={data.doc_deadline}
          onChange={(e) => update('doc_deadline', e.target.value)}
        />
      </FormField>
    </div>
  )
}
