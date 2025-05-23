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
        primary: {
          light: '#ffffff',
          dark: '#242424',
        },
        text: {
          light: '#213547',
          dark: 'rgba(255, 255, 255, 0.87)',
        }
      }
    },
  },
  plugins: [],
}
