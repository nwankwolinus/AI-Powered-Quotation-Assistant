// ============================================
// 9. Settings Service
// src/lib/services/settingsService.ts
// ============================================
import { createServerClient } from '@/lib/supabase/server'

export interface Setting {
  id: string
  key: string
  value: string
  description?: string
  updated_by?: string
  updated_at: string
}

export class SettingsService {
  private supabase = createServerClient()

  async getAllSettings(): Promise<Setting[]> {
    const { data, error } = await this.supabase
      .from('settings')
      .select('*')
      .order('key', { ascending: true })

    if (error) throw new Error(error.message)
    return data as Setting[]
  }

  async getSettingByKey(key: string): Promise<Setting | null> {
    const { data, error } = await this.supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single()

    if (error) return null
    return data as Setting
  }

  async updateSetting(key: string, value: string, userId: string): Promise<Setting> {
    const { data, error } = await this.supabase
      .from('settings')
      .update({
        value,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('key', key)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as Setting
  }
}