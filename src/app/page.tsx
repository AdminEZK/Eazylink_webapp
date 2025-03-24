import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export default async function HomePage() {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
  
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
