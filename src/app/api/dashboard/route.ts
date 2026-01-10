
// ============================================
// COMPLETE DASHBOARD API
// File: src/app/api/dashboard/route.ts
// ============================================
// ✅ Add these at the top of EVERY API route file
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET_DASHBOARD(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    const userRole = userData?.role || 'sales_engineer'

    // Get quotes
    let quotesQuery = supabase.from('quotes').select('*')
    if (userRole === 'sales_engineer') {
      quotesQuery = quotesQuery.eq('created_by', user.id)
    }
    const { data: quotes } = await quotesQuery

    // Get clients
    let clientsQuery = supabase.from('clients').select('*')
    if (userRole === 'sales_engineer') {
      clientsQuery = clientsQuery.eq('user_id', user.id)
    }
    const { data: clients } = await clientsQuery

    // Get recent activity (last 5 quotes)
    let recentQuery = supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    if (userRole === 'sales_engineer') {
      recentQuery = recentQuery.eq('created_by', user.id)
    }
    const { data: recentQuotes } = await recentQuery

    // Calculate stats
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const dashboard = {
      user: {
        id: user.id,
        email: user.email,
        role: userRole,
        name: userData?.full_name || user.email,
      },
      stats: {
        totalQuotes: quotes?.length || 0,
        approvedQuotes: quotes?.filter(q => q.status === 'approved').length || 0,
        pendingQuotes: quotes?.filter(q => q.status === 'sent').length || 0,
        draftQuotes: quotes?.filter(q => q.status === 'draft').length || 0,
        totalClients: clients?.length || 0,
        thisMonth: quotes?.filter(q => {
          if (!q.created_at) return false
          const createdAt = new Date(q.created_at)
          return createdAt >= firstDayOfMonth
        }).length || 0,
        totalRevenue: quotes?.reduce((sum, q) => sum + (q.grand_total || 0), 0) || 0,
      },
      recentActivity: recentQuotes,
    }

    return NextResponse.json(dashboard)
  } catch (error: any) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
