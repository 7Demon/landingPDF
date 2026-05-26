/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bgCream: '#fbf8f3',
        bgCreamDark: '#f5efe6',
        textDark: '#1a1a1a',
        accentGold: '#c5a880',
        brandGreen: '#72886a',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
