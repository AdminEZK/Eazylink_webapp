import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('type')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    return redirect('/app/profile')
  }

  return redirect(profile.type === 'company' ? '/app/company/dashboard' : '/app/freelance/dashboard')
}
