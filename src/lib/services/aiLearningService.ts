// ============================================
// 2. AI LEARNING SERVICE - FIXED
// File: src/lib/services/aiLearningService.ts
// ============================================
import { createClient } from '@/lib/supabase/server'
import { AIService } from './aiService'

export interface QuotePattern {
  id: string
  pattern_type: string // 'configuration', 'pricing', 'component_pairing'
  pattern_data: any // JSONB
  confidence_score: number
  usage_count: number
  created_at: string
  updated_at: string
}

export class AILearningService {
  private aiService = new AIService()

  async learnFromQuote(quoteId: string): Promise<void> {
    const supabase = await createClient()
    
    // Get the quote with all items
    const { data: quote } = await supabase
      .from('quotes')
      .select('*, quote_items(*)')
      .eq('id', quoteId)
      .single()

    if (!quote) return

    // Extract patterns
    await this.extractConfigurationPatterns(quote)
    await this.extractPricingPatterns(quote)
    await this.extractComponentPairings(quote)
  }

  private async extractConfigurationPatterns(quote: any): Promise<void> {
    // Learn common panel configurations
    for (const item of quote.quote_items) {
      const pattern = {
        busbar_amperage: item.busbar_amperage,
        incomer_count: item.incomers?.length || 0,
        outgoing_count: item.outgoings?.length || 0,
        has_synchronization: item.incomers?.length > 1,
        accessory_types: item.accessories?.map((a: any) => a.name) || [],
      }

      await this.saveOrUpdatePattern('configuration', pattern)
    }
  }

  private async extractPricingPatterns(quote: any): Promise<void> {
    // Learn pricing trends
    for (const item of quote.quote_items) {
      const pattern = {
        amperage: item.busbar_amperage,
        average_price: item.subtotal,
        vendor_distribution: this.getVendorDistribution(item),
        price_per_ampere: item.subtotal / parseInt(item.busbar_amperage || '1'),
      }

      await this.saveOrUpdatePattern('pricing', pattern)
    }
  }

  private async extractComponentPairings(quote: any): Promise<void> {
    // Learn which components are commonly used together
    for (const item of quote.quote_items) {
      const incomers = item.incomers || []
      const outgoings = item.outgoings || []
      const accessories = item.accessories || []

      const pattern = {
        main_amperage: item.busbar_amperage,
        incomer_models: incomers.map((i: any) => i.model),
        outgoing_models: outgoings.map((o: any) => o.model),
        accessory_combinations: accessories.map((a: any) => a.name),
      }

      await this.saveOrUpdatePattern('component_pairing', pattern)
    }
  }

  private async saveOrUpdatePattern(patternType: string, patternData: any): Promise<void> {
    const supabase = await createClient()
    
    // Check if similar pattern exists
    const { data: existingPatterns } = await supabase
      .from('quote_patterns')
      .select('*')
      .eq('pattern_type', patternType)

    // In a real implementation, you'd use similarity matching
    // For now, just insert new pattern
    await supabase.from('quote_patterns').insert({
      pattern_type: patternType,
      pattern_data: patternData,
      confidence_score: 0.5,
      usage_count: 1,
    })
  }

  private getVendorDistribution(item: any): any {
    const vendors: any = {}
    
    item.incomers?.forEach((i: any) => {
      vendors[i.vendor] = (vendors[i.vendor] || 0) + 1
    })
    
    item.outgoings?.forEach((o: any) => {
      vendors[o.vendor] = (vendors[o.vendor] || 0) + 1
    })

    return vendors
  }

  async getRecommendations(panelType: string, amperage: string): Promise<any> {
    const supabase = await createClient()
    
    // Get patterns that match
    const { data: patterns } = await supabase
      .from('quote_patterns')
      .select('*')
      .order('confidence_score', { ascending: false })
      .limit(10)

    // Use AI to generate recommendations based on learned patterns
    const recommendations = await this.aiService.suggestComponents({
      mainAmperage: amperage,
      panelType,
      numberOfOutgoings: 5, // Default
    })

    return {
      patterns,
      aiRecommendations: recommendations,
    }
  }

  async analyzeQuotingTrends(): Promise<any> {
    const supabase = await createClient()
    
    // Get recent quotes
    const { data: recentQuotes } = await supabase
      .from('quotes')
      .select('*, quote_items(*)')
      .order('created_at', { ascending: false })
      .limit(50)

    if (!recentQuotes) return null

    return await this.aiService.analyzePastQuotes(recentQuotes)
  }
}