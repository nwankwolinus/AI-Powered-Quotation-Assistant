
// ============================================
// UPDATED: src/lib/services/componentService.ts
// ============================================
import { createClient } from '@/lib/supabase/server'
import type {
  Component,
  ComponentInsert,
  ComponentUpdate,
} from '@/types/component'

export class ComponentService {
  private async getSupabase() {
    return await createClient()
  }

  async getAllComponents(filters?: {
    vendor?: string
    category?: string
    search?: string
  }): Promise<Component[]> {
    const supabase = await this.getSupabase()
    let query = supabase
      .from('components')
      .select('*')
      .order('item', { ascending: true })

    if (filters?.vendor) {
      query = query.eq('vendor', filters.vendor)
    }

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.search) {
      query = query.or(
        `item.ilike.%${filters.search}%,model.ilike.%${filters.search}%,manufacturer.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    return data
  }

  async getComponentById(id: string): Promise<Component | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async createComponent(input: ComponentInsert): Promise<Component> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('components')
      .insert(input)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async updateComponent(
    id: string,
    input: ComponentUpdate
  ): Promise<Component> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('components')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async deleteComponent(id: string): Promise<void> {
    const supabase = await this.getSupabase()
    const { error } = await supabase.from('components').delete().eq('id', id)

    if (error) throw new Error(error.message)
  }

  async getComponentBySpecs(
    amperage: string,
    vendor: string,
    type: string
  ): Promise<Component | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('amperage', amperage)
      .eq('vendor', vendor)
      .eq('type', type)
      .maybeSingle()

    if (error) return null
    return data
  }
}