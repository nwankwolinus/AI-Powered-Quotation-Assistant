// ============================================
// SETTINGS API ROUTE - FIXED
// File: src/app/api/settings/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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
    // ✅ FIXED: Await createClient()
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { key, value } = body
    
    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: key and value' },
        { status: 400 }
      )
    }
    
    const settingsService = new SettingsService()
    const setting = await settingsService.updateSetting(key, value, user.id)

    return NextResponse.json(setting)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ============================================
// COMPLETE SETTINGS API WITH ALL METHODS
// ============================================

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { key, value, description } = body
    
    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: key and value' },
        { status: 400 }
      )
    }
    
    const settingsService = new SettingsService()
    const setting = await settingsService.createSetting({
      key,
      value,
      description,
      updated_by: user.id,
    })

    return NextResponse.json(setting, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    if (!key) {
      return NextResponse.json(
        { error: 'Missing required parameter: key' },
        { status: 400 }
      )
    }
    
    const settingsService = new SettingsService()
    await settingsService.deleteSetting(key)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}