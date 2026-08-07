/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aerospace-dark': '#0b0f19',
        'aerospace-panel': '#161b22',
        'aerospace-accent': '#00f0ff',
      }
    },
  },
  plugins: [],
}
