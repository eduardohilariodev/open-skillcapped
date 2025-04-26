# League of Legends Styling Guide

This document provides an overview of how the League of Legends styling has been applied to the application and how to maintain consistent styling when adding new components.

## Styling Architecture

The application uses a combination of approaches to implement the League of Legends styling:

1. **Core style definitions**: Located in the `src/styles` directory
   - `colors.ts` - Color palette
   - `typography.ts` - Font families, sizes, weights
   - `spacing.ts` - Spacing values
   - `components.ts` - Component styles
   - `toneAndVoice.ts` - Content writing guidelines

2. **Global CSS**:
   - `index.css` - Base styling with global defaults
   - `styles/bulma-overrides.css` - Overrides for Bulma components
   - `styles/fonts.css` - Font face declarations

3. **Helper utilities**:
   - `styles/theme.ts` - Utilities to convert existing UI to League of Legends style

## Using the Style Guide

### In React Components (Recommended Approach)

```tsx
import { colors, typography, spacing } from '../styles';
import leagueify from '../styles/theme';

// Use in inline styles
const myComponent = () => (
  <div style={{ 
    backgroundColor: colors.background.dark,
    color: colors.gold.light,
    fontFamily: typography.fontFamily.body,
    padding: spacing[4],
  }}>
    <h1 style={{ 
      color: colors.gold.medium, 
      fontFamily: typography.fontFamily.display 
    }}>
      My Title
    </h1>
    
    {/* For common patterns, use the leagueify helper */}
    <button style={leagueify.button('primary')}>
      Primary Button
    </button>
  </div>
);
```

### Component-Specific CSS

When creating component-specific CSS files:

```css
/* MyComponent.css */
.my-component {
  background-color: #010A13; /* LoL background dark */
  color: #F0E6D2; /* LoL gold light */
  border: 1px solid #785A28; /* LoL gold dark */
}

.my-component-header {
  font-family: "Beaufort for LOL", serif;
  color: #C8AA6E; /* LoL gold medium */
}
```

## League of Legends Color Reference

### Primary Colors

- **Gold Palette**
  - Light: `#F0E6D2`
  - Medium: `#C8AA6E`
  - Dark: `#785A28`

- **Blue Palette**
  - Light: `#CDFAFA`
  - Medium: `#0AC8B9`
  - Dark: `#0A323C`

### Secondary Colors

- Red: `#AF3131`
- Orange: `#DA722B`
- Yellow: `#D6B23E`
- Green: `#1CA64C`
- Dark Green: `#008274`

### Neutrals

- Black: `#010A13`
- Dark Grey: `#1E2328`
- Grey: `#3D424D`
- Light Grey: `#A09B8C`
- White: `#F0E6D2`

### Background Colors

- Dark: `#010A13`
- Medium: `#0A1428`
- Light: `#0A323C`

## Typography

### Font Families

- **Display Font**: `"Beaufort for LOL", serif`
  - Used for headings, titles, buttons
  
- **Body Font**: `"Spiegel", "Spiegel Regular", sans-serif`
  - Used for body text, paragraphs, content

### Font Weights

- Light: `300`
- Regular: `400`
- Medium: `500`
- Bold: `700`
- Heavy: `800`

## Design Patterns

### Cards and Panels

Cards typically follow this pattern:

- Background: `background.medium`
- Border: `gold.dark`
- Header background: `background.light`
- Header text: `gold.medium` with display font
- Content text: `gold.light` with body font

### Buttons

- **Primary Buttons**:
  - Background: `gold.medium`
  - Text: `black`
  - Border: `gold.dark`
  - Hover: Background: `gold.dark`, Text: `gold.light`

- **Secondary Buttons**:
  - Background: `transparent`
  - Text: `gold.medium`
  - Border: `gold.medium`
  - Hover: Background: `gold.dark`, Text: `gold.light`

### Forms and Inputs

Inputs follow these guidelines:

- Background: `background.dark`
- Border: `gold.dark`
- Text: `white`
- Focus Border: `gold.medium`
- Placeholder: `lightGrey`

## Migrating Existing Components

When migrating existing components:

1. Import the required style modules:

   ```tsx
   import { colors, typography, spacing } from '../styles';
   import leagueify from '../styles/theme';
   ```

2. Use the leagueify helper for common UI patterns:

   ```tsx
   const buttonStyle = leagueify.button('primary');
   const cardStyle = leagueify.card;
   ```

3. Apply inline styles to components or create dedicated CSS files with League of Legends colors
