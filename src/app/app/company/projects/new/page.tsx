'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/supabase'

type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'company_id' | 'budget_min' | 'budget_max'> & {
  budget_min: string
  budget_max: string
}

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [project, setProject] = useState<ProjectFormData>({
    title: '',
    description: '',
    budget_min: '',
    budget_max: '',
    duration: '',
    skills: [],
    status: 'draft'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Non authentifié')

      const projectData: Partial<Project> = {
        ...project,
        company_id: session.user.id,
        budget_min: project.budget_min ? Number(project.budget_min) : null,
        budget_max: project.budget_max ? Number(project.budget_max) : null,
        status: project.status
      }

      const { error } = await supabase
        .from('projects')
        .insert([projectData])

      if (error) throw error

      router.push('/app/company/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean)
    setProject({ ...project, skills })
  }

  const handlePublish = () => {
    setProject(prev => ({ ...prev, status: 'published' }))
  }

  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Créer un nouveau projet
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Décrivez votre projet pour attirer les meilleurs freelances
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Titre du projet
            </label>
            <input
              type="text"
              required
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Développement d'une application mobile"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              required
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Décrivez les objectifs, le contexte et les attentes du projet..."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Budget minimum (€/jour)
              </label>
              <input
                type="number"
                value={project.budget_min}
                onChange={(e) => setProject({ ...project, budget_min: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: 400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Budget maximum (€/jour)
              </label>
              <input
                type="number"
                value={project.budget_max}
                onChange={(e) => setProject({ ...project, budget_max: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: 600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Durée estimée
            </label>
            <select
              value={project.duration}
              onChange={(e) => setProject({ ...project, duration: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez une durée</option>
              <option value="< 1 mois">Moins d'1 mois</option>
              <option value="1-3 mois">1 à 3 mois</option>
              <option value="3-6 mois">3 à 6 mois</option>
              <option value="> 6 mois">Plus de 6 mois</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Compétences requises
            </label>
            <input
              type="text"
              value={project.skills.join(', ')}
              onChange={handleSkillChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: React, Node.js, TypeScript (séparés par des virgules)"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handlePublish}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Publier
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enregistrer comme brouillon
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
