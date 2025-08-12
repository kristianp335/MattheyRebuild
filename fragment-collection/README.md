# Johnson Matthey Fragment Collection

This folder contains the complete Johnson Matthey fragment collection for Liferay deployment.

## Contents

The `johnson-matthey-collection/` folder contains 6 enterprise-grade fragments:

- **jm-header** - Complete navigation system with dropdowns, login/search modals, mobile menu
- **jm-hero** - Hero section with video functionality and call-to-action
- **jm-news-carousel** - Interactive news carousel with accessibility features
- **jm-share-price** - Live share price widget with charts and market data
- **jm-company-overview** - Company statistics with scroll-triggered animations
- **jm-footer** - Comprehensive footer with social links and newsletter signup

## Deployment

1. Import this fragment collection into your Liferay Fragment Library
2. Each fragment can be used independently on any page
3. Fragments work together to recreate the complete Johnson Matthey website

## Fragment Features

### Universal Features (All Fragments)
- Responsive design with mobile-first approach
- Accessibility compliance (WCAG 2.1)
- Liferay inline editing for all text and images
- CSS scoped to `#wrapper` for theme compatibility
- Configuration options for customization

### Individual Fragment Capabilities
- **Header**: Navigation API integration, modal overlays, mobile menu
- **Hero**: Video modals, inline SVG graphics, editable content
- **News Carousel**: Touch/swipe support, auto-play, keyboard navigation
- **Share Price**: Real-time data simulation, interactive charts
- **Company Overview**: Animated statistics, scroll-triggered effects
- **Footer**: Social media tracking, newsletter integration, back-to-top

## Dependencies

- Liferay DXP/Portal 7.4+
- Johnson Matthey Client Extension (for global CSS/JS)
- Liferay Classic Theme (for frontend tokens)

## Technical Implementation

- Uses Freemarker syntax `[#` for template directives
- All images have `data-lfr-editable-id` and `data-lfr-editable-type="image"` attributes
- JavaScript uses intersection observers for performance
- CSS leverages Liferay Classic theme frontend tokens exclusively

## Performance

- Optimized for Google Lighthouse scores
- Minimal JavaScript footprint with lazy loading
- CSS Grid and Flexbox for efficient layouts
- SVG graphics for scalable icons and illustrations