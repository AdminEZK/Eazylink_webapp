import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Configuration du serveur MCP pour Notion
const MCP_NOTION_ENDPOINT = process.env.MCP_NOTION_ENDPOINT || 'http://localhost:3001';

async function checkAuth() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

// GET /api/notion/pages - Récupérer les pages
export async function GET(request: NextRequest) {
  try {
    await checkAuth();
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || 'pages';

    const response = await fetch(`${MCP_NOTION_ENDPOINT}/api/${path}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Notion ${path}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Notion API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST /api/notion/pages - Créer une nouvelle page
export async function POST(request: NextRequest) {
  try {
    await checkAuth();
    const body = await request.json();

    const response = await fetch(`${MCP_NOTION_ENDPOINT}/api/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create Notion page: ${error}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Notion API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// PATCH /api/notion/pages - Mettre à jour une page
export async function PATCH(request: NextRequest) {
  try {
    await checkAuth();
    const body = await request.json();

    const response = await fetch(`${MCP_NOTION_ENDPOINT}/api/pages`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update Notion page: ${error}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Notion API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
