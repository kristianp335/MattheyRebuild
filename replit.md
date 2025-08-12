# Johnson Matthey Liferay Fragment Collection

## Overview

This repository contains a comprehensive Liferay fragment collection that recreates Johnson Matthey's corporate website using Liferay-native fragments and client extensions. The implementation features authentic Johnson Matthey branding while leveraging established Liferay implementation patterns and the Liferay Classic theme color system exclusively.

The collection includes key corporate website components: header with navigation, hero section, company overview, news carousel, share price widget, and footer. Each fragment is designed to be modular, configurable, and follows Liferay best practices for content editing and responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

### Liferay Fragment Image Editing Requirements
- All images in fragments must be made editable using Liferay's inline editing system
- Required attributes for editable images:
  ```html
  <img
     src="placeholder.jpg"
     alt="Placeholder"
     data-lfr-editable-id="img1"
     data-lfr-editable-type="image"
  >
  ```
- Apply to all images where content editors should be able to customize them

### Modal Implementation Requirements (Login, Search, etc.)
- Modal buttons must open overlay with embedded Liferay portlets
- Use FreeMarker template to embed portlets: `[@liferay_portlet["runtime"] portletName="PORTLET_NAME" /]`
- Modal should check user login status and show appropriate content
- Include proper modal structure with overlay, close button, and escape key handling
- Modal should prevent background scrolling when open
- Use `themeDisplay.isSignedIn()` to conditionally show different content

### Modal Theme Styling Implementation
- **Problem**: Embedded Liferay portlets inherit global Liferay styles instead of custom theme
- **Solution**: Comprehensive CSS overrides with `!important` declarations target actual DOM structure
- **Key CSS Targets**:
  - `.form-control`, `input.field`, `.clearable.form-control` - Input field styling with brand colors
  - `.control-label` - Label styling with brand colors
  - `.btn-primary` - Primary button with brand background and hover effects
  - `.lfr-btn-label` - Button text styling
  - `.taglib-text a` - Footer links with brand colors and hover effects
  - `.portlet`, `.portlet-content`, `.portlet-body` - Remove unwanted portlet container styling
- **Implementation**: All styling scoped to modal content class to prevent interference

### Navigation Implementation Requirements
- **Problem**: Navigation dropdowns may not work due to API structure mismatch
- **Root Cause**: Code may look for `item.children` but Liferay API returns `item.navigationMenuItems`
- **Solution**: Update navigation functions to handle both API and fallback structures

## System Architecture

### Deployment Architecture
The project follows a dual-deployment architecture with organized holding folders:
- **Client Extension**: Located in `jm-frontend-client-extension/` folder - Global CSS and JavaScript assets deployed via `client-extension.yaml`
- **Fragment Collection**: Located in `fragment-collection/` folder - Complete fragment library deployed separately to Liferay's fragment system

### Fragment Architecture
The implementation follows a modular fragment-based architecture where each component is a self-contained Liferay fragment with its own HTML, CSS, JavaScript, and configuration. All fragments are scoped under the `#wrapper` CSS selector to ensure compatibility with Liferay's theme system and are located in the `fragment-collection/` directory for independent deployment.

### Color System Integration
The design system leverages Liferay Classic theme frontend tokens exclusively through CSS custom properties. This ensures seamless integration with Liferay's theming system while maintaining Johnson Matthey's brand identity. Primary colors are mapped to `--jm-primary` (brand-color-1), `--jm-secondary` (brand-color-2), etc.

### JavaScript Architecture
Each fragment includes isolated JavaScript modules that initialize on DOM ready or Liferay's `allPortletsReady` event. The global JavaScript file provides shared utilities for modal management, accessibility features, and common UI interactions. All scripts are wrapped in immediately invoked function expressions (IIFE) to prevent global namespace pollution.

### Content Management
All text content, images, and links are made editable through Liferay's inline editing system using `data-lfr-editable-id` and `data-lfr-editable-type` attributes. This allows content editors to customize the fragments without technical knowledge while maintaining the design integrity.

### Responsive Design
The fragments implement a mobile-first responsive design approach using CSS Grid and Flexbox layouts. Breakpoints are defined using CSS custom properties and follow established design system patterns for consistent behavior across all components.

### Modal System
A centralized modal system handles overlays for login, search, and video content. Modals embed actual Liferay portlets using FreeMarker templates and include comprehensive CSS overrides to ensure brand consistency within embedded Liferay components.

### Animation System
Scroll-triggered animations and interactive elements use CSS transitions and transforms for optimal performance. JavaScript intersection observers detect when elements enter the viewport to trigger animations, providing smooth user experiences without performance impact.

## External Dependencies

### Liferay Platform
- **Liferay DXP/Portal**: Core platform providing fragment rendering, theme system, and content management
- **Liferay Classic Theme**: Source of frontend tokens and base styling used throughout the implementation
- **Liferay Headless Delivery API**: Provides navigation menu structure and content data
- **Liferay Fragment Editor**: Development and deployment environment for fragments

### Liferay Portlets
- **Login Portlet** (`com_liferay_login_web_portlet_LoginPortlet`): Embedded in modal overlays for user authentication
- **Search Portlet**: Integrated into search modal functionality
- **Navigation Portlet**: Provides dynamic navigation menu structure

### Browser APIs
- **Intersection Observer API**: Used for scroll-triggered animations and lazy loading
- **Fetch API**: Handles asynchronous data loading for dynamic content
- **Local Storage API**: Manages user preferences and temporary data storage

### Third-Party Services (Potential)
- **Stock Price APIs**: For real-time share price data in the share price widget
- **YouTube/Vimeo APIs**: For video embedding and playback functionality
- **Analytics Services**: For tracking user interactions and content performance

### Asset Dependencies
- **SVG Icons**: Inline SVG graphics for optimal performance and scalability
- **Google Fonts**: Typography enhancement (if not using system fonts)
- **Image Assets**: Company logos, hero images, and news thumbnails managed through Liferay's document library