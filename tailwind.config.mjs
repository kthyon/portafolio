/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CBFF',
          300: '#66B2FF',
          400: '#3399FF',
          500: '#007AFF',
          600: '#0062CC',
          700: '#004999',
          800: '#003166',
          900: '#001833',
        },
        secondary: {
          DEFAULT: '#6B7280',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        dark: {
          DEFAULT: '#1F2937',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        brand: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'typewriter': 'typewriter 4s steps(30, end) 1s forwards',
        'blink-cursor': 'blinkCursor 1s infinite 5s',
        'hide-cursor': 'hideCursor 500ms 11s forwards',
        'text-shine': 'textShine 3s 6s forwards',
      },
      keyframes: {
        typewriter: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        blinkCursor: {
          '0%, 50%, 100%': { borderColor: 'rgb(255, 255, 255)' },
          '25%, 75%': { borderColor: 'transparent' },
        },
        hideCursor: {
          to: { borderColor: 'transparent' },
        },
        textShine: {
          '0%, 100%': { left: '-100%' },
          '50%': { left: '100%' },
        },
      },
    },
  },
  plugins: [],
} 