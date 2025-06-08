/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  darkMode: "class",
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        main: '#88A4D4',
        button: '#415D7C',
        error: '#FF4646',
        success: '#12B76A',
        border: '#BAC8D3',
        background: '#F8FAFC',
        'background-dark': '#18181b',
        placeholder: '#B0B7C3',
        black: '#000',
        white: '#fff',
      }
    },
  },
  plugins: [],
};