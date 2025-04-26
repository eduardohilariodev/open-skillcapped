# League of Legends Style Guide

This style guide implements the official League of Legends brand guidelines for our application.

## Resources

- [League of Legends Fundamentals](https://brand.riotgames.com/en-us/league-of-legends/fundamentals)
- [League of Legends Typography](https://brand.riotgames.com/en-us/league-of-legends/typography)
- [League of Legends Color](https://brand.riotgames.com/en-us/league-of-legends/color)
- [League of Legends Tone and Voice](https://brand.riotgames.com/en-us/league-of-legends/tone-and-voice)

## Components

### Colors

Import and use League of Legends brand colors:

```tsx
import { colors } from '../styles';

// Usage example
<div style={{ backgroundColor: colors.gold.medium }}>
  Gold-colored content
</div>
```

### Typography

Typography settings for consistent text styling:

```tsx
import { typography } from '../styles';

// Usage example
<div style={{ 
  fontFamily: typography.fontFamily.display,
  fontSize: typography.fontSize.xl,
  fontWeight: typography.fontWeight.bold 
}}>
  League of Legends styled heading
</div>
```

### Component Styles

Pre-defined styles for common UI components:

```tsx
import { components } from '../styles';

// Usage example
<button style={{
  backgroundColor: components.button.primary.backgroundColor,
  color: components.button.primary.color,
  fontFamily: components.button.primary.fontFamily,
  // Additional properties...
}}>
  Primary Button
</button>
```

### Spacing

Consistent spacing values for layouts:

```tsx
import { spacing } from '../styles';

// Usage example
<div style={{ 
  padding: spacing[4],
  margin: spacing[2] 
}}>
  Properly spaced content
</div>
```

### Tone and Voice Guidelines

Guidelines for content writing and messaging:

```tsx
import { toneAndVoice } from '../styles';

// Reference example
console.log(toneAndVoice.principles.clear);
// Output: "Be direct and straightforward in communication"
```

## CSS Defaults

Basic styling defaults are included in the main CSS file. These include:

- Font imports and defaults
- Basic heading styles (h1-h6)
- Button styling
- Link styling

## Using the Complete Style Guide

You can import the entire style guide:

```tsx
import styleGuide from '../styles';

// Access any style component
const { colors, typography, components } = styleGuide;
```
