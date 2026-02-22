'use client'

import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  required?: boolean
  children: ReactNode
  hint?: string
}

export function FormField({ label, required, children, hint }: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--ink-light)] mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-[var(--ink-faint)]">{hint}</p>}
    </div>
  )
}

const inputClass =
  'w-full px-3 py-2 rounded-md border border-[var(--rule)] bg-white text-sm text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors'

export function Input({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputClass} {...props} />
}

export function Textarea({
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`${inputClass} resize-none`}
      rows={3}
      {...props}
    />
  )
}

export function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${inputClass} cursor-pointer`} {...props}>
      {children}
    </select>
  )
}

interface CheckboxGroupProps {
  options: { value: string; label: string }[]
  value: string[]
  onChange: (values: string[]) => void
}

export function CheckboxGroup({ options, value, onChange }: CheckboxGroupProps) {
  const toggle = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v))
    } else {
      onChange([...value, v])
    }
  }

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={value.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            className="w-4 h-4 rounded border-[var(--rule)] accent-[var(--accent)] cursor-pointer"
          />
          <span className="text-sm text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${
          checked ? 'bg-[var(--accent)]' : 'bg-[var(--rule)]'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </div>
      <span className="text-sm text-[var(--ink)]">{label}</span>
    </label>
  )
}

export function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--ink-faint)] mb-1.5">{label}</label>
      <div className="px-3 py-2 rounded-md border border-[var(--rule)] bg-[var(--paper)] text-sm text-[var(--ink-light)]">
        {value || '—'}
      </div>
    </div>
  )
}
