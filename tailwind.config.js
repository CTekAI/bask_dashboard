/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blanco: '#FAF7F5',
          ivory: '#F8F2E9',
          mist: '#B8CAC6',
          stone: '#D1C7BB',
          palm: '#47471F',
          charcoal: '#212121',
        },
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

