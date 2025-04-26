/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Define custom colors if needed
      },
      zIndex: {
        1000: "1000",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
