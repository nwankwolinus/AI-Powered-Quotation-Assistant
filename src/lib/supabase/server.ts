// ============================================
// 2. Supabase Server Client
// src/lib/supabase/server.ts
// ============================================
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

export const createServerClient = () => {
  return createServerComponentClient<Database>({
    cookies,
  })
}