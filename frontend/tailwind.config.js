/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0b0f19',
          card: '#131b2e',
          accent: '#8b5cf6',
          cyan: '#06b6d4',
          rose: '#f43f5e',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
