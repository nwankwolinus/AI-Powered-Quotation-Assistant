// ============================================
// 3. Type Definitions
// src/types/quote.ts
// ============================================
export interface Incomer {
  id: string
  quantity: number
  amperage: string
  poles: string
  type: string
  vendor: string
  model: string
  specification: string
  price: number
}

export interface Outgoing {
  id: string
  quantity: number
  amperage: string
  poles: string
  type: string
  vendor: string
  model: string
  price: number
}

export interface Accessory {
  id: string
  name: string
  quantity: number
  specification: string
  price: number
}

export interface QuoteItem {
  id: string
  item_number: number
  panel_name: string
  incomers: Incomer[]
  busbar_amperage: string
  busbar_specification: string
  busbar_price: number
  outgoings: Outgoing[]
  accessories: Accessory[]
  enclosure_dimensions: string
  enclosure_price: number
  subtotal: number
}

export interface Quote {
  id: string
  quote_number: string
  client_id?: string
  client_name: string
  client_address?: string
  attention?: string
  project_name: string
  status: 'draft' | 'sent' | 'approved' | 'revised' | 'rejected'
  revision_number: number
  total: number
  vat: number
  grand_total: number
  payment_terms?: string
  execution_period?: string
  validity_period?: string
  notes?: string
  created_by: string
  created_at: string
  updated_at: string
  sent_at?: string
  approved_at?: string
  items?: QuoteItem[]
}

export interface CreateQuoteInput {
  client_name: string
  client_address?: string
  attention?: string
  project_name: string
  client_id?: string
  items: Omit<QuoteItem, 'id'>[]
}

export interface UpdateQuoteInput extends Partial<CreateQuoteInput> {
  status?: Quote['status']
  notes?: string
}