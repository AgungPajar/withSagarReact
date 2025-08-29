/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#ffffff',
        'bg-secondary': '#F9F9F9',
        'color-main': '#0B409C',
        'color-secondary': '#FFE0AC',
      }
    },
  },
  plugins: [],
}

