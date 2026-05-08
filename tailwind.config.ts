import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        smell: '#ef4444',
        'smell-light': '#fef2f2',
        'smell-border': '#fecaca',
        clean: '#10b981',
        'clean-light': '#f0fdf4',
        'clean-border': '#a7f3d0',
        warn: '#f59e0b',
        'warn-light': '#fffbeb',
        'warn-border': '#fde68a',
        neutral: '#6b7280',
        surface: '#f8fafc',
        border: '#e2e8f0',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['IBM Plex Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)',
        'gradient-teal': 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
        'gradient-warm': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        'gradient-surface': 'linear-gradient(135deg, #eef2ff 0%, #fae8ff 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config

