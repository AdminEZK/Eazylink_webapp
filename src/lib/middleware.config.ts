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
