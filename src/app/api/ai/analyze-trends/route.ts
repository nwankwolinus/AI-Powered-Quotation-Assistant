// ============================================
// 9. AUTONOMOUS AI ACTIONS API
// src/app/api/ai/analyze-trends/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { AILearningService } from '@/lib/services/aiLearningService'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const aiLearningService = new AILearningService()
    const analysis = await aiLearningService.analyzeQuotingTrends()

    return NextResponse.json(analysis)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}