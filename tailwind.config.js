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
    },
  },
  plugins: [components],
};
