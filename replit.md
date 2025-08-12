# Johnson Matthey Liferay Fragment Collection

## Overview
This project delivers a comprehensive Liferay fragment collection to recreate Johnson Matthey's corporate website. It leverages Liferay-native fragments and client extensions, adhering to Johnson Matthey's branding guidelines and Liferay's Classic theme. The goal is to provide modular, configurable, and responsive website components such as header with navigation, hero section, news carousel, share price widget, and footer, all designed for easy content editing and deployment.

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
- **Implementation**: Full Liferay Headless Delivery API integration with proper authentication
- **API Integration**: Uses `Liferay.authToken` with `/o/headless-delivery/v1.0/navigation-menus/` endpoint
- **Fallback Support**: Comprehensive fallback navigation when API is unavailable
- **URL Building**: Smart URL building with `getSiteBasePath()` and `buildPageURL()` functions
- **Data Structure**: Handles both `navigationMenuItems` (API) and `children` (fallback) properties
- **Configuration**: Configurable navigation menu ID via `navigationMenuId` setting

### Header Fragment Configuration System
- **Show Search Button**: Configuration option to hide/show search functionality (`showSearch`)
- **Show User Menu**: Configuration option to hide/show user authentication widgets (`showUserMenu`)
- **Sticky Header**: Configuration option to enable/disable header sticking to top during scroll (`stickyHeader`)
- **Header Style Variants**: Three visual themes via `headerStyle` configuration:
  - **White Background**: Default clean white header with gray borders
  - **Light Gray Background**: Subtle gray background for visual distinction
  - **Primary Color Background**: Brand primary color with white text for bold branding
- **Navigation Menu ID**: Configurable navigation menu identifier for dynamic API loading (`navigationMenuId`)

### Header Fragment Editable Elements
- **Logo Image**: Fully editable via `data-lfr-editable-id="logo"` and `data-lfr-editable-type="image"`
  - Uses `[resources:johnson-matthey-logo.png]` for collection-wide logo asset
  - Supports replacement with any uploaded image through Liferay editor
  - Clean, standalone logo without text elements for professional appearance

### Footer Fragment Configuration System
- **Show Newsletter Signup**: Configuration option to display newsletter subscription form (`showNewsletter`)
- **Show Social Media Links**: Configuration option to display social media icons and links (`showSocialMedia`)
- **Show Back to Top Button**: Configuration option to display floating back to top button (`showBackToTop`)
- **Company Name**: Configurable company name for copyright notice and branding (`companyName`)
- **Footer Style Variants**: Three visual themes via `footerStyle` configuration:
  - **Dark Background**: Default dark footer with white text for professional appearance
  - **Light Background**: Light gray background with dark text for alternative styling
  - **Primary Color Background**: Brand primary color with white text for bold branding
- **Column Layout Options**: Three responsive layout variants via `columnLayout` configuration:
  - **5 Columns**: Company section (2fr) plus 4 equal link columns (1fr each)
  - **4 Columns**: Four equal-width columns for balanced content distribution
  - **3 Columns**: Compact layout for minimal footer content
- **Enable Link Tracking**: Configuration option for analytics tracking of footer link clicks (`enableTracking`)
- **Newsletter Service Integration**: Configurable newsletter service provider (`newsletterService`):
  - Custom Integration, Mailchimp, Campaign Monitor, Constant Contact

### Footer Fragment Editable Elements
- **Company Description**: Editable footer description text via `data-lfr-editable-id="footerDescription"`
- **Social Media Links**: All social platform links are Liferay-editable (LinkedIn, YouTube, Instagram)
- **Footer Section Titles**: All column headers are editable (About Us, Our Business, Investors, News & Media)
- **Navigation Links**: All footer navigation links are Liferay-editable with proper `data-lfr-editable` attributes
- **Legal Links**: Privacy policy, terms, cookies, accessibility, and compliance links are editable
- **Newsletter Content**: Newsletter title and description are fully customizable through Liferay editor
- **Copyright Text**: Dynamic copyright notice with configurable company name integration

### Header Fragment Edit Mode System
- **Smart Edit Detection**: Enhanced `isInEditMode()` function with multiple detection methods:
  - `has-edit-mode-menu` and `is-edit-mode` body classes
  - Control menu + page editor presence validation
  - Fragment editable elements detection
  - Real-time MutationObserver for body class changes
- **State Management**: 
  - `initializeEditModeDisplay()`: Adds visual indicators only in actual edit mode
  - `ensureModalsHidden()`: Removes indicators and hides modals in normal viewing mode
  - Prevents false positives that showed modals in normal browsing mode

### Header Dropzone System Implementation
- **Search Modal Dropzone**: `data-lfr-drop-zone-id="search"` within modal overlay for search portlets
- **Login Modal Integration**: Embedded `[@liferay_portlet["runtime"] portletName="com_liferay_login_web_portlet_LoginPortlet" /]`
- **Language Selector Dropzone**: `data-lfr-drop-zone-id="language-selector"` positioned after user profile widget
  - **Smart Visibility**: Hidden when empty in normal mode, highlighted with "🌐 Language Selector" in edit mode
  - **Strategic Placement**: Inline-flex layout next to user profile where users expect language options
  - **Visual Feedback**: Dashed border with brand primary color and descriptive text indicator

