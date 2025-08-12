# Johnson Matthey Client Extension

This folder contains the global CSS and JavaScript client extension for the Johnson Matthey Liferay implementation.

## Contents

- **assets/global.css** - Global CSS with Johnson Matthey branding using Liferay Classic theme tokens
- **assets/global.js** - Global JavaScript utilities, modal management, and shared functionality
- **client-extension.yaml** - Client extension configuration for deployment

## Deployment

1. Deploy this entire folder as a client extension to your Liferay environment
2. The client extension provides site-wide CSS and JavaScript functionality
3. Scope is set to "company" level for availability across all sites

## Features

- Johnson Matthey color system integration with Liferay Classic theme
- Modal management system for login, search, and video overlays
- Shared utilities for fragment interactions
- Responsive design foundations
- Accessibility enhancements

## Dependencies

- Liferay DXP/Portal 7.4+
- Liferay Classic Theme (for frontend tokens)

## Notes

- All CSS is scoped to `#wrapper` to prevent interference with Liferay admin interface
- JavaScript modules use IIFE pattern to prevent global namespace pollution
- Optimized for Google Lighthouse performance scores