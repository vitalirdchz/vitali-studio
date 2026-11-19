/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060608',
          900: '#09090B', // Main Deep Pure Anthracite Background
          850: '#0E0E11',
          800: '#111113', // Bento Surface 1
          750: '#161619',
          700: '#1A1A1E', // Bento Surface 2
          600: '#27272A',
          500: '#3F3F46',
        },
        studio: {
          bg: '#09090B',
          card: '#111113',
          cardHover: '#161619',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(99, 102, 241, 0.25)',
          light: '#F5F5F7',
          muted: '#A1A1AA',
          subtle: '#71717A',
          indigo: '#6366F1',
          indigoLight: '#818CF8',
        },
        indigo: {
          DEFAULT: '#6366F1',
          soft: '#818CF8',
          subtle: 'rgba(99, 102, 241, 0.12)',
          glow: 'rgba(99, 102, 241, 0.09)',
        },
        tech: {
          bg: '#0A0A0A',
          card: '#121212',
          cardHover: '#181818',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.18)',
          light: '#F3F4F6',
          muted: '#9CA3AF',
          subtle: '#6B7280',
          accent: '#00F2FE',
        },
        accent: {
          rose: '#FF0050',
          cyan: '#00F2FE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #FF0050, #00F2FE)',
        'gradient-tech': 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
      },
    },
  },
  plugins: [],
};
