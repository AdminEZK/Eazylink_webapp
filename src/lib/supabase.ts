import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qfpviwjjbxqliyskpuzb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcHZpd2pqYnhxbGl5c2twdXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0ODYwMDUsImV4cCI6MjA1ODA2MjAwNX0.DgHzDoA9zskmnFcO5GvoaMM4KB5lBuT8ULUCkGZhKKs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour la base de données
export type Profile = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export type Workspace = {
  id: string
  name: string
  created_at: string
  owner_id: string
}

export type Member = {
  workspace_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  joined_at: string
}
