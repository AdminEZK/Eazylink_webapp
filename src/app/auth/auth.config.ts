import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Provider } from '@supabase/supabase-js'

export const authConfig = {
  providers: ['github'] as Provider[],
  appearance: {
    theme: ThemeSupa,
    variables: {
      default: {
        colors: {
          brand: '#2563eb',
          brandAccent: '#1d4ed8',
        },
      },
    },
  },
  localization: {
    variables: {
      sign_in: {
        email_label: 'Adresse email',
        password_label: 'Mot de passe',
        button_label: 'Se connecter',
      },
      sign_up: {
        email_label: 'Adresse email',
        password_label: 'Mot de passe',
        button_label: 'Créer un compte',
      },
    },
  },
  redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
  onlyThirdPartyProviders: false,
}
