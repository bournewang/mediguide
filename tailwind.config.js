/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d8efff",
          200: "#b9e3ff",
          300: "#89d2ff",
          400: "#52b7ff",
          500: "#2497ff",
          600: "#0d76f0",
          700: "#105fd3",
          800: "#154ea9",
          900: "#174381"
        },
        accent: {
          50: "#f8f7f2",
          100: "#f0ede3",
          200: "#e2dccb",
          300: "#d3c8ad",
          400: "#bca983",
          500: "#a58b5e",
          600: "#8a7249",
          700: "#6f5b3c",
          800: "#584933",
          900: "#493d2d"
        }
      },
      boxShadow: {
        soft: "0 12px 36px rgba(15, 23, 42, 0.06)"
      }
    }
  },
  plugins: []
};
