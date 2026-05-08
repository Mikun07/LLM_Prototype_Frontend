import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#3b5bdb',
          600: '#2f4ac4',
          700: '#243aac',
          900: '#131e5e',
        },
        smell: '#dc2626',
        clean: '#16a34a',
        warn: '#d97706',
        neutral: '#6b7280',
        surface: '#f8fafc',
        border: '#e2e8f0',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['IBM Plex Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config

