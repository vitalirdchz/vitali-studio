/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#050505',
          900: '#0A0A0A', // Main Deep Anthracite Background
          850: '#111111',
          800: '#161616', // Bento Surface 1
          750: '#1c1c1c',
          700: '#222222', // Bento Surface 2
          600: '#2c2c2c',
          500: '#404040',
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
