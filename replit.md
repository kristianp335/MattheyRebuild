# Johnson Matthey Liferay Fragment Collection

## Overview
This project delivers a comprehensive Liferay fragment collection to recreate Johnson Matthey's corporate website. It provides modular, configurable, and responsive website components such as header with navigation, hero section, news carousel, share price widget, and footer. The goal is to ensure easy content editing, deployment, and adherence to Johnson Matthey's branding guidelines and Liferay's Classic theme.

## User Preferences
Preferred communication style: Simple, everyday language.
Preferred name: Call user "Shirley".

## System Architecture
The project employs a modular, fragment-based architecture where each UI component is a self-contained Liferay fragment (HTML, CSS, JS, configuration). Global styles and scripts are managed via a client extension. All fragments are scoped under the `#wrapper` CSS selector and integrate seamlessly with Liferay's theme system using Liferay Classic theme tokens via CSS custom properties.

**Key Architectural Decisions:**
- **Dual-Deployment**: Client extension for global assets and fragment collection for UI components.
- **Fragment Modularity**: Each component is an independent Liferay fragment.
- **Color System**: Exclusive use of Liferay Classic theme frontend tokens for branding consistency.
- **JavaScript Isolation**: IIFEs and event-driven architecture ensure proper initialization and prevent global namespace pollution.
- **Content Management**: All content (text, images, links) is editable via Liferay's inline editing system using `data-lfr-editable` attributes.
- **Responsive Design**: Mobile-first approach using CSS Grid and Flexbox with consistent breakpoints.
- **Modal System**: Centralized system for login, search, and video modals, embedding Liferay portlets with extensive CSS overrides for consistent branding.
- **Animation System**: Scroll-triggered animations using CSS transitions/transforms and JavaScript Intersection Observers.
- **Fragment Configuration**: Uses `typeOptions.validValues` for select fields.
**FreeMarker Syntax**: Liferay fragments use `[#` brackets instead of `<#` - configuration conditionals use `[#if condition]content[/#if]` syntax.
- **Fragment Element Detection**: Fixed critical issue where `document.currentScript.closest()` fails in Liferay's ES module environment. All fragments now properly use the `fragmentElement` variable injected by Liferay instead of trying to find elements with `document.currentScript`.
- **Header Fragment**:
    - **Comprehensive Configuration**: Options for search, user menu visibility, sticky header, style variants (white/light/primary), and navigation menu ID.
    - **Editable Logo System**: Liferay-editable logo image.
    - **Dynamic Navigation**: Liferay Headless API integration with authentication and fallback system.
    - **Authentication Integration**: User management via Liferay personal bar and login modals.
    - **Search Functionality**: Embedded Liferay search portlets.
    - **Smart Edit Mode Detection**: Comprehensive edit mode detection and visual indicators with smart dropzone system.
    - **Language Selector Dropzone**: Positioned next to user profile for multilingual widget support.
    - **SPA Navigation Support**: Full SennaJS compatibility.
    - **Mobile Responsiveness**: Fixed hamburger menu and slide-out navigation.
    - **Sticky Header Implementation**: Reliable `position: fixed` implementation with full-width coverage and enhanced shadow.
- **Hero Fragment**:
    - **Comprehensive Configuration**: Options for layout style (centered/split), background style (image/gradient/solid), show/hide stats, and show/hide video overlay.
    - **FreeMarker Integration**: All configuration options properly implemented using `[#if condition]` syntax for conditional rendering.
    - **Video Integration**: Modal video player with play button overlay, configurable visibility based on `showVideo` setting.
    - **Statistics Display**: Statistics section with configurable visibility based on `showStats` setting.
    - **Dynamic Styling**: Layout and background variants controlled through data attributes and CSS custom properties.
    - **Performance Optimized**: LCP-optimized with critical CSS inlining, eager image loading, GPU acceleration, deferred non-critical JavaScript, and requestIdleCallback optimization.
- **Footer Fragment**:
    - **Comprehensive Configuration**: Options for newsletter signup, social media visibility, back-to-top button, company name, style variants (dark/light/primary), column layouts (5/4/3 columns), link tracking, and newsletter service integration.
    - **Dynamic Styling System**: Three footer style variants with complete color scheme adaptation.
    - **Flexible Column Layouts**: Responsive grid system.
    - **Configurable Components**: Show/hide controls for newsletter section, social media links, and back-to-top functionality.
    - **Company Branding**: Dynamic company name updates.
    - **Newsletter Integration**: Optional newsletter signup with multiple service provider options.
    - **Analytics Integration**: Configurable link tracking for footer navigation analytics.

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
- **Intersection Observer API**: For scroll-triggered animations.
- **Fetch API**: For asynchronous data loading.
- **Local Storage API**: For user preferences and temporary data.

**Third-Party Services (Integrated):**
- **Stock Price APIs**: For share price widget.
- **YouTube/Vimeo APIs**: For video embedding.
- **Newsletter Services**: Custom Integration, Mailchimp, Campaign Monitor, Constant Contact.

**Asset Dependencies:**
- **SVG Icons**
- **Google Fonts**
- **Image Assets**: Managed through Liferay's document library.