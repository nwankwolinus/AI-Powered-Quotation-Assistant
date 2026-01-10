// ============================================
// SETTINGS SERVICE - FIXED
// File: src/lib/services/settingsService.ts
// ============================================
import { createClient } from '@/lib/supabase/server'

export interface Setting {
  id: string
  key: string
  value: string
  description?: string
  updated_by?: string
  updated_at: string
}

export class SettingsService {
  async getAllSettings(): Promise<Setting[]> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('key', { ascending: true })

    if (error) throw new Error(error.message)
    return data as Setting[]
  }

  async getSettingByKey(key: string): Promise<Setting | null> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single()

    if (error) return null
    return data as Setting
  }

  async updateSetting(key: string, value: string, userId: string): Promise<Setting> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
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

  async createSetting(setting: Omit<Setting, 'id' | 'updated_at'>): Promise<Setting> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('settings')
      .insert({
        ...setting,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as Setting
  }

  async deleteSetting(key: string): Promise<void> {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('key', key)

    if (error) throw new Error(error.message)
  }
}
