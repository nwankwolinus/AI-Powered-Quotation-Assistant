// ============================================
// 4. QUOTES LIST PAGE
// File: src/app/(dashboard)/quotes/page.tsx
// ============================================
'use client'

import { FileText } from 'lucide-react'
import Link from 'next/link'

export default function QuotesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotations</h1>
          <p className="text-gray-600 mt-1">Manage all your quotations</p>
        </div>
        <Link
          href="/quotes/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          New Quote
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 text-center py-12">
          No quotes yet. Create your first quote to get started!
        </p>
      </div>
    </div>
  )
}
