// ============================================
// 10. API Route: Settings
// src/app/api/settings/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { SettingsService } from '@/lib/services/settingsService'

export async function GET(request: NextRequest) {
  try {
    const settingsService = new SettingsService()
    const settings = await settingsService.getAllSettings()

    return NextResponse.json(settings)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { key, value } = body
    
    const settingsService = new SettingsService()
    const setting = await settingsService.updateSetting(key, value, user.id)

    return NextResponse.json(setting)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}