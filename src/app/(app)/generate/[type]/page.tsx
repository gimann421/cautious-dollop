import { notFound } from 'next/navigation'
import { DOCUMENT_TYPES, DocumentType } from '@/types'
import { createClient } from '@/lib/supabase/server'
import GenerateClient from './GenerateClient'

interface Props {
  params: Promise<{ type: string }>
}

export default async function GeneratePage({ params }: Props) {
  const { type } = await params
  const docConfig = DOCUMENT_TYPES.find((d) => d.id === type)

  if (!docConfig) {
    notFound()
  }

  let profile = null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      profile = data
    }
  } catch {
    // Supabase not configured — use null profile
  }

  return <GenerateClient type={type as DocumentType} profile={profile} />
}
