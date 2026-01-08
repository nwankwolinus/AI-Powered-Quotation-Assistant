// ============================================
// 3. AI IMPORT API ROUTE
// src/app/api/components/import/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { AIService } from '@/lib/services/aiService'
import { ComponentService } from '@/lib/services/componentService'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const text = formData.get('text') as string

    let extractedText = text

    // If file is provided, extract text from it
    if (file) {
      if (file.type === 'application/pdf') {
        // For PDF: You'd use a library like pdf-parse
        // For now, assuming text is provided
        extractedText = text || 'PDF text extraction would go here'
      } else if (file.type.includes('sheet') || file.name.endsWith('.xlsx')) {
        // For Excel: You'd use a library like xlsx
        extractedText = text || 'Excel extraction would go here'
      }
    }

    // Use AI to extract components
    const aiService = new AIService()
    const extractedComponents = await aiService.extractPriceListFromText(extractedText)

    // Save to database
    const componentService = new ComponentService()
    const savedComponents = []

    for (const comp of extractedComponents) {
      try {
        const saved = await componentService.createComponent(comp, user.id)
        savedComponents.push(saved)
      } catch (error) {
        console.error('Error saving component:', error)
      }
    }

    return NextResponse.json({
      success: true,
      imported: savedComponents.length,
      components: savedComponents,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}