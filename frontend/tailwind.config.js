/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 8s ease-in-out infinite alternate',
        'bounce-slow': 'bounce 4s infinite',
        'bounce-slower': 'bounce 7s infinite',
        'bounce-slowest': 'bounce 10s infinite',
        'fade-in': 'fadeIn 1.2s ease-in forwards',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
