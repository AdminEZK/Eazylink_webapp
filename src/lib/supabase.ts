import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Types pour la base de données
export type Profile = {
  id: string
  type: 'freelance' | 'company'
  created_at: string
  updated_at: string
  full_name?: string
  avatar_url?: string
  website?: string
  company_name?: string
  company_size?: string
  industry?: string
  location?: string
  email: string
}

export type Project = {
  id: string
  created_at: string
  updated_at: string
  title: string
  description: string
  company_id: string
  budget_min?: number | null
  budget_max?: number | null
  status: 'draft' | 'published' | 'closed'
  skills: string[]
  duration?: string
  location?: string
}

export type Mission = {
  id: string
  created_at: string
  updated_at: string
  project_id: string
  freelance_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  proposal_text?: string
  rate?: number
  start_date?: string
  end_date?: string
}

export type Invoice = {
  id: string
  created_at: string
  updated_at: string
  mission_id: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'cancelled'
  due_date?: string
  paid_at?: string
  invoice_number?: string
  stripe_payment_intent_id?: string
}

// Types pour les vues
export type FreelanceMission = Mission & {
  project_title: string
  company_id: string
  company_name: string
}

export type CompanyProject = Project & {
  applications_count: number
  hired_count: number
}
