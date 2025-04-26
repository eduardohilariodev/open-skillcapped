// Tailwind component utilities for common elements
const plugin = require("tailwindcss/plugin");

module.exports = plugin(({ addComponents }) => {
  addComponents({
    // Episode item styling
    ".episode-item-base": {
      "@apply mb-3 flex items-center": {},
      "&:last-child": {
        "@apply mb-0": {},
      },
    },

    // Episode card styling
    ".episode-card-base": {
      "@apply bg-background-medium/30 border border-gold-dark rounded py-2 px-3 flex justify-between items-center cursor-pointer transition-all":
        {},
      "@apply hover:shadow-hextech-hover hover:bg-background-medium/50 hover:border-gold-medium": {},
    },

    // Episode content area
    ".episode-content-base": {
      "@apply flex-1 flex items-center": {},
    },

    // Episode number styling
    ".episode-number-base": {
      "@apply relative left-0 min-w-6 h-6 flex items-center justify-center bg-transparent text-blue-medium font-bold font-beaufort border-0 mr-0 flex-shrink-0":
        {},
    },

    // Episode separator
    ".episode-separator-base": {
      "@apply text-gold-dark mx-2 opacity-60": {},
    },

    // Episode title styling
    ".episode-title-base": {
      "@apply text-gold-light text-sm font-medium": {},
      "&.watched": {
        "@apply text-text-muted": {},
      },
    },

    // Episode actions area
    ".episode-actions-base": {
      "@apply flex gap-3 ml-3 pl-3": {},
      "@apply sm:gap-2 sm:ml-2 sm:pl-2": {},
    },

    // Highlight styling for search matches
    ".highlight-base": {
      "@apply bg-blue-medium/20 text-blue-light px-1 py-0.5 rounded relative font-medium": {},
      "@apply hover:after:scale-x-100 hover:after:origin-bottom-left": {},
      "&::after": {
        '@apply content-[""] absolute bottom-0 left-0 w-full h-px bg-blue-medium scale-x-0 origin-bottom-right transition-transform duration-300':
          {},
      },
    },
  });
});
