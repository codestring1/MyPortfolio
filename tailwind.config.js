/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberBlack: 'var(--cyber-black)',
        deepSpace: 'var(--deep-space)',
        neonCyan: 'rgb(var(--neon-cyan-rgb) / <alpha-value>)',
        errorRed: 'rgb(var(--error-red-rgb) / <alpha-value>)',
        neonPurple: 'rgb(var(--neon-purple-rgb) / <alpha-value>)',
        cyberYellow: 'rgb(var(--cyber-yellow-rgb) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
        'cyan-glow': 'radial-gradient(ellipse at center, rgba(0,229,255,0.15) 0%, transparent 70%)',
        'purple-glow': 'radial-gradient(ellipse at center, rgba(213,0,249,0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid-size': '40px 40px',
      },
      animation: {
        'pulse-cyan': 'pulseCyan 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        pulseCyan: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0,229,255,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0,229,255,0.8), 0 0 40px rgba(0,229,255,0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0,229,255,0.4), 0 0 40px rgba(0,229,255,0.2)',
        'purple-glow': '0 0 20px rgba(213,0,249,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}