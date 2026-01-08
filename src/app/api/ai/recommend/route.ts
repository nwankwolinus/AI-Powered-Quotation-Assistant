// ============================================
// 8. AI RECOMMENDATIONS API
// src/app/api/ai/recommend/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { AILearningService } from '@/lib/services/aiLearningService'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get request body
    const { panelType, amperage } = await request.json()
    if (!panelType || !amperage) {
      return NextResponse.json({ error: 'panelType and amperage are required' }, { status: 400 })
    }

    // Use your AI Learning service
    const aiLearningService = new AILearningService()
    const recommendations = await aiLearningService.getRecommendations(panelType, amperage)

    return NextResponse.json(recommendations)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