### Fragment Collection Assets
- **Thumbnail Images**: All fragments include professional thumbnail.png files for Liferay fragment editor
- **Logo Resource**: Johnson Matthey logo stored in resources/ directory for collection-wide access
- **Resource Usage**: Header fragment references logo using `[resources:johnson-matthey-logo.png]` syntax
- **Asset Structure**: Follows Liferay best practices with proper resource management and fragment visualization

## System Architecture
The project employs a modular, fragment-based architecture where each UI component is a self-contained Liferay fragment (HTML, CSS, JS, configuration). Global styles and scripts are managed via a client extension. All fragments are scoped under the `#wrapper` CSS selector and integrate seamlessly with Liferay's theme system using Liferay Classic theme tokens via CSS custom properties.

**Key Architectural Decisions:**
- **Dual-Deployment**: Client extension for global assets and fragment collection for UI components.
- **Fragment Modularity**: Each component is an independent Liferay fragment.
- **Color System**: Exclusive use of Liferay Classic theme frontend tokens for branding consistency.
- **JavaScript Isolation**: IIFEs and event-driven architecture (e.g., `allPortletsReady`, `pageEditorModeChanged`) ensure proper initialization and prevent global namespace pollution, especially with Liferay SPA navigation.
- **Content Management**: All content (text, images, links) is editable via Liferay's inline editing system using `data-lfr-editable` attributes.
- **Responsive Design**: Mobile-first approach using CSS Grid and Flexbox with consistent breakpoints.
- **Modal System**: Centralized system for login, search, and video modals, embedding Liferay portlets with extensive CSS overrides for consistent branding.
- **Animation System**: Scroll-triggered animations using CSS transitions/transforms and JavaScript Intersection Observers for performance.
- **Fragment Configuration**: Uses `typeOptions.validValues` for select fields, avoiding deprecated formats.
- **Header Fragment**: Enterprise-grade navigation solution featuring:
    - **Comprehensive Configuration System**: Five configuration options including show/hide controls for search and user menu, sticky header toggle, header style variants (white/light/primary), and configurable navigation menu ID.
    - **Editable Logo System**: Clean, professional logo image is Liferay-editable with proper `data-lfr-editable` attributes, using collection resources for shared logo asset.
    - **Dynamic Styling**: CSS-based header style variants with automatic color scheme adaptation for primary background mode.
    - **Dynamic Navigation**: Liferay Headless API integration with authentication and comprehensive fallback system.
    - **Authentication Integration**: User management via `[@liferay.user_personal_bar /]` and login modals with configurable visibility.
    - **Search Functionality**: Embedded Liferay search portlets with configurable show/hide controls.
    - **Smart Edit Mode Detection**: Comprehensive edit mode detection and visual indicators with smart dropzone system.
    - **Language Selector Dropzone**: Positioned next to user profile for multilingual widget support.
    - **SPA Navigation Support**: Full SennaJS compatibility with event handling for seamless page transitions.
    - **Mobile Responsiveness**: Hamburger menu and slide-out navigation with touch-optimized interactions.
    - **Accessibility Features**: Extensive ARIA, keyboard navigation, and focus management.
    - **Performance Optimizations**: Event delegation, lazy loading, and scoped CSS for optimal performance.
- **Footer Fragment**: Comprehensive footer solution with complete configuration system featuring:
    - **Eight Configuration Options**: Newsletter signup toggle, social media visibility, back-to-top button, company name customization, footer style variants (dark/light/primary), column layout options (5/4/3 columns), link tracking toggle, and newsletter service integration.
    - **Dynamic Styling System**: Three footer style variants with complete color scheme adaptation and CSS custom properties integration.
    - **Flexible Column Layouts**: Responsive grid system supporting 5-column (company + 4 links), 4-column (equal width), and 3-column (compact) layouts.
    - **Configurable Components**: Show/hide controls for newsletter section, social media links, and back-to-top functionality.
    - **Company Branding**: Dynamic company name updates across footer elements with Liferay-editable content support.
    - **Newsletter Integration**: Optional newsletter signup with multiple service provider options (Custom, Mailchimp, Campaign Monitor, Constant Contact).
    - **Analytics Integration**: Configurable link tracking for footer navigation analytics.
    - **Accessibility Features**: ARIA support, keyboard navigation, and screen reader optimization.

## External Dependencies

**Liferay Platform:**
- **Liferay DXP/Portal**: Core platform for fragment rendering, theme system, and content management.
- **Liferay Classic Theme**: Provides frontend tokens and base styling.
- **Liferay Headless Delivery API**: Used for navigation menu structure and content data.
- **Liferay Fragment Editor**: Development and deployment environment.

**Liferay Portlets:**
- **Login Portlet** (`com_liferay_login_web_portlet_LoginPortlet`): Embedded in modal overlays.
- **Search Portlet**: Integrated into search modal functionality.
- **Navigation Portlet**: Provides dynamic navigation menu structure.

**Browser APIs:**
- **Intersection Observer API**: For scroll-triggered animations and lazy loading.
- **Fetch API**: For asynchronous data loading.
- **Local Storage API**: For user preferences and temporary data.

**Third-Party Services (Integrated):**
- **Stock Price APIs**: (Mentioned as potential, but implies actual integration for share price widget)
- **YouTube/Vimeo APIs**: (Mentioned as potential, but implies actual integration for video embedding)

**Asset Dependencies:**
- **SVG Icons**
- **Google Fonts**
- **Image Assets**: Managed through Liferay's document library.