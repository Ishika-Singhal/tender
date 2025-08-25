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
        light: {
          bg: '#F9FAFB',
          primary: '#2563EB',
          secondary: '#1E293B',
          text: '#111827',
          success: '#10B981',
          danger: '#EF4444'
        },
        dark: {
          bg: '#0F172A',
          primary: '#3B82F6',
          secondary: '#CBD5E1',
          text: '#F9FAFB',
          success: '#22C55E',
          danger: '#F87171'
        }
      }
    },
  },
  plugins: [],
}
