// Note: Le token API Notion est géré de manière sécurisée par le serveur MCP
// et n'est jamais exposé côté client

export interface NotionPage {
  id: string;
  title: string;
  url: string;
  lastEdited: string;
}

export interface NotionDatabase {
  id: string;
  title: string;
  url: string;
}

export interface NotionPageProperties {
  [key: string]: {
    type: string;
    [key: string]: any;
  };
}

// Les appels à l'API Notion se feront via le serveur MCP
const NOTION_API_ENDPOINT = '/api/notion';

export async function getNotionPages(): Promise<NotionPage[]> {
  const response = await fetch(`${NOTION_API_ENDPOINT}/pages`);
  if (!response.ok) throw new Error('Failed to fetch Notion pages');
  return response.json();
}

export async function getNotionDatabases(): Promise<NotionDatabase[]> {
  const response = await fetch(`${NOTION_API_ENDPOINT}/databases`);
  if (!response.ok) throw new Error('Failed to fetch Notion databases');
  return response.json();
}

export async function createNotionPage(
  databaseId: string,
  properties: NotionPageProperties
): Promise<NotionPage> {
  const response = await fetch(`${NOTION_API_ENDPOINT}/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ databaseId, properties }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Notion page: ${error}`);
  }

  return response.json();
}
