// ============================================
// 6. PDF GENERATION API ROUTE
// src/app/api/quotes/[id]/pdf/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { QuoteService } from '@/lib/services/quoteService'
import { PDFService } from '@/lib/services/pdfServices'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const quoteService = new QuoteService()
    const quote = await quoteService.getQuoteById(params.id)

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    const pdfService = new PDFService()
    const pdfBuffer = await pdfService.generateQuotePDF(quote)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quote-${quote.quote_number}.pdf"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}