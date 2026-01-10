// ============================================
// 9. SETTINGS PAGE
// File: src/app/(dashboard)/settings/page.tsx
// ============================================
'use client'

import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">System Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exchange Rate (USD to NGN)
              </label>
              <input
                type="number"
                defaultValue={1650}
                className="w-full max-w-xs px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Markup Percentage (%)
              </label>
              <input
                type="number"
                defaultValue={20}
                className="w-full max-w-xs px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Company Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                defaultValue="Power Projects Limited"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                defaultValue="40, NNPC Road, Ejigbo, Lagos"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}