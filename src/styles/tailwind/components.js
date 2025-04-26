// Tailwind component utilities for common elements
const plugin = require("tailwindcss/plugin");

/**
 * Note: Episode styling previously defined here has been migrated directly into components
 * using Tailwind utility classes. See CourseSearchResultVideo.tsx for an example.
 */

module.exports = plugin(({ addComponents }) => {
  addComponents({
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
