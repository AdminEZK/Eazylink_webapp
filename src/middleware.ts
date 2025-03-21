import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protéger toutes les routes /app/* qui nécessitent une authentification
  if (req.nextUrl.pathname.startsWith('/app')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Vérifier si le profil est complet
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    // Si le profil n'est pas complet, rediriger vers la page de profil
    if (!profile || !profile.full_name && !profile.company_name) {
      if (!req.nextUrl.pathname.startsWith('/app/profile')) {
        return NextResponse.redirect(new URL('/app/profile', req.url))
      }
    }

    // Rediriger vers le bon dashboard en fonction du type d'utilisateur
    if (profile && req.nextUrl.pathname === '/app') {
      const redirectUrl = profile.type === 'company' 
        ? '/app/company/dashboard'
        : '/app/freelance/dashboard'
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }

    // Empêcher l'accès aux mauvaises sections
    if (profile) {
      if (profile.type === 'company' && req.nextUrl.pathname.includes('/freelance')) {
        return NextResponse.redirect(new URL('/app/company/dashboard', req.url))
      }
      if (profile.type === 'freelance' && req.nextUrl.pathname.includes('/company')) {
        return NextResponse.redirect(new URL('/app/freelance/dashboard', req.url))
      }
    }
  }

  // Pour les pages d'auth, rediriger vers le dashboard approprié si déjà connecté
  if (req.nextUrl.pathname.startsWith('/auth')) {
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('type')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        const redirectUrl = profile.type === 'company'
          ? '/app/company/dashboard'
          : '/app/freelance/dashboard'
        return NextResponse.redirect(new URL(redirectUrl, req.url))
      }
      
      return NextResponse.redirect(new URL('/app/profile', req.url))
    }
  }

  // Rediriger la racine vers la page de connexion si non connecté
  if (req.nextUrl.pathname === '/') {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/', '/app/:path*', '/auth/:path*']
}
