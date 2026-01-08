// ============================================
// 12. AUTONOMOUS AI BACKGROUND WORKER
// src/lib/workers/aiLearningWorker.ts
// ============================================

export class AILearningWorker {
  private isRunning = false
  private intervalMinutes = 60 // Run every hour

  async start() {
    if (this.isRunning) return
    
    this.isRunning = true
    console.log('AI Learning Worker started')

    // Run immediately
    await this.runLearningCycle()

    // Then run periodically
    setInterval(async () => {
      await this.runLearningCycle()
    }, this.intervalMinutes * 60 * 1000)
  }

  private async runLearningCycle() {
    try {
      console.log('Starting AI learning cycle...')

      await this.learnFromRecentQuotes()
      await this.optimizePatterns()
      await this.updateRecommendations()
      await this.generateInsights()

      console.log('AI learning cycle completed')
    } catch (error) {
      console.error('AI learning cycle error:', error)
    }
  }

  private async learnFromRecentQuotes() {
    const supabase = createServerClient()
    
    // Get quotes created in last 24 hours that haven't been learned from
    const { data: newQuotes } = await supabase
      .from('quotes')
      .select('*, quote_items(*)')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .eq('status', 'approved')

    if (!newQuotes || newQuotes.length === 0) return

    const learningService = new AILearningService()

    for (const quote of newQuotes) {
      await learningService.learnFromQuote(quote.id)
    }

    console.log(`Learned from ${newQuotes.length} new quotes`)
  }

  private async optimizePatterns() {
    const supabase = createServerClient()

    // Remove low-confidence patterns that haven't been used recently
    await supabase
      .from('quote_patterns')
      .delete()
      .lt('confidence_score', 0.3)
      .lt('last_seen_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())

    console.log('Optimized pattern database')
  }

  private async updateRecommendations() {
    // Refresh AI model's understanding of current trends
    const aiService = new AIService()
    const learningService = new AILearningService()
    
    const trends = await learningService.analyzeQuotingTrends()
    
    // Store trends for quick access
    const supabase = createServerClient()
    await supabase.from('ai_learning_metrics').insert({
      metric_type: 'trend_analysis',
      metric_value: trends.recommendations?.length || 0,
      metadata: trends,
    })

    console.log('Updated AI recommendations')
  }

  private async generateInsights() {
    const supabase = createServerClient()

    // Calculate key metrics
    const { data: recentQuotes } = await supabase
      .from('quotes')
      .select('*')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    if (!recentQuotes) return

    const avgQuoteValue = recentQuotes.reduce((sum, q) => sum + q.grand_total, 0) / recentQuotes.length
    const approvalRate = recentQuotes.filter(q => q.status === 'approved').length / recentQuotes.length

    // Store metrics
    await supabase.from('ai_learning_metrics').insert([
      {
        metric_type: 'avg_quote_value',
        metric_value: avgQuoteValue,
        metadata: { period: '30_days' },
      },
      {
        metric_type: 'approval_rate',
        metric_value: approvalRate,
        metadata: { period: '30_days' },
      },
    ])

    console.log('Generated insights')
  }

  stop() {
    this.isRunning = false
    console.log('AI Learning Worker stopped')
  }
}