export type DocumentType =
  | 'engagement_letter'
  | 'tax_cover'
  | 'tax_organizer'
  | 'extension'
  | 'welcome'
  | 'disengagement'
  | 'scope_change'
  | 'irs_notice'

export type Plan = 'free' | 'pro' | 'team'
export type FeeStructure = 'flat_fee' | 'hourly' | 'monthly_retainer'
export type EntityType = 'individual' | 's_corp' | 'llc' | 'partnership' | 'c_corp'

export interface Profile {
  id: string
  firm_name: string
  your_name: string
  title: string
  email: string
  phone: string
  created_at: string
}

export interface Document {
  id: string
  user_id: string
  document_type: DocumentType
  inputs: Record<string, unknown>
  output: string
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: Plan
  status: string
  updated_at: string
}

export interface DocumentTypeConfig {
  id: DocumentType
  label: string
  description: string
  icon: string
  plans: Plan[]
}

export const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  {
    id: 'engagement_letter',
    label: 'Engagement Letter',
    description: 'Formally define your scope of services and fees with new and returning clients.',
    icon: '📋',
    plans: ['free', 'pro', 'team'],
  },
  {
    id: 'tax_cover',
    label: 'Tax Return Cover Letter',
    description: 'Accompany tax returns with a clear summary of results and next steps.',
    icon: '📄',
    plans: ['free', 'pro', 'team'],
  },
  {
    id: 'tax_organizer',
    label: 'Tax Organizer Request',
    description: 'Request all necessary documents from clients ahead of tax season.',
    icon: '📁',
    plans: ['pro', 'team'],
  },
  {
    id: 'extension',
    label: 'Extension Notification',
    description: 'Notify clients professionally when their return will be extended.',
    icon: '📅',
    plans: ['pro', 'team'],
  },
  {
    id: 'welcome',
    label: 'Welcome Letter',
    description: 'Onboard new clients with a warm introduction to your firm.',
    icon: '👋',
    plans: ['free', 'pro', 'team'],
  },
  {
    id: 'disengagement',
    label: 'Disengagement Letter',
    description: 'End client relationships professionally and clearly.',
    icon: '🔒',
    plans: ['pro', 'team'],
  },
  {
    id: 'scope_change',
    label: 'Scope Change Addendum',
    description: 'Document changes to services or fees with a formal addendum.',
    icon: '✏️',
    plans: ['pro', 'team'],
  },
  {
    id: 'irs_notice',
    label: 'IRS Notice Summary',
    description: 'Translate IRS notices into clear, actionable client communications.',
    icon: '⚠️',
    plans: ['pro', 'team'],
  },
]

export const PLAN_LIMITS = {
  free: {
    docs_per_month: 5,
    document_types: ['engagement_letter', 'welcome', 'tax_cover'] as DocumentType[],
    history: 10,
  },
  pro: {
    docs_per_month: Infinity,
    document_types: 'all' as const,
    history: Infinity,
  },
  team: {
    docs_per_month: Infinity,
    document_types: 'all' as const,
    history: Infinity,
  },
}
