// ============================================
// MAIN DASHBOARD PAGE - WITH API INTEGRATION
// File: src/app/(dashboard)/page.tsx
// ============================================
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, CheckCircle, DollarSign, Brain, Loader2 } from 'lucide-react'

interface DashboardStats {
  totalQuotes: number
  approvedQuotes: number
  totalRevenue: number
  avgQuoteValue: number
  thisMonth: number
  aiAccuracy: number
  patternCount: number
  learningProgress: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalQuotes: 0,
    approvedQuotes: 0,
    totalRevenue: 0,
    avgQuoteValue: 0,
    thisMonth: 0,
    aiAccuracy: 0,
    patternCount: 0,
    learningProgress: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch dashboard stats from API
    const fetchStats = async () => {
      try {
        // Example API call - adjust endpoint as needed
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          // Use mock data if API not available
          setStats({
            totalQuotes: 45,
            approvedQuotes: 32,
            totalRevenue: 2450000000,
            avgQuoteValue: 54444444,
            thisMonth: 8,
            aiAccuracy: 87,
            patternCount: 156,
            learningProgress: 73
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Fallback to mock data
        setStats({
          totalQuotes: 45,
          approvedQuotes: 32,
          totalRevenue: 2450000000,
          avgQuoteValue: 54444444,
          thisMonth: 8,
          aiAccuracy: 87,
          patternCount: 156,
          learningProgress: 73
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleCreateQuote = () => {
    // Navigate to quotes page with new quote action
    router.push('/dashboard/quotes/new')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Total Quotes</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalQuotes}</div>
            <div className="text-sm text-gray-500">{stats.thisMonth} this month</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Approved</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.approvedQuotes}</div>
            <div className="text-sm text-gray-500">
              {stats.totalQuotes > 0 
                ? ((stats.approvedQuotes / stats.totalQuotes) * 100).toFixed(0) 
                : 0}% rate
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span>Revenue</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ₦{(stats.totalRevenue / 1000000000).toFixed(2)}B
            </div>
            <div className="text-sm text-gray-500">
              Avg: ₦{(stats.avgQuoteValue / 1000000).toFixed(1)}M
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
              <Brain className="w-4 h-4 text-orange-600" />
              <span>AI Accuracy</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.aiAccuracy}%</div>
            <div className="text-sm text-gray-500">{stats.patternCount} patterns</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">🚀 System Ready!</h2>
          <p className="text-blue-100 mb-4">
            Your AI-powered quotation system is fully operational. Start creating quotes with intelligent recommendations.
          </p>
          <button 
            onClick={handleCreateQuote}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Create New Quote
          </button>
        </div>
      </div>
    </div>
  )
}