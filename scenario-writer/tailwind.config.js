/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#f5f5f7',
        foreground: '#1d1d1f',
        primary: {
          DEFAULT: '#0071e3',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f5f5f7',
          foreground: '#1d1d1f',
        },
        muted: {
          DEFAULT: '#e5e5e7',
          foreground: '#86868b',
        },
        accent: {
          DEFAULT: '#0071e3',
          foreground: '#ffffff',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1d1d1f',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'neomorphic': '10px 10px 20px rgba(0, 0, 0, 0.03), -10px -10px 20px rgba(255, 255, 255, 0.7)',
        'glass': '0 4px 20px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 0 0 1px rgba(255, 255, 255, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
} 