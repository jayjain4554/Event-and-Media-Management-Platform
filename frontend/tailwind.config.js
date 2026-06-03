/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Notion/Linear inspired dark theme palette
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#38abfa',
          500: '#0e91eb', // primary accent
          600: '#0273c8',
          700: '#035ca2',
          800: '#074e85',
          900: '#0c426e',
          950: '#082a4a',
        },
        dark: {
          50: '#f6f6f7',
          100: 'var(--text-color)',
          200: '#dadfe3',
          300: 'var(--text-muted)',
          400: '#8f9da9',
          500: '#677584',
          600: '#4c5663',
          700: '#313841',
          800: 'var(--bg-dark-800)', // layout background dark
          900: 'var(--bg-color)', // deepest black
          950: 'var(--bg-dark-950)',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.05)',
          border: 'var(--border-color)',
          card: 'var(--card-bg)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 15px 1px rgba(14, 145, 235, 0.15)',
      }
    },
  },
  plugins: [],
}
