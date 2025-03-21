'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { FreelanceMission } from '@/lib/supabase'

export default function FreelanceDashboard() {
  const [missions, setMissions] = useState<FreelanceMission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMissions()
  }, [])

  const loadMissions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from('freelance_missions')
        .select('*')
        .eq('freelance_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMissions(data || [])
    } catch (error) {
      console.error('Error loading missions:', error)
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
            href="/app/freelance/opportunities"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Voir les opportunités
          </a>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {missions.length === 0 ? (
              <li className="px-4 py-4 sm:px-6">
                <p className="text-gray-500 text-center">
                  Aucune mission pour le moment.
                  <br />
                  <a
                    href="/app/freelance/opportunities"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Découvrez les opportunités
                  </a>
                </p>
              </li>
            ) : (
              missions.map((mission) => (
                <li key={mission.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <a
                        href={`/app/freelance/missions/${mission.id}`}
                        className="block focus:outline-none"
                      >
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {mission.project_title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {mission.company_name} · {mission.rate && `${mission.rate}€/jour`}
                        </p>
                      </a>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        mission.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        mission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        mission.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {mission.status === 'accepted' ? 'Acceptée' :
                         mission.status === 'pending' ? 'En attente' :
                         mission.status === 'completed' ? 'Terminée' :
                         'Refusée'}
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
