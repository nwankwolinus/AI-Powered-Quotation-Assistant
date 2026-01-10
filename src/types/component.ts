
// ============================================
// UPDATED: src/types/component.ts
// ============================================
import { createBrowserClient } from '@supabase/ssr'
import { Database } from './database'

export type Component = Database['public']['Tables']['components']['Row']
export type ComponentInsert = Database['public']['Tables']['components']['Insert']
export type ComponentUpdate = Database['public']['Tables']['components']['Update']

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}