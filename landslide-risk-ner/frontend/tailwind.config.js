/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        risk: {
          low: '#10b981',      // Emerald 500
          moderate: '#f59e0b', // Amber 500
          high: '#f97316',     // Orange 500
          critical: '#ef4444', // Red 500
        }
      }
    },
  },
  plugins: [],
}
