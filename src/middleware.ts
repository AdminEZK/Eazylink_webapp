import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { protectedRoutes, publicRoutes, profileRedirect } from '@/lib/middleware.config'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Protection des routes /app
  if (request.nextUrl.pathname.startsWith(protectedRoutes.app.pattern)) {
    if (!session) {
      return NextResponse.redirect(new URL(protectedRoutes.app.redirectTo, request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    // Redirection vers la page de profil si le profil n'est pas complet
    if (!profile) {
      if (!request.nextUrl.pathname.startsWith(profileRedirect.pattern)) {
        return NextResponse.redirect(new URL(profileRedirect.pattern, request.url))
      }
    }

    // Redirection vers le bon dashboard selon le type d'utilisateur
    if (request.nextUrl.pathname === protectedRoutes.app.pattern) {
      const redirectUrl = profile?.type === 'company' 
        ? profileRedirect.company
        : profileRedirect.freelance
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // Protection des routes spécifiques
    if (request.nextUrl.pathname.startsWith(protectedRoutes.company.pattern) && profile?.type !== 'company') {
      return NextResponse.redirect(new URL(protectedRoutes.company.redirectTo, request.url))
    }

    if (request.nextUrl.pathname.startsWith(protectedRoutes.freelance.pattern) && profile?.type !== 'freelance') {
      return NextResponse.redirect(new URL(protectedRoutes.freelance.redirectTo, request.url))
    }
  }

  // Protection des routes d'authentification
  if (request.nextUrl.pathname.startsWith(publicRoutes.auth.pattern)) {
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        const redirectUrl = profile.type === 'company'
          ? profileRedirect.company
          : profileRedirect.freelance
        return NextResponse.redirect(new URL(redirectUrl, request.url))
      }
      
      return NextResponse.redirect(new URL(profileRedirect.pattern, request.url))
    }
  }

  // Redirection de la page d'accueil
  if (request.nextUrl.pathname === publicRoutes.home.pattern) {
    if (!session) {
      return NextResponse.redirect(new URL(publicRoutes.home.redirectTo, request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/app/:path*', '/auth/:path*', '/']
}
