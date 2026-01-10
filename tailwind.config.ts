// ============================================
// TAILWIND CONFIG WITH POWER PROJECTS BRANDING
// File: tailwind.config.ts
// ============================================

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Power Projects Limited Brand Colors
        ppl: {
          navy: {
            DEFAULT: '#1e3a8a', // Navy blue from logo
            50: '#f0f4ff',
            100: '#dbe4ff',
            200: '#bfd3ff',
            300: '#93b4ff',
            400: '#6089ff',
            500: '#3b5bdb',
            600: '#1e3a8a',
            700: '#1a2e6e',
            800: '#152452',
            900: '#0f1a3a',
          },
          red: {
            DEFAULT: '#dc2626', // Red from logo
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
          gold: {
            DEFAULT: '#f59e0b',
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'ppl': '0 4px 6px -1px rgba(30, 58, 138, 0.1), 0 2px 4px -1px rgba(30, 58, 138, 0.06)',
        'ppl-lg': '0 10px 15px -3px rgba(30, 58, 138, 0.1), 0 4px 6px -2px rgba(30, 58, 138, 0.05)',
        'ppl-xl': '0 20px 25px -5px rgba(30, 58, 138, 0.1), 0 10px 10px -5px rgba(30, 58, 138, 0.04)',
      },
      borderRadius: {
        'ppl': '0.75rem',
      },
    },
  },
  plugins: [],
};

export default config;