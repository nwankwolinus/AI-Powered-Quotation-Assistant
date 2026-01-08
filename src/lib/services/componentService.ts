// ============================================
// 7. Component Service
// src/lib/services/componentService.ts
// ============================================
import { createServerClient } from '@/lib/supabase/server'

export interface Component {
  id: string
  vendor: string
  item: string
  model: string
  manufacturer: string
  price: number
  currency: string
  amperage?: string
  poles?: string
  type?: string
  specification?: string
  category?: string
  created_by: string
  created_at: string
  updated_at: string
}

export class ComponentService {
  private supabase = createServerClient()

  async getAllComponents(filters?: {
    vendor?: string
    category?: string
    search?: string
  }): Promise<Component[]> {
    let query = this.supabase
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
      query = query.or(`item.ilike.%${filters.search}%,model.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    return data as Component[]
  }

  async getComponentById(id: string): Promise<Component | null> {
    const { data, error } = await this.supabase
      .from('components')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data as Component
  }

  async createComponent(input: Omit<Component, 'id' | 'created_at' | 'updated_at'>, userId: string): Promise<Component> {
    const { data, error } = await this.supabase
      .from('components')
      .insert({
        ...input,
        created_by: userId,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as Component
  }

  async updateComponent(id: string, input: Partial<Component>): Promise<Component> {
    const { data, error } = await this.supabase
      .from('components')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as Component
  }

  async deleteComponent(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('components')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  }

  async getComponentBySpecs(
    amperage: string,
    vendor: string,
    type: string
  ): Promise<Component | null> {
    const { data, error } = await this.supabase
      .from('components')
      .select('*')
      .eq('amperage', amperage)
      .eq('vendor', vendor)
      .eq('type', type)
      .single()

    if (error) return null
    return data as Component
  }
}