// ============================================
// FIXED: AI PRICE LIST PARSING API
// src/app/api/ai/parse-pricelist/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AIService } from '@/lib/services/aiService'
import { ComponentService } from '@/lib/services/componentService' // ✅ Import the class, not a function

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { text } = body

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // AI extraction
    const aiService = new AIService()
    const extractedComponents = await aiService.extractPriceListFromText(text)

    // ✅ FIX: Create instance of ComponentService
    const componentService = new ComponentService()
    const savedComponents = []

    for (const comp of extractedComponents) {
      try {
        // ✅ FIX: Call method on the instance and add created_by
        const saved = await componentService.createComponent({
          ...comp,
          created_by: user.id,
        })
        savedComponents.push(saved)
      } catch (err) {
        console.error('Error saving component:', err)
      }
    }

    return NextResponse.json({
      success: true,
      extracted: extractedComponents.length,
      saved: savedComponents.length,
      components: savedComponents,
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


