import { Session, User } from '@supabase/supabase-js'
import { getBaseUrl } from '@/lib/middleware.config'

interface RedirectParams {
  url: string
  baseUrl: string
}

interface SessionParams {
  session: Session | null
  user: User
}

export const authConfig = {
  providers: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackUrl: `${getBaseUrl()}/auth/callback`,
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  callbacks: {
    async redirect({ url, baseUrl }: RedirectParams) {
      // Permet à l'utilisateur d'être redirigé vers l'URL d'origine après l'authentification
      if (url.startsWith(baseUrl)) return url
      // Sinon, redirige vers la page d'accueil
      return baseUrl
    },
    async session({ session, user }: SessionParams) {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
  },
}
