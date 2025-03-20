// Note: Le token API Figma est géré de manière sécurisée par le serveur MCP
// et n'est jamais exposé côté client

export type FigmaFile = {
  key: string
  name: string
  lastModified: string
  thumbnailUrl: string
}

export type FigmaProject = {
  id: string
  name: string
}

// Les appels à l'API Figma se feront via le serveur MCP
const FIGMA_API_ENDPOINT = '/api/figma'

export async function getFigmaFiles(projectId?: string): Promise<FigmaFile[]> {
  const endpoint = projectId 
    ? `${FIGMA_API_ENDPOINT}/files?projectId=${projectId}`
    : `${FIGMA_API_ENDPOINT}/files`
  const response = await fetch(endpoint)
  if (!response.ok) throw new Error('Failed to fetch Figma files')
  return response.json()
}

export async function getFigmaProjects(): Promise<FigmaProject[]> {
  const response = await fetch(`${FIGMA_API_ENDPOINT}/projects`)
  if (!response.ok) throw new Error('Failed to fetch Figma projects')
  return response.json()
}

export async function getFigmaFileComponents(fileKey: string) {
  const response = await fetch(`${FIGMA_API_ENDPOINT}/files/${fileKey}/components`)
  if (!response.ok) throw new Error('Failed to fetch Figma components')
  return response.json()
}
