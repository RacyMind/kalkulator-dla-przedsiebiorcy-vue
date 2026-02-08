/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1565C0',
          dark: '#0D47A1',
          light: '#42A5F5',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
