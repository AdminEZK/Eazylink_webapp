import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Les appels à l'API Figma sont gérés via le serveur MCP
const MCP_FIGMA_ENDPOINT = process.env.MCP_FIGMA_ENDPOINT || 'http://localhost:3002'

async function checkAuth() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function GET(request: Request) {
  const session = await checkAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // L'appel est relayé au serveur MCP qui gère le token de manière sécurisée
    const response = await fetch(`${MCP_FIGMA_ENDPOINT}/api/files`)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Figma API error:', error)
    return NextResponse.json({ error: 'Failed to fetch Figma data' }, { status: 500 })
  }
}
