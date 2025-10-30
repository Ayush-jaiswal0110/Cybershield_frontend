/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        background: "#0b1220",
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          card: '#334155',
          text: '#f1f5f9',
          textSecondary: '#cbd5e1',
          border: '#475569',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
