# Removing Tailwind CSS from the Project

If you need to remove Tailwind CSS from the project in the future, follow these steps to safely do so:

## Step 1: Remove Tailwind Packages

Remove all Tailwind-related packages:

```powershell
npm uninstall tailwindcss @tailwindcss/vite postcss
```

## Step 2: Delete Configuration Files

Remove Tailwind configuration files:

1. Delete `tailwind.config.js` from the project root
2. Delete `postcss.config.mjs` (if it exists)
3. Delete the `src/styles/tailwind` directory

## Step 3: Update CSS Imports

1. Remove Tailwind directives from your global CSS file
2. Replace imports for Tailwind with your alternative CSS framework

Example update to `src/styles/globals.css`:

```css
/* Remove this line */
@import 'tailwindcss';

/* Add imports to your alternative CSS framework */
@import './hextech-global.css';
@import './hextech-magic.css';
@import './hextech-animations.css';
```

## Step 4: Update Components

Replace Tailwind classes in your components with your custom CSS classes. For example:

```jsx
// From Tailwind
<li className="episode-item-base">
  <div className="episode-card-base">...</div>
</li>

// To custom CSS
<li className="episode-item">
  <div className="episode-card">...</div>
</li>
```

## Step 5: Update Build Configuration

Update any build configuration that might reference Tailwind:

1. Remove Tailwind plugin from your Vite config if you added it
2. Update any scripts that might reference Tailwind

## Common Issues

### Next.js Components Not Displaying Properly

If components like `next/font` and `next/image` don't show properly after removing Tailwind, check:

1. Make sure you've properly imported alternative CSS files
2. Verify that the components have appropriate styling

### Styling Inconsistencies

If you notice styling inconsistencies after removal:

1. Use browser dev tools to inspect the elements
2. Check if you missed replacing any Tailwind utility classes
3. Ensure your alternative CSS includes all the necessary styles

## Need More Help?

Refer to the [Stack Overflow guide](https://stackoverflow.com/questions/78265867/how-to-remove-tailwind-css-safely-from-my-next-js-project) for additional tips on safely removing Tailwind CSS.
