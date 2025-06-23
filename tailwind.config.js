/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./ai-therapy-app/client/index.html", "./ai-therapy-app/client/src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
