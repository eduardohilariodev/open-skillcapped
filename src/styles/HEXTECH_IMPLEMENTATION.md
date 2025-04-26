# League of Legends Hextech Design System Implementation

This document provides an overview of the Hextech design system implementation in our application.

## Core Design Principles

The Hextech design system is built on three core principles:

1. **Shape Language**
   - Squares: For structure and stability
   - Diamonds: As accent pieces to guide attention
   - Circles: To draw focus toward primary interactive elements

2. **Interaction Hierarchy**
   - Primary/Gameplay Layer: Blue magical buttons for main actions
   - Secondary Layer: Gold buttons for navigation
   - Utility Layer: Interface elements for filtering and information

3. **Visual Effects**
   - Magical particles and energy lines
   - Shimmer effects
   - Glow and pulse animations

## Components Implemented

### Core UI Components

- **HextechFrame**: A container component with ornamental corners and themed variants
- **HextechFilterPanel**: Panel component for filter controls with decorative elements
- **Modals**: Enhanced with Hextech styling, animations, and energy lines
- **Searchbar**: Responsive design with focus effects and Hextech styling

### Visual Elements

- **HextechSquare**: Basic structural element
- **HextechDiamond**: Accent element for visual interest
- **HextechCircle**: Focus element for interactive components
- **HextechCorner**: Decorative corner elements for frames and panels

### Button System

Updated to follow the three-tier Hextech interaction hierarchy:

- Primary buttons (blue): Main actions with glow effects
- Secondary buttons (gold): Navigation and secondary actions
- Utility buttons: Interface controls

### Effects and Animations

- Energy lines for container backgrounds
- Particle effects for hero sections
- Shimmer effects for interactive elements
- Loading animations and transitions

## CSS Files Created

- **hextech-magic.css**: Glow effects, energy lines, and magical elements
- **hextech-global.css**: Global styling overrides for HTML elements
- **hextech-animations.css**: Animation keyframes and transitions

## Utilities

- **addHextechParticles()**: Add particle effects to elements
- **addHextechEnergyLines()**: Add energy line effects
- **addHextechShimmer()**: Add shimmer effects to elements
- **applyHextechEffects()**: Batch apply effects to multiple elements

## Styling Guidelines

### Colors

- **Primary Palette**
  - Gold: #F0E6D2 (light), #C8AA6E (medium), #785A28 (dark)
  - Blue: #CDFAFA (light), #0AC8B9 (medium), #0A323C (dark)

- **Background Colors**
  - Dark: #010A13
  - Medium: #0A1428
  - Light: #0A323C

- **Magic Accent Colors**
  - Magic Blue: #0AC8B9
  - Magic Gold: #C89B3C

### Typography

- **Display Font**: "Beaufort for LOL", serif
- **Body Font**: "Spiegel", "Spiegel Regular", sans-serif

## Implementation Notes

1. The system is designed to be modular, allowing components to be themed with either gold or blue variants.
2. All interactive elements have appropriate hover and focus states with Hextech effects.
3. Animation effects are subtle and performant, using CSS transitions where possible.
4. The design system respects accessibility guidelines with appropriate contrast and focus indicators.

## Future Enhancements

- Create more specialized variants of the Hextech components for specific use cases
- Add additional animation effects for page transitions
- Implement responsive variations for mobile-specific interactions
- Enhance performance optimizations for the particle and energy line effects
