/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design Tokens Studio Digital Premium
        studio: {
          bg: '#0B0D12',           // Fond principal
          secondary: '#11151D',    // Fond secondaire
          card: '#1A1F2B',         // Cartes
          surface: '#232A38',      // Surfaces surélevées
          border: '#394150',       // Bordures
          borderHover: '#8EAFFF',  // Bordures hover
          title: '#F5F6F8',        // Titres
          text: '#D6DCE6',         // Texte principal
          muted: '#B6C0D0',        // Texte secondaire
          accent: '#8EAFFF',       // Bleu électrique doux
          accentHover: '#B3CAFF',  // Bleu accent hover
        },
        dark: {
          950: '#06070A',
          900: '#0B0D12', // Fond principal
          850: '#11151D', // Fond secondaire
          800: '#1A1F2B', // Cartes
          750: '#232A38', // Surfaces surélevées
          700: '#2D3546',
          600: '#394150', // Bordures
          500: '#4D586D',
          400: '#717F9A',
        },
        accent: {
          DEFAULT: '#8EAFFF',
          hover: '#B3CAFF',
          subtle: 'rgba(142, 175, 255, 0.12)',
          glow: 'rgba(142, 175, 255, 0.08)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #8EAFFF, #B3CAFF)',
        'gradient-card': 'linear-gradient(180deg, rgba(35, 42, 56, 0.4) 0%, rgba(26, 31, 43, 0.9) 100%)',
      },
    },
  },
  plugins: [],
};
