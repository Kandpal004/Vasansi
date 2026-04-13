/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#0F0D1A",
        burgundy: "#810621",
        gold: "#ac7783",
        cream: "#F8F5F0",
      },
      fontFamily: {
        serif: ["Proza Libre", "Georgia", "serif"],
        sans: ["Jost", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
