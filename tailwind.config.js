/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        dark: {
          900: '#0D1117',
          800: '#161B22',
          700: '#21262D',
          600: '#30363D',
          500: '#484F58',
          400: '#6E7681',
        },
        // Accent colors (neon style)
        accent: {
          cyan: '#00D9FF',
          magenta: '#B24BF3',
          purple: '#8B5CF6',
          pink: '#EC4899',
          yellow: '#FFD93D',
          green: '#10B981',
          orange: '#F97316',
          red: '#EF4444',
        },
        // Semantic colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#00D9FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '6px',
      },
      boxShadow: {
        'card': '0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover': '0 0 20px rgba(0, 217, 255, 0.15)',
        'glow-cyan': '0 0 20px rgba(0, 217, 255, 0.3)',
        'glow-magenta': '0 0 20px rgba(178, 75, 243, 0.3)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
    },
  },
  plugins: [],
}
