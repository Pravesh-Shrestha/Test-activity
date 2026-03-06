/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'birthday-pink': '#FFC0CB',
        'birthday-gold': '#FFD700',
        'birthday-sky': '#87CEEB',
      },
      fontFamily: {
        'happy': ['"Comic Sans MS"', 'cursive', 'sans-serif'], // Or a better font import
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}