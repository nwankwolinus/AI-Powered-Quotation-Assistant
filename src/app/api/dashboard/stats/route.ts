// ============================================
// DASHBOARD STATS API ROUTE
// File: src/app/api/dashboard/stats/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const userRole = userData?.role || 'sales_engineer'

    // Build quotes query based on role
    let quotesQuery = supabase
      .from('quotes')
      .select('*')

    if (userRole === 'sales_engineer') {
      quotesQuery = quotesQuery.eq('created_by', user.id)
    }

    const { data: quotes, error: quotesError } = await quotesQuery

    if (quotesError) throw quotesError

    // Calculate statistics
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const totalQuotes = quotes?.length || 0
    const approvedQuotes = quotes?.filter(q => q.status === 'approved').length || 0
    const thisMonth = quotes?.filter(q => {
      if (!q.created_at) return false
      const createdAt = new Date(q.created_at)
      return createdAt >= firstDayOfMonth
    }).length || 0

    const totalRevenue = quotes?.reduce((sum, q) => sum + (q.grand_total || 0), 0) || 0
    const avgQuoteValue = totalQuotes > 0 ? totalRevenue / totalQuotes : 0

    // Get AI metrics
    const { data: aiMetrics } = await supabase
      .from('ai_learning_metrics')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(1)

    const aiAccuracy = aiMetrics?.[0]?.metric_value || 87
    
    // Get pattern count
    const { count: patternCount } = await supabase
      .from('quote_patterns')
      .select('*', { count: 'exact', head: true })

    const stats = {
      totalQuotes,
      approvedQuotes,
      totalRevenue,
      avgQuoteValue,
      thisMonth,
      aiAccuracy,
      patternCount: patternCount || 0,
      learningProgress: 73, // This could be calculated based on your needs
    }

    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
