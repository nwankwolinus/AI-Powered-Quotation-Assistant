'use client'

import { useState } from 'react'

export default function TestAIPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function testAI() {
    setLoading(true)
    setResult('') // clear previous

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panelType: 'changeover',
          amperage: '5000',
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        setResult('❌ Error: ' + JSON.stringify(err))
      } else {
        const data = await response.json()
        setResult(JSON.stringify(data, null, 2))
      }
    } catch (err: any) {
      setResult('❌ Fetch failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>AI Test</h1>
      <button onClick={testAI} disabled={loading}>
        {loading ? 'Testing AI...' : 'Test AI Recommendation'}
      </button>
      <pre style={{ marginTop: 20, background: '#f5f5f5', padding: 20 }}>
        {result}
      </pre>
    </div>
  )
}
