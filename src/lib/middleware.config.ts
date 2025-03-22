interface RedirectCallback {
  url: string
  baseUrl: string
}

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

export const protectedRoutes = {
  app: {
    pattern: '/app',
    redirectTo: '/auth/login',
  },
  company: {
    pattern: '/app/company',
    redirectTo: '/app/freelance/dashboard',
  },
  freelance: {
    pattern: '/app/freelance',
    redirectTo: '/app/company/dashboard',
  },
}

export const publicRoutes = {
  auth: {
    pattern: '/auth',
    redirectTo: '/app',
    callbackUrl: `${getBaseUrl()}/auth/callback`,
  },
  home: {
    pattern: '/',
    redirectTo: '/auth/login',
  },
}

export const profileRedirect = {
  pattern: '/app/profile',
  company: '/app/company/dashboard',
  freelance: '/app/freelance/dashboard',
}

export const authConfig = {
  providers: ['github'],
  callbacks: {
    redirect: async ({ url, baseUrl }: RedirectCallback) => {
      // Permet à l'utilisateur d'être redirigé vers l'URL d'origine après l'authentification
      if (url.startsWith(baseUrl)) return url
      // Sinon, redirige vers la page d'accueil
      return baseUrl
    },
  },
}
