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
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12"
        }
      },
      boxShadow: {
        soft: "0 16px 60px rgba(16, 45, 76, 0.08)"
      }
    }
  },
  plugins: []
};
