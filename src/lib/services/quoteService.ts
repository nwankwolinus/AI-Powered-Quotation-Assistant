// ============================================
// UPDATED QUOTE SERVICE WITH HELPERS
// File: src/lib/services/quoteService.ts
// ============================================
import { createClient } from '@/lib/supabase/server'
import { Quote, QuoteItem, CreateQuoteInput, UpdateQuoteInput } from '@/types/quote'
import { toJson } from '@/lib/utils/json-helpers'

export class QuoteService {
  async generateQuoteNumber(): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2)
    const randomNum = Math.floor(Math.random() * 9000) + 1000
    return `PPL/${randomNum}/LN-${year}`
  }

  async getAllQuotes(userId: string, userRole: string): Promise<Quote[]> {
    const supabase = await createClient()
    
    let query = supabase
      .from('quotes')
      .select('*, quote_items(*)')
      .order('created_at', { ascending: false })

    if (userRole === 'sales_engineer') {
      query = query.eq('created_by', userId)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    return data as Quote[]
  }

  async getQuoteById(id: string): Promise<Quote | null> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('quotes')
      .select('*, quote_items(*)')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data as Quote
  }

  async createQuote(input: CreateQuoteInput, userId: string): Promise<Quote> {
    const supabase = await createClient()
    const quoteNumber = await this.generateQuoteNumber()

    // Calculate totals
    const itemSubtotals = input.items.map(item => this.calculateItemSubtotal(item))
    const total = itemSubtotals.reduce((sum, subtotal) => sum + subtotal, 0)
    const vat = total * 0.075
    const grandTotal = total + vat

    // Get default terms from settings
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .in('key', ['default_payment_terms', 'default_execution_period', 'default_validity_period'])

    const paymentTerms = settings?.find(s => s.key === 'default_payment_terms')?.value
    const executionPeriod = settings?.find(s => s.key === 'default_execution_period')?.value
    const validityPeriod = settings?.find(s => s.key === 'default_validity_period')?.value

    // Create quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        quote_number: quoteNumber,
        client_id: input.client_id,
        client_name: input.client_name,
        client_address: input.client_address,
        attention: input.attention,
        project_name: input.project_name,
        status: 'draft',
        revision_number: 0,
        total,
        vat,
        grand_total: grandTotal,
        payment_terms: paymentTerms,
        execution_period: executionPeriod,
        validity_period: validityPeriod,
        created_by: userId,
      })
      .select()
      .single()

    if (quoteError) throw new Error(quoteError.message)

    // Create quote items with JSON conversion
    const itemsToInsert = input.items.map((item, index) => ({
      quote_id: quote.id,
      item_number: item.item_number || index + 1,
      panel_name: item.panel_name,
      incomers: toJson(item.incomers),
      busbar_amperage: item.busbar_amperage,
      busbar_specification: item.busbar_specification,
      busbar_price: item.busbar_price,
      outgoings: toJson(item.outgoings),
      accessories: toJson(item.accessories),
      enclosure_dimensions: item.enclosure_dimensions,
      enclosure_price: item.enclosure_price,
      subtotal: this.calculateItemSubtotal(item),
    }))

    const { error: itemsError } = await supabase
      .from('quote_items')
      .insert(itemsToInsert)

    if (itemsError) throw new Error(itemsError.message)

    return this.getQuoteById(quote.id) as Promise<Quote>
  }

  async updateQuote(id: string, input: UpdateQuoteInput): Promise<Quote> {
    const supabase = await createClient()
    
    const updates: any = {
      updated_at: new Date().toISOString(),
    }

    if (input.client_name) updates.client_name = input.client_name
    if (input.client_address !== undefined) updates.client_address = input.client_address
    if (input.attention !== undefined) updates.attention = input.attention
    if (input.project_name) updates.project_name = input.project_name
    if (input.client_id !== undefined) updates.client_id = input.client_id
    if (input.status) {
      updates.status = input.status
      if (input.status === 'sent') updates.sent_at = new Date().toISOString()
      if (input.status === 'approved') updates.approved_at = new Date().toISOString()
    }
    if (input.notes !== undefined) updates.notes = input.notes

    // If items are being updated, recalculate totals
    if (input.items) {
      const itemSubtotals = input.items.map(item => this.calculateItemSubtotal(item))
      const total = itemSubtotals.reduce((sum, subtotal) => sum + subtotal, 0)
      const vat = total * 0.075
      updates.total = total
      updates.vat = vat
      updates.grand_total = total + vat

      // Delete existing items
      await supabase.from('quote_items').delete().eq('quote_id', id)

      // Insert new items with JSON conversion
      const itemsToInsert = input.items.map((item, index) => ({
        quote_id: id,
        item_number: item.item_number || index + 1,
        panel_name: item.panel_name,
        incomers: toJson(item.incomers),
        busbar_amperage: item.busbar_amperage,
        busbar_specification: item.busbar_specification,
        busbar_price: item.busbar_price,
        outgoings: toJson(item.outgoings),
        accessories: toJson(item.accessories),
        enclosure_dimensions: item.enclosure_dimensions,
        enclosure_price: item.enclosure_price,
        subtotal: this.calculateItemSubtotal(item),
      }))

      await supabase.from('quote_items').insert(itemsToInsert)
    }

    const { data, error } = await supabase
      .from('quotes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    return this.getQuoteById(id) as Promise<Quote>
  }

  async deleteQuote(id: string): Promise<void> {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  }

  private calculateItemSubtotal(item: Omit<QuoteItem, 'id' | 'subtotal'>): number {
    const incomerTotal = item.incomers.reduce((sum, inc) => sum + (inc.price * inc.quantity), 0)
    const busbarTotal = item.busbar_price
    const outgoingsTotal = item.outgoings.reduce((sum, out) => sum + (out.price * out.quantity), 0)
    const accessoriesTotal = item.accessories.reduce((sum, acc) => sum + (acc.price * acc.quantity), 0)
    const enclosureTotal = item.enclosure_price

    return incomerTotal + busbarTotal + outgoingsTotal + accessoriesTotal + enclosureTotal
  }
}
