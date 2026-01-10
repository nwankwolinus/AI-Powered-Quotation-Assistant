// ============================================
// UPDATED DASHBOARD LAYOUT WITH PPL BRANDING
// File: src/app/(dashboard)/layout.tsx
// ============================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  LayoutDashboard, FileText, Database, Users, 
  Settings, Menu, X, Bell, Search
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'quotes', label: 'Quotes', icon: FileText, href: '/dashboard/quotes' },
  { id: 'database', label: 'Database', icon: Database, href: '/dashboard/database' },
  { id: 'clients', label: 'Clients', icon: Users, href: '/dashboard/clients' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-ppl-navy-700 via-ppl-navy-600 to-ppl-navy-700 text-white shadow-ppl-lg sticky top-0 z-50 border-b-4 border-ppl-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 bg-white rounded-lg p-2 shadow-lg">
                <div className="w-12 h-12 bg-ppl-navy rounded-lg flex items-center justify-center border-2 border-ppl-red">
                  <span className="text-ppl-red text-2xl font-black">P</span>
                </div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Power Projects Ltd
                </h1>
                <p className="text-xs text-blue-200 font-medium tracking-wide">
                  AI-Powered LV Panel Quotation System
                </p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Bar - Desktop */}
              <div className="hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quotes..."
                    className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-ppl-red focus:border-transparent w-64"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-ppl-red rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <div className="text-right hidden md:block">
                  <div className="text-xs text-blue-200">Welcome back,</div>
                  <div className="text-sm font-semibold text-white">Sales Engineer</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-ppl-red to-red-700 rounded-lg flex items-center justify-center shadow-lg border-2 border-white/20">
                  <span className="text-white text-sm font-bold">SE</span>
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-md sticky top-20 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`
                    relative flex items-center space-x-2 px-6 py-4 
                    font-medium text-sm transition-all duration-200
                    ${isActive
                      ? 'text-ppl-red bg-red-50 border-b-3 border-ppl-red'
                      : 'text-gray-600 hover:text-ppl-navy hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-ppl-red' : ''}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-ppl-red to-red-600"></div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-black/50 backdrop-blur-sm z-40">
          <div className="bg-white shadow-2xl max-w-sm mx-auto mt-4 rounded-xl overflow-hidden">
            <nav className="px-4 py-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-4 rounded-xl mb-1
                      font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-ppl-navy to-ppl-navy-600 text-white shadow-ppl'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-8">{children}</main>

      {/* Footer */}
      <footer className="bg-ppl-navy-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-ppl-red text-xl font-black">P</span>
              </div>
              <div>
                <div className="font-bold">Power Projects Limited</div>
                <div className="text-xs text-blue-300">Excellence in Electrical Solutions</div>
              </div>
            </div>
            <div className="text-sm text-blue-200">
              © 2024 Power Projects Ltd. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}