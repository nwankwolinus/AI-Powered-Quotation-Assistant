export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      quotes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          project_name: string
          client_id: string
          status: 'draft' | 'sent' | 'approved' | 'rejected'
          total_value: number
          items: Json
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          project_name: string
          client_id: string
          status?: 'draft' | 'sent' | 'approved' | 'rejected'
          total_value: number
          items?: Json
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          project_name?: string
          client_id?: string
          status?: 'draft' | 'sent' | 'approved' | 'rejected'
          total_value?: number
          items?: Json
          user_id?: string
        }
      }
      clients: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          company: string
          address: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone?: string
          company?: string
          address?: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          company?: string
          address?: string
          user_id?: string
        }
      }
      components: {
        Row: {
          id: string
          created_at: string
          name: string
          type: string
          manufacturer: string
          price: number
          stock: number
          specifications: Json
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          type: string
          manufacturer: string
          price: number
          stock?: number
          specifications?: Json
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          type?: string
          manufacturer?: string
          price?: number
          stock?: number
          specifications?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}