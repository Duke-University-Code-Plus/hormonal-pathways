/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        darkIndigo: '#312e81',
      }
    },
    screens: {
      'sm': '958px',
    }
  },
  plugins: [],
}

