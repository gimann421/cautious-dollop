import { createClient } from '@/lib/supabase/server'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  let profile = null
  let subscription = null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const [profileRes, subRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
      ])
      profile = profileRes.data
      subscription = subRes.data
    }
  } catch {
    // Supabase not configured
  }

  return <SettingsClient profile={profile} subscription={subscription} />
}
