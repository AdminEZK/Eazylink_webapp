'use client'

import { useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import SignUpForm from '@/components/auth/signup-form'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Bienvenue sur Eazylink
        </h2>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={() => setMode('login')}
            className={`${
              mode === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            } pb-2 px-2`}
          >
            Connexion
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`${
              mode === 'signup'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            } pb-2 px-2`}
          >
            Inscription
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {mode === 'login' ? (
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['github']}
              redirectTo={`${window.location.origin}/auth/callback`}
              view="sign_in"
            />
          ) : (
            <SignUpForm onSuccess={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  )
}
