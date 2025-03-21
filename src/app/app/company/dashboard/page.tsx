'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { CompanyProject } from '@/lib/supabase'

export default function CompanyDashboard() {
  const [projects, setProjects] = useState<CompanyProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from('company_projects')
        .select('*')
        .eq('company_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <a
            href="/app/company/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Nouveau projet
          </a>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {projects.length === 0 ? (
              <li className="px-4 py-4 sm:px-6">
                <p className="text-gray-500 text-center">
                  Aucun projet pour le moment.
                  <br />
                  <a
                    href="/app/company/projects/new"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Créez votre premier projet
                  </a>
                </p>
              </li>
            ) : (
              projects.map((project) => (
                <li key={project.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <a
                        href={`/app/company/projects/${project.id}`}
                        className="block focus:outline-none"
                      >
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {project.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {project.applications_count} candidature(s) ·{' '}
                          {project.hired_count} freelance(s) recruté(s)
                        </p>
                      </a>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'published' ? 'bg-green-100 text-green-800' :
                        project.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.status === 'published' ? 'Publié' :
                         project.status === 'draft' ? 'Brouillon' :
                         project.status === 'in_progress' ? 'En cours' :
                         project.status === 'completed' ? 'Terminé' :
                         'Annulé'}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
