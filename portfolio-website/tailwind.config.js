/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          400: "#e53e3e",
          500: "#c53030",
          600: "#9b2c2c",
        },
        gold: {
          400: "#f6e05e",
          500: "#d4af37",
          600: "#b7950b",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["Cinzel", "serif"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.7s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
      boxShadow: {
        premium:
          "0 10px 30px -12px rgba(15, 23, 42, 0.25), 0 8px 10px -8px rgba(99, 102, 241, 0.35)",
      },
    },
  },
  plugins: [],
};
