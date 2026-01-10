'use client'

import { useState } from 'react'

export default function APITestPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function testComponents() {
    setLoading(true)
    try {
      const response = await fetch('/api/components')
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error: any) {
      setResult('Error: ' + error.message)
    }
    setLoading(false)
  }

  async function testCreateComponent() {
    setLoading(true)
    try {
      const response = await fetch('/api/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor: 'Schneider',
          item: 'ACB',
          model: 'EDO 5000A 4P Test',
          manufacturer: 'Schneider',
          price: 38000000,
          currency: 'NGN',
          amperage: '5000',
          poles: '4P',
          type: 'ACB',
          category: 'breaker',
        }),
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error: any) {
      setResult('Error: ' + error.message)
    }
    setLoading(false)
  }

  async function testQuotes() {
    setLoading(true)
    try {
      const response = await fetch('/api/quotes')
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error: any) {
      setResult('Error: ' + error.message)
    }
    setLoading(false)
  }

  async function testAIParsing() {
    setLoading(true)
    try {
      const sampleText = `
        SCHNEIDER ELECTRIC PRICE LIST
        
        1. ACB EDO 5000A 4P - NGN 38,000,000
        2. MCCB NSX 630A 4P - NGN 850,000
        3. Digital Meter PM5100 - NGN 320,000
        4. 4000A Copper Busbar - NGN 2,800,000
      `
      
      const response = await fetch('/api/ai/parse-pricelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sampleText }),
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error: any) {
      setResult('Error: ' + error.message)
    }
    setLoading(false)
  }

  async function testAIRecommendations() {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panelType: 'changeover',
          amperage: '5000',
        }),
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error: any) {
      setResult('Error: ' + error.message)
    }
    setLoading(false)
  }

  async function testSettings() {
    setLoading(true)
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error: any) {
      setResult('Error: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1 style={{ marginBottom: '30px' }}>API Route Testing Dashboard</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Component Routes</h2>
        <button onClick={testComponents} disabled={loading} style={buttonStyle}>
          GET /api/components
        </button>
        <button onClick={testCreateComponent} disabled={loading} style={buttonStyle}>
          POST /api/components
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Quote Routes</h2>
        <button onClick={testQuotes} disabled={loading} style={buttonStyle}>
          GET /api/quotes
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>AI Routes</h2>
        <button onClick={testAIParsing} disabled={loading} style={buttonStyle}>
          POST /api/ai/parse-pricelist
        </button>
        <button onClick={testAIRecommendations} disabled={loading} style={buttonStyle}>
          POST /api/ai/recommend
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Settings Routes</h2>
        <button onClick={testSettings} disabled={loading} style={buttonStyle}>
          GET /api/settings
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Response:</h2>
        <pre style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '20px',
          borderRadius: '8px',
          overflow: 'auto',
          maxHeight: '500px',
        }}>
          {loading ? 'Loading...' : result || 'Click a button to test an endpoint'}
        </pre>
      </div>
    </div>
  )
}

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  margin: '5px',
  background: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
}