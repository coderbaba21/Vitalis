/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moss: {
          DEFAULT: '#2E4036',
          deep: '#1A2720',
          dark: '#223129',
          surface: '#364B40',
          light: '#476153',
          border: 'rgba(46, 64, 54, 0.25)',
        },
        clay: {
          DEFAULT: '#CC5833',
          hover: '#BA4A27',
          light: '#E26D48',
          glow: 'rgba(204, 88, 51, 0.35)',
        },
        cream: {
          DEFAULT: '#F2F0E9',
          light: '#FAF8F3',
          surface: '#EAE6DB',
          muted: '#8C887B',
          border: 'rgba(46, 64, 54, 0.12)',
        },
        charcoal: {
          DEFAULT: '#1A1A1A',
          deep: '#0F0F0F',
          surface: '#242424',
          card: '#1F1F1F',
          border: 'rgba(255, 255, 255, 0.12)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Outfit', 'system-ui', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.03em',
      },
      borderRadius: {
        '2rem': '2rem',
        '2.5rem': '2.5rem',
        '3rem': '3rem',
        '4rem': '4rem',
      },
      boxShadow: {
        'luxury': '0 20px 50px rgba(26, 39, 32, 0.08), 0 1px 3px rgba(26, 39, 32, 0.04)',
        'luxury-dark': '0 24px 60px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
        'glow-clay': '0 0 35px rgba(204, 88, 51, 0.45)',
        'glow-moss': '0 0 35px rgba(46, 64, 54, 0.35)',
      }
    },
  },
  plugins: [],
}
