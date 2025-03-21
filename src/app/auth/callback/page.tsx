'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Erreur lors de l\'authentification:', error.message)
        router.push('/auth/login')
        return
      }

      if (!session) {
        router.push('/auth/login')
        return
      }

      // Vérifier si l'utilisateur a un profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('type')
        .eq('id', session.user.id)
        .single()

      if (!profile) {
        router.push('/app/profile')
      } else {
        router.push(profile.type === 'company' ? '/app/company/dashboard' : '/app/freelance/dashboard')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    </div>
  )
}
