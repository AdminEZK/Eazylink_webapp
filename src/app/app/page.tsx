import { getNotionPages, type NotionPage } from '@/lib/notion'
import { getFigmaFiles, type FigmaFile } from '@/lib/figma'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Les appels aux APIs se font via les serveurs MCP qui gèrent les tokens de manière sécurisée
  const [notionPages, figmaFiles] = await Promise.all([
    getNotionPages().catch(() => [] as NotionPage[]),
    getFigmaFiles().catch(() => [] as FigmaFile[])
  ])

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Section Notion */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Documents Notion récents
            </h3>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {notionPages.slice(0, 5).map((page: NotionPage) => (
                  <li key={page.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {page.title}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          Modifié le {new Date(page.lastEdited).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <a
                          href={page.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Voir
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a
                href="/app/notion"
                className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Voir tous les documents <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Section Figma */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Fichiers Figma récents
            </h3>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {figmaFiles.slice(0, 5).map((file: FigmaFile) => (
                  <li key={file.key} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          className="h-12 w-12 rounded-md object-cover" 
                          src={file.thumbnailUrl} 
                          alt="" 
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          Modifié le {new Date(file.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a
                href="/app/figma"
                className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Voir tous les fichiers <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
