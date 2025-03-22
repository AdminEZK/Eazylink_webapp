interface RedirectCallback {
  url: string
  baseUrl: string
}

export const getBaseUrl = () => {
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
