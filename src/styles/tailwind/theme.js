// Tailwind theme configuration for Open Skillcapped
// Based on League of Legends/Hextech styling

const colors = {
  // League of Legends color palette
  lol: {
    "background-dark": "#010a13",
    "background-medium": "#0a1428",
    "blue-dark": "#091428",
    "background-light": "#0a323c",
    "gold-dark": "#785a28",
    "gold-medium": "#c8aa6e",
    "gold-light": "#f0e6d2",
    grey: "#3d424d",
    text: "#5b5a56",
    "text-muted": "#a09b8c",
  },
  // Hextech color palette
  hextech: {
    blue: "#0ac8b9",
    "blue-light": "#cdfafa",
    "blue-medium": "#0ac8b9",
    "blue-dark": "#005a82",
  },
};

module.exports = {
  colors,
  extend: {
    fontFamily: {
      beaufort: ['"Beaufort for LOL"', "serif"],
      spiegel: ['"Spiegel"', '"Spiegel Regular"', "sans-serif"],
    },
    boxShadow: {
      "hextech-hover": "0 8px 16px rgba(0, 0, 0, 0.3), 0 0 8px rgba(200, 170, 110, 0.2)",
      "hextech-active": "0 0 10px rgba(12, 200, 185, 0.3)",
    },
    backgroundImage: {
      "hextech-gradient": "linear-gradient(to bottom, #0ac8b9, #cdfafa, #0ac8b9)",
    },
  },
};
