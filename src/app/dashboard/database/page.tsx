// ============================================
// 7. DATABASE PAGE
// File: src/app/(dashboard)/database/page.tsx
// ============================================
'use client'

import { Database } from 'lucide-react'

export default function DatabasePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Component Database</h1>
          <p className="text-gray-600 mt-1">Manage breakers, busbars, and accessories</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Import Price List
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 text-center py-12">
          Component database interface will be implemented here...
        </p>
      </div>
    </div>
  )
}