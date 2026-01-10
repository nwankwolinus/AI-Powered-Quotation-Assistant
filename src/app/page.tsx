// ============================================
// 1. UPDATE ROOT PAGE (Redirect to Dashboard)
// File: src/app/page.tsx
// ============================================
import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to dashboard
  redirect('/dashboard')
}
