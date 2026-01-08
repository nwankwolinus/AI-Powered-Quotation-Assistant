// ============================================
// 8. API Route: GET/POST Components
// src/app/api/components/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ComponentService } from '@/lib/services/componentService'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vendor = searchParams.get('vendor') || undefined
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined

    const componentService = new ComponentService()
    const components = await componentService.getAllComponents({ vendor, category, search })

    return NextResponse.json(components)
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
    
    const componentService = new ComponentService()
    const component = await componentService.createComponent(body, user.id)

    return NextResponse.json(component, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}