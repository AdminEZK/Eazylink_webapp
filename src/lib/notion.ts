// Note: Le token API Notion est géré de manière sécurisée par le serveur MCP
// et n'est jamais exposé côté client

export type NotionPage = {
  id: string
  title: string
  url: string
  lastEdited: string
}

export type NotionDatabase = {
  id: string
  title: string
  url: string
}

// Les appels à l'API Notion se feront via le serveur MCP
const NOTION_API_ENDPOINT = '/api/notion'

export async function getNotionPages(): Promise<NotionPage[]> {
  const response = await fetch(`${NOTION_API_ENDPOINT}/pages`)
  if (!response.ok) throw new Error('Failed to fetch Notion pages')
  return response.json()
}

export async function getNotionDatabases(): Promise<NotionDatabase[]> {
  const response = await fetch(`${NOTION_API_ENDPOINT}/databases`)
  if (!response.ok) throw new Error('Failed to fetch Notion databases')
  return response.json()
}

export async function createNotionPage(databaseId: string, properties: any) {
  const response = await fetch(`${NOTION_API_ENDPOINT}/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ databaseId, properties }),
  })
  if (!response.ok) throw new Error('Failed to create Notion page')
  return response.json()
}
