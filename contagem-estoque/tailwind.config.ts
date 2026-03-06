import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0f14',
        card: '#111827',
        card2: '#0f172a',
        stroke: 'rgba(255,255,255,0.08)',
        muted: 'rgba(255,255,255,0.7)',
        primary: '#2563eb',
      },
      borderRadius: { xl: '1.25rem' },
      boxShadow: { soft: '0 10px 30px rgba(0,0,0,0.35)' },
    },
  },
  plugins: [],
}

export default config
