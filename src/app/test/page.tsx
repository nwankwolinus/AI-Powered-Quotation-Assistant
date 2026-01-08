'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestPage() {
  const [status, setStatus] = useState('Testing...')

  useEffect(() => {
    const runTest = async () => {
      try {
        const supabase = createClient()

        // Simple connectivity test
        const { error } = await supabase
          .from('settings')
          .select('id')
          .limit(1)

        if (error) {
          setStatus(`❌ Database connection failed: ${error.message}`)
        } else {
          setStatus('✅ Database connected successfully!')
        }
      } catch (err) {
        setStatus('❌ Unexpected error connecting to database')
      }
    }

    runTest()
  }, [])

  return (
    <div style={{ padding: 40 }}>
      <h1>System Test</h1>
      <p>{status}</p>
    </div>
  )
}
