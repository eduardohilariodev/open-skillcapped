/** @type {import('tailwindcss').Config} */
import theme from "./src/styles/tailwind/theme.js";
import components from "./src/styles/tailwind/components.js";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      ...theme.extend,
      colors: {
        ...theme.colors.lol,
        ...theme.colors.hextech,
      },
      zIndex: {
        1000: "1000",
      },
      borderWidth: {
        3: "3px",
      },
      boxShadow: {
        "hextech-gold": "0 0 0.5rem rgba(200, 170, 110, 0.4), inset 0 0 0.25rem #f0e6d2",
        "hextech-gold-hover": "0 0.25rem 0.75rem rgba(200, 170, 110, 0.5), inset 0 0 0.5rem #c8aa6e",
        "hextech-gold-active": "0 0 0.25rem rgba(200, 170, 110, 0.3)",
        "hextech-blue": "0 0 0.5rem rgba(10, 200, 185, 0.4), inset 0 0 0.25rem #cdfafa",
        "hextech-blue-hover": "0 0.25rem 0.75rem rgba(10, 200, 185, 0.5), inset 0 0 0.5rem #0ac8b9",
        "hextech-blue-active": "0 0 0.25rem rgba(10, 200, 185, 0.3)",
        "hextech-hover": "0 4px 8px rgba(200, 170, 110, 0.15)",
      },
    },
  },
  plugins: [components],
};
