/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { primary: "#0ea5b9", dark: "#0b0f14" },
      container: { center: true, padding: "1rem" },
    },
  },
  plugins: [],
};
