// ============================================
// 6. EDIT QUOTE PAGE
// File: src/app/(dashboard)/quotes/[id]/page.tsx
// ============================================
'use client'

import { use } from 'react'

export default function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Quote #{id}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Quote editor will be implemented here...</p>
      </div>
    </div>
  )
}
