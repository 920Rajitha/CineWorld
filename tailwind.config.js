/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Outfit'", "sans-serif"],
      },
      colors: {
        primary: "#8b5cf6",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),        // ✨ Animations like fade-in
    require("tailwind-scrollbar-hide"),    // ✅ Hide scrollbar in horizontal sliders
  ],
};
