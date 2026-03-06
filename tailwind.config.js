/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pink': {
          100: '#fff0f3',
          200: '#ffccd5',
          300: '#ffb3c1',
          400: '#ff8fa3',
          500: '#ff758f',
          600: '#ff4d6d',
          700: '#c9184a',
        },
        'gold': '#ffd700',
        'cream': '#fdfaf6',
      },
      fontFamily: {
        sans: ['"Quicksand"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        hand: ['"Dancing Script"', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wiggle: {
            '0%, 100%': { transform: 'rotate(-3deg)' },
            '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}