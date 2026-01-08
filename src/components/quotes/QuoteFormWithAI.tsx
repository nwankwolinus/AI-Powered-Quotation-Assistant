// ============================================
// 14. USAGE EXAMPLE IN FRONTEND COMPONENT
// src/components/quotes/QuoteFormWithAI.tsx
// ============================================
/*
'use client'

import { useState, useEffect } from 'react'
import { useCreateQuote } from '@/lib/hooks/useQuotes'
import { useComponents } from '@/lib/hooks/useComponents'

export function QuoteFormWithAI() {
  const [panelType, setPanelType] = useState('')
  const [mainAmperage, setMainAmperage] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<any>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  const createQuote = useCreateQuote()
  const { data: components } = useComponents()

  // Get AI recommendations when user enters requirements
  const handleGetRecommendations = async () => {
    setIsLoadingAI(true)
    
    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panelType,
          amperage: mainAmperage,
        }),
      })

      const data = await response.json()
      setAiSuggestions(data)
    } catch (error) {
      console.error('Failed to get AI recommendations:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  return (
    <div>
      <h2>Create New Quote with AI Assistance</h2>
      
      <div>
        <input
          type="text"
          placeholder="Panel Type (e.g., Changeover, Synchronization)"
          value={panelType}
          onChange={(e) => setPanelType(e.target.value)}
        />
        
        <input
          type="text"
          placeholder="Main Amperage (e.g., 5000)"
          value={mainAmperage}
          onChange={(e) => setMainAmperage(e.target.value)}
        />

        <button 
          onClick={handleGetRecommendations}
          disabled={isLoadingAI}
        >
          {isLoadingAI ? 'Getting AI Recommendations...' : 'Get AI Suggestions'}
        </button>
      </div>

      {aiSuggestions && (
        <div className="ai-suggestions">
          <h3>AI Recommendations</h3>
          <pre>{JSON.stringify(aiSuggestions, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
*/

// ============================================
// 15. AI LEARNING DOCUMENTATION
// ============================================
/*
# AI Learning System Overview

## How the AI Learns:

1. **Pattern Recognition**
   - Analyzes approved quotes to identify common configurations
   - Tracks which components are frequently paired together
   - Learns pricing patterns and vendor preferences

2. **Continuous Learning**
   - Background worker runs every hour
   - Processes new approved quotes automatically
   - Updates confidence scores based on usage

3. **Autonomous Actions**
   - Suggests components based on requirements
   - Optimizes vendor selection for cost
   - Recommends panel configurations
   - Identifies pricing anomalies

4. **Feedback Loop**
   - Tracks which recommendations are accepted/rejected
   - Adjusts confidence scores accordingly
   - Improves over time with more data

## AI Capabilities:

1. **Component Auto-Suggestion**
   - Input: Panel type, amperage, number of outgoings
   - Output: Complete component list with specifications

2. **Price Optimization**
   - Analyzes historical pricing
   - Suggests cost-effective vendor combinations
   - Flags unusual pricing

3. **Configuration Templates**
   - Learns common panel setups
   - Auto-fills based on similar past quotes
   - Speeds up quote creation

4. **Trend Analysis**
   - Monthly reports on quoting patterns
   - Client preference insights
   - Market trend identification

## Getting Started:

1. Create and approve several quotes manually
2. AI will start learning patterns after 10+ approved quotes
3. Access AI recommendations via "Get AI Suggestions" button
4. Review and accept/reject recommendations
5. System improves with each interaction

## Privacy & Security:

- All learning happens on your data only
- No external data sharing
- Patterns stored securely in your database
- Full control over AI recommendations
*/pabase = createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw new Error(error.message)

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...body,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
