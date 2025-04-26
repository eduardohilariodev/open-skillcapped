# Hextech UI Component Library

This directory contains a collection of reusable UI components styled after the League of Legends Hextech design system.

## Component Overview

- **Button**: Standard button component with various styles and variants
- **Card**: Container for content with various styling options
- **Checkbox**: Custom styled checkbox input
- **Grid**: Responsive grid layout system with configurable gaps and spans
- **HextechFrame**: Decorative container with Hextech styling
- **Input**: Custom styled text input
- **Modal**: Dialog/popup window component
- **SearchResult**: Specialized card for displaying search results
- **SelectInput**: Custom styled dropdown/select input
- **Tag**: Label/tag component for filtering and metadata

## Usage

Components can be imported individually:

```tsx
import { Button, Grid } from '../components/ui';

function MyComponent() {
  return (
    <Grid gap="md" layout="2-cols">
      <Grid.Item lg={6}>
        <Button variant="primary" size="md">Click Me</Button>
      </Grid.Item>
      <Grid.Item lg={6}>
        <Button variant="secondary" size="md">Cancel</Button>
      </Grid.Item>
    </Grid>
  );
}
```

## Design Variants

Most components support the following variants:

- `gold`: The default Hextech gold theme
- `blue`: Hextech blue theme, typically used for gameplay actions
- `dark`: Darker variant for less emphasis

## CSS Classes

All components use CSS classes prefixed with `hextech-` for consistent styling.
These styles are defined in the `src/styles/components/` directory.

## Accessibility

Components include appropriate ARIA attributes and keyboard navigation support.

## Responsive Design

Components are built to be responsive and work across different screen sizes.
