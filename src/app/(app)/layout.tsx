import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import { createClient } from '@/lib/supabase/server'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let plan = 'free'
  let userName: string | undefined

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('your_name')
        .eq('id', user.id)
        .single()

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .single()

      userName = profile?.your_name || user.email?.split('@')[0]
      plan = subscription?.plan || 'free'
    }
  } catch {
    // Supabase not configured yet — use defaults
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Sidebar plan={plan} userName={userName} />
      <main className="md:ml-60 min-h-screen pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
