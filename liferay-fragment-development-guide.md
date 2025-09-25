# Liferay Fragment Development Guide

## Overview

This comprehensive guide provides best practices, architectural patterns, and optimization techniques for creating production-ready Liferay fragments and client extensions. It covers responsive design, performance optimization, advanced functionality integration, and proven patterns from Johnson Matthey and Vanden Recycling implementations.

## Fragment.json Structure Requirements

### Critical Configuration File

Every fragment **must** include a properly structured `fragment.json` file that tells Liferay where to find all fragment assets. Missing or incomplete fragment.json files will cause **"HTML content must not be empty"** import errors.

### Required Fragment.json Structure

```json
{
  "fragmentEntryKey": "sigma-bar-chart",
  "name": "Sigma Bar Chart",
  "type": "component",
  "htmlPath": "index.html",
  "cssPath": "index.css", 
  "jsPath": "index.js",
  "configurationPath": "configuration.json",
  "thumbnailPath": "thumbnail.png",
  "icon": "chart-bar"
}
```

### Critical Fields Explained

- **fragmentEntryKey**: Unique identifier for the fragment
- **name**: Display name shown in Liferay fragment library
- **type**: Either `"component"` or `"section"` 
- **htmlPath**: Path to HTML file (required - must be "index.html")
- **cssPath**: Path to CSS file (required - must be "index.css")
- **jsPath**: Path to JavaScript file (required - must be "index.js")
- **configurationPath**: Path to configuration file (required - must be "configuration.json")
- **thumbnailPath**: Path to thumbnail image (required - must be "thumbnail.png")
- **icon**: Liferay icon identifier for fragment library display

### Common Import Error

❌ **Incomplete fragment.json** (causes "HTML content must not be empty"):
```json
{
  "fragmentEntryKey": "sigma-bar-chart",
  "name": "Sigma Bar Chart",
  "type": "component"
}
```

✅ **Complete fragment.json** (imports successfully):
```json
{
  "fragmentEntryKey": "sigma-bar-chart", 
  "name": "Sigma Bar Chart",
  "type": "component",
  "htmlPath": "index.html",
  "cssPath": "index.css",
  "jsPath": "index.js", 
  "configurationPath": "configuration.json",
  "thumbnailPath": "thumbnail.png",
  "icon": "chart-bar"
}
```

### Fragment File Structure

Each fragment directory must contain:
```
sigma-bar-chart/
├── fragment.json           # Fragment metadata (required)
├── configuration.json      # Fragment configuration options
├── index.html             # Fragment HTML template
├── index.css              # Fragment styles 
├── index.js               # Fragment JavaScript
└── thumbnail.png          # Fragment thumbnail image
```

## FragmentElement: Core Concept for Multi-Instance Fragments

### Overview

The `fragmentElement` is a **fundamental JavaScript variable automatically provided by Liferay** for every fragment instance. It represents the **DOM container element that wraps the specific fragment instance**, enabling proper scoping and multi-instance support.

### What is fragmentElement?

**Definition**: `fragmentElement` is a DOM element reference that points to the root container of the current fragment instance.

**Provided by**: Liferay's fragment rendering system (automatically available in all fragment JavaScript)

**Purpose**: Enables fragment-scoped DOM queries and event handling to prevent conflicts between multiple fragment instances

### Why fragmentElement is Critical

#### Problem Without fragmentElement Scoping:
```javascript
// BAD: Global scope - causes conflicts with multiple instances
const button = document.querySelector('.my-button');
button.addEventListener('click', handleClick);

// When multiple fragments exist, this affects ALL buttons across ALL instances
```

#### Solution With fragmentElement Scoping:
```javascript
// GOOD: Fragment-scoped - each instance operates independently
const button = fragmentElement.querySelector('.my-button');
button.addEventListener('click', handleClick);

// Each fragment instance only affects its own button
```

### Core Implementation Patterns

#### 1. Fragment-Scoped DOM Queries

**Always Use fragmentElement for DOM Selection**:
```javascript
// ✅ CORRECT - Scoped to this fragment instance
const panel = fragmentElement.querySelector('.sigma-panel');
const headers = fragmentElement.querySelectorAll('.panel-header');
const dropzone = fragmentElement.querySelector('lfr-drop-zone');

// ❌ INCORRECT - Global scope causes conflicts
const panel = document.querySelector('.sigma-panel');
const headers = document.querySelectorAll('.panel-header');
```

#### 2. Event Listener Scoping

**Attach Events to Fragment Elements Only**:
```javascript
// ✅ CORRECT - Event scoped to this fragment
const toggleButton = fragmentElement.querySelector('.toggle-btn');
toggleButton.addEventListener('click', function(event) {
    // Only affects this fragment instance
    event.stopPropagation();
    togglePanel();
});

// ❌ INCORRECT - Global event affects all fragments
document.addEventListener('click', function(event) {
    // Affects ALL fragments on the page
});
```

#### 3. Multi-Instance State Management

**Independent State Per Fragment**:
```javascript
(function() {
    'use strict';
    
    // Each fragment instance has its own closure scope
    let isExpanded = false;
    let config = null;
    
    function initializeFragment() {
        // All operations scoped to this fragmentElement
        const container = fragmentElement.querySelector('.container');
        const config = getFragmentConfiguration();
        
        // State is independent per fragment instance
        updateFragmentState(config.isOpenByDefault);
    }
    
    function updateFragmentState(expanded) {
        isExpanded = expanded;
        // Update only this fragment's elements
        const header = fragmentElement.querySelector('.header');
        header.setAttribute('aria-expanded', expanded.toString());
    }
    
    // Initialize this fragment instance
    initializeFragment();
})();
```

### Practical Examples

#### Fragment Initialization Pattern:
```javascript
(function() {
    'use strict';
    
    // Ensure fragmentElement is available
    if (typeof fragmentElement === 'undefined') {
        console.warn('fragmentElement not available, fragment initialization failed');
        return;
    }
    
    function initializeFragment() {
        // All DOM queries scoped to this fragment
        const elements = {
            container: fragmentElement.querySelector('.fragment-container'),
            buttons: fragmentElement.querySelectorAll('.action-btn'),
            dropzone: fragmentElement.querySelector('lfr-drop-zone')
        };
        
        // Attach events only to this fragment's elements
        elements.buttons.forEach(button => {
            button.addEventListener('click', handleButtonClick);
        });
    }
    
    function handleButtonClick(event) {
        // Event handler operates only on this fragment
        event.stopPropagation();
        const button = event.target;
        const container = fragmentElement.querySelector('.fragment-container');
        container.classList.toggle('active');
    }
    
    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFragment);
    } else {
        initializeFragment();
    }
})();
```

#### Configuration Access Pattern:
```javascript
function getFragmentConfiguration() {
    // Configuration is also scoped to the fragment instance
    if (typeof configuration !== 'undefined') {
        return {
            title: configuration.title || 'Default Title',
            isOpen: configuration.isOpen !== undefined ? configuration.isOpen : false,
            style: configuration.style || 'primary'
        };
    }
    
    // Fallback configuration
    return {
        title: 'Default Title',
        isOpen: false,
        style: 'primary'
    };
}

function applyConfiguration() {
    const config = getFragmentConfiguration();
    
    // Apply configuration only to this fragment's elements
    const title = fragmentElement.querySelector('.fragment-title');
    const container = fragmentElement.querySelector('.fragment-container');
    
    if (title) title.textContent = config.title;
    if (container) container.setAttribute('data-style', config.style);
}
```

### Advanced FragmentElement Techniques

#### 1. Fragment Instance Management

**Create Instance-Specific Debugging**:
```javascript
// Optional: Add to global scope for debugging (scoped to this fragment)
if (typeof window !== 'undefined' && window.console) {
    fragmentElement.fragmentInstance = {
        config: getFragmentConfiguration(),
        reinitialize: initializeFragment,
        cleanup: cleanup,
        state: { isExpanded: false }
    };
}
```

#### 2. Memory Management and Cleanup

**Proper Event Cleanup**:
```javascript
function cleanup() {
    // Remove event listeners to prevent memory leaks
    const buttons = fragmentElement.querySelectorAll('.action-btn');
    buttons.forEach(button => {
        button.removeEventListener('click', handleButtonClick);
    });
}

// Call cleanup when fragment is removed (if needed)
window.addEventListener('beforeunload', cleanup);
```

#### 3. Fragment Communication (When Needed)

**Safe Fragment-to-Fragment Communication**:
```javascript
function broadcastFragmentEvent(eventType, data) {
    // Use custom events for fragment communication
    const customEvent = new CustomEvent(`fragment:${eventType}`, {
        detail: { 
            fragmentId: fragmentElement.id,
            data: data 
        }
    });
    
    // Dispatch from fragmentElement, not document
    fragmentElement.dispatchEvent(customEvent);
}

function listenForFragmentEvents() {
    // Listen for events on this fragment only
    fragmentElement.addEventListener('fragment:update', function(event) {
        if (event.detail.fragmentId !== fragmentElement.id) {
            // Handle event from other fragments if needed
            console.log('Received event from:', event.detail.fragmentId);
        }
    });
}
```

### Best Practices Summary

#### ✅ Always Do:
1. **Use fragmentElement.querySelector()** instead of document.querySelector()
2. **Scope all event listeners** to fragment elements
3. **Wrap fragment code in IIFE** to prevent global namespace pollution
4. **Check for fragmentElement availability** before initialization
5. **Use independent state management** per fragment instance
6. **Implement proper cleanup** to prevent memory leaks

#### ❌ Never Do:
1. **Use document.querySelector()** for fragment elements
2. **Attach global event listeners** that affect all fragments
3. **Share state between fragment instances** without proper isolation
4. **Modify elements outside the fragment scope**
5. **Rely on global variables** for fragment functionality

### Testing Multi-Instance Fragments

#### Development Testing Checklist:
1. **Add multiple instances** of the same fragment to a test page
2. **Verify independent operation** - each fragment functions separately
3. **Test configuration isolation** - different settings per instance
4. **Check event handling** - clicking one fragment doesn't affect others
5. **Validate state management** - each fragment maintains its own state
6. **Test cleanup** - removing fragments doesn't break remaining instances

### FragmentElement Availability

**Liferay Provides fragmentElement**:
- Available in all fragment JavaScript contexts
- Points to the unique DOM container for each fragment instance
- Automatically generated with unique IDs
- Includes proper namespace isolation

**Fallback Pattern**:
```javascript
// Always check availability for robust fragments
if (typeof fragmentElement === 'undefined') {
    console.warn('Fragment: fragmentElement not available, using fallback');
    // Implement fallback behavior or early return
    return;
}
```

This fragmentElement concept is **fundamental to creating professional, production-ready fragments** that work reliably when multiple instances exist on the same page.

## Fragment Image Editing Requirements

All images in fragments must be made editable using Liferay's inline editing system:

```html
<img
   src="placeholder.jpg"
   alt="Placeholder"
   data-lfr-editable-id="img1"
   data-lfr-editable-type="image"
>
```

Apply to all images where content editors should be able to customize them.

## Modal Implementation Requirements

### Modal Structure
- Modal buttons must open overlay with embedded Liferay portlets
- Use FreeMarker template to embed portlets: `[@liferay_portlet["runtime"] portletName="PORTLET_NAME" /]`
- Modal should check user login status and show appropriate content
- Include proper modal structure with overlay, close button, and escape key handling
- Modal should prevent background scrolling when open
- Use `themeDisplay.isSignedIn()` to conditionally show different content

### Modal Theme Styling Implementation
**Problem**: Embedded Liferay portlets inherit global Liferay styles instead of custom theme
**Solution**: Comprehensive CSS overrides with `!important` declarations target actual DOM structure

**Key CSS Targets**:
- `.form-control`, `input.field`, `.clearable.form-control` - Input field styling with brand colors
- `.control-label` - Label styling with brand colors
- `.btn-primary` - Primary button with brand background and hover effects
- `.lfr-btn-label` - Button text styling
- `.taglib-text a` - Footer links with brand colors and hover effects
- `.portlet`, `.portlet-content`, `.portlet-body` - Remove unwanted portlet container styling

**Implementation**: All styling scoped to modal content class to prevent interference

## Navigation Implementation Requirements

### API Structure Handling
**Problem**: Navigation dropdowns may not work due to API structure mismatch
**Root Cause**: Code may look for `item.children` but Liferay API returns `item.navigationMenuItems`

**Solution**: Update navigation functions to handle both API and fallback structures

**Key Features**:
- **API Support**: Handle `navigationMenuItems` from Liferay Headless Delivery API
- **Fallback Support**: Maintain `children` compatibility for manual navigation
- **Property Mapping**: Support both `item.link || item.url` and `item.name || item.title`
- **Dropdown Behavior**: Hover to show, click to toggle, keyboard navigation (Enter/Space/Escape)
- **Outside Click**: Close all dropdowns when clicking outside navigation
- **Multiple Dropdown Management**: Close other dropdowns when opening new ones

### Fragment Dropdown Scoping Requirements
**Problem**: Fragment dropdown code can interfere with other Liferay functionality
**Solution**: Strictly scope all dropdown functionality to only affect navigation within the fragment

**Key Features**:
- **Fragment-Only Scope**: All dropdown queries strictly limited to `fragmentElement`
- **No Global Interference**: Remove all document-wide dropdown handling
- **Native Liferay Compatibility**: Allow Liferay's native dropdown systems to work uninterrupted

**Implementation**: All dropdown selectors use `fragmentElement.querySelectorAll()` exclusively

## Header JavaScript Scoping Requirements

**Critical Rule**: All JavaScript in header fragment must be scoped ONLY to navigation functionality

**Scope Limitation**: JavaScript must only affect elements within the header fragment's navigation area

**DOM Query Requirements**:
- Use `fragmentElement.querySelector()` for all DOM queries
- Never use `document.querySelector()` or global selectors
- Scope all event listeners to elements within the fragment

**Timing Requirements**:
- Initialize dropdowns AFTER navigation rendering is complete
- Use `setTimeout()` delay to ensure DOM elements exist before attaching handlers

**Event Handler Scoping**:
- All event handlers must be scoped to fragment elements only
- Outside click detection limited to fragment scope
- No interference with Liferay's global event systems

## CSS Wrapper Scoping Requirements

**Critical Rule**: ALL CSS must be scoped to `#wrapper` to prevent interference with Liferay admin interface

**Global CSS Scoping**: Every selector in global CSS client extension must be prefixed with `#wrapper`
**Fragment CSS Scoping**: Every selector in fragment CSS files must be prefixed with `#wrapper`

**Scope Coverage**:
- Typography: `#wrapper h1`, `#wrapper h2`, etc.
- Buttons: `#wrapper .brand-btn`
- Utilities: `#wrapper .brand-*`
- Grids: `#wrapper .brand-grid`
- Responsive: `@media { #wrapper .class }`
- Custom scrollbars: `#wrapper ::-webkit-scrollbar`

**Admin Interface Protection**: Ensures Liferay admin interface styling remains unaffected

**Implementation Pattern**: 
- Before: `.brand-btn { ... }`
- After: `#wrapper .brand-btn { ... }`

## Liferay Edit Mode Z-Index Requirements

**Critical Rule**: Avoid overriding Liferay's built-in z-index hierarchy to prevent control menu interference
**Problem**: Aggressive z-index overrides can cause Liferay's control menu and admin interface to malfunction
**Conservative Z-Index Strategy**: Use standard Bootstrap modal values that don't conflict with Liferay admin interface

**Fragment Z-Index Implementation**:
```css
/* Fragment modal and search suggestions z-index limits - conservative approach */
#wrapper .modal-backdrop,
#wrapper .modal {
    z-index: 1050 !important;
}

#wrapper .search-bar-suggestions-dropdown-menu,
#wrapper .dropdown-menu.show {
    z-index: 1060 !important;
}
```

**Key Principle**: Let Liferay manage edit mode element priorities, only override fragment-specific modals
**Fragment Z-Index Limits**: Fragment elements should use standard Bootstrap z-index values (1050-1060)
**Modal Z-Index**: Application modals use z-index 1050 (Bootstrap standard)
**Search Suggestions**: Use z-index 1060 for dropdown suggestions

## Liferay Dropzone Implementation Guide

**Overview**: Dropzones allow content editors to add Liferay portlets or fragments dynamically within existing fragments.

### HTML Implementation

**Modal Dropzone Example**:
```html
<div class="modal-content">
    <lfr-drop-zone data-lfr-drop-zone-id="modal-content">
    </lfr-drop-zone>
</div>
```

**Header Actions Dropzone Example**:
```html
<div class="header-dropzone">
    <lfr-drop-zone data-lfr-drop-zone-id="header-extra">
    </lfr-drop-zone>
</div>
```

### CSS Implementation

**Modal Dropzone Styling**:
```css
#wrapper .modal-content {
    padding: var(--spacing-lg);
    min-height: 200px;
    height: auto;
    transition: min-height 0.3s ease;
}

/* Dynamic height expansion when dropdown suggestions appear */
#wrapper .modal-content:has(.dropdown-menu.suggestions-dropdown.show) {
    min-height: 500px;
}
```

**Header Dropzone Base Styling**:
```css
#wrapper .header-dropzone {
    display: flex;
    align-items: center;
    margin-left: var(--spacing-md);
}

#wrapper .header-dropzone lfr-drop-zone {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    min-width: 100px;
    border: 2px dashed transparent;
    border-radius: 4px;
    transition: all 0.3s ease;
    padding: 8px 16px;
    box-sizing: border-box;
}
```

### Edit Mode Detection and Styling

**Multiple Edit Mode Selectors** (comprehensive coverage):
```css
/* Show dropzone in edit mode */
#wrapper .header-dropzone lfr-drop-zone[data-editor-enabled="true"],
#wrapper .is-edit-mode .header-dropzone lfr-drop-zone,
body.has-edit-mode-menu .header-dropzone lfr-drop-zone {
    border-color: #your-brand-color !important;
    background-color: rgba(your-brand-rgb, 0.05) !important;
    position: relative;
    min-width: 120px !important;
    min-height: 40px !important;
    width: auto;
    display: flex !important;
    visibility: visible !important;
}
```

**Edit Mode Placeholder Text**:
```css
#wrapper .header-dropzone lfr-drop-zone[data-editor-enabled="true"]:before,
#wrapper .is-edit-mode .header-dropzone lfr-drop-zone:before,
body.has-edit-mode-menu .header-dropzone lfr-drop-zone:before {
    content: "Drop content here";
    color: #your-brand-color;
    font-size: 0.75rem;
    font-weight: 500;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    pointer-events: none;
    z-index: 1;
    display: block !important;
}

/* Hide placeholder when content is present */
#wrapper .header-dropzone lfr-drop-zone:not(:empty):before {
    display: none;
}
```

### Key CSS Classes and Selectors

**Edit Mode Detection Classes**:
- `[data-editor-enabled="true"]` - Liferay's standard edit mode attribute
- `.is-edit-mode` - Custom edit mode class detection
- `body.has-edit-mode-menu` - Body-level edit mode detection (most reliable)

**Dropzone Container Classes**:
- `.header-dropzone` - Header dropzone wrapper
- `.modal-content` - Modal dropzone container
- `lfr-drop-zone` - Liferay's standard dropzone element

**Visual State Classes**:
- `:before` pseudo-element for placeholder text
- `:not(:empty)` selector to hide placeholder when content exists
- Brand color scheme for borders and text

## Liferay Fragment ZIP Structure Requirements

### Individual Fragment ZIP Structure:
```
fragment-name/
├── fragment.json          # Main fragment metadata
├── configuration.json     # Fragment configuration schema  
├── index.html            # FreeMarker template
├── index.css             # Fragment styles
├── index.js              # Fragment JavaScript
└── thumbnail.png         # Fragment thumbnail (REQUIRED)
```

### Fragment Collection ZIP Structure:
```
collection-name/           # Root directory REQUIRED for proper import
├── collection.json       # Collection metadata (name, description)
├── fragments/
│   ├── fragment-name-1/
│   │   ├── fragment.json
│   │   ├── configuration.json
│   │   ├── index.html
│   │   ├── index.css
│   │   ├── index.js
│   │   └── thumbnail.png
│   └── ...
└── resources/            # Optional shared resources
    ├── icon-1.svg
    ├── logo.png
    └── ...
```

### Critical ZIP Creation (Python Implementation):
```python
import zipfile
import os

with zipfile.ZipFile('collection.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
    zipf.write('collection.json', 'collection-name/collection.json')
    zipf.write('resources', 'collection-name/resources/')
    # Add all files with collection-name/ prefix
```

### Fragment Collection Resources Implementation:
- **Resources Directory**: Place all shared assets (SVG, PNG, etc.) in `resources/` at collection root
- **Reference Syntax**: Use `[resources:filename.svg]` in fragment HTML to reference collection resources
- **Performance Benefits**: Resources are cached and shared across all fragments in the collection
- **Best Practice**: Prefer resources over base64 data URLs for better performance and maintainability

**Example Implementation**:
```html
<!-- Instead of base64 data URL -->
<img src="[resources:brand-logo.svg]" alt="Logo" />

<!-- Resources directory structure -->
resources/
├── brand-logo.svg
├── hero-visual.svg
└── icons/
    ├── icon-1.svg
    └── icon-2.svg
```

### Key Requirements:
- Fragment ZIP: Must contain fragment folder with all files inside
- Collection ZIP: Must have proper root directory structure (collection-name/) containing collection.json + fragments/ + resources/
- Fragment.json: Must include all path references AND thumbnailPath (thumbnails are REQUIRED)
- Collection.json: Simple object with name and description only
- Thumbnail files: Every fragment must have thumbnail.png file (70+ bytes) and thumbnailPath reference
- Select field typeOptions: Must be object with validValues array, not direct array
- Resources: Place in resources/ directory and reference with `[resources:filename]` syntax
- ZIP Creation: Use Python zipfile module with proper root directory structure to ensure resources upload correctly

**Select Field Configuration Format**:
```json
"typeOptions": {
  "validValues": [
    {"value": "option1", "label": "Option 1"},
    {"value": "option2", "label": "Option 2"}
  ]
}
```

## Liferay Client Extension YAML Structure Requirements

**Working Client Extension YAML Format:**
```yaml
assemble:
  - from: src
    into: static

extension-name:
  name: Human Readable Name
  type: globalCSS  # or globalJS
  url: css/file.css  # single file reference
  # For JS only:
  async: true
  data-senna-track: permanent
  fetchpriority: low
```

**Common Client Extension Issues:**
- Missing `name` field causes blank deployment
- Using `cssURLs: [array]` instead of `url: file.css` breaks loading
- Must use single file reference, not array format
- JS extensions should include async, data-senna-track attributes for SPA compatibility

**Fragment Configuration Validation Errors:**
- `options` field is deprecated - must use `typeOptions`
- `typeOptions` must be object with `validValues` array, not direct array
- Validation error: "expected type: JSONObject, found: JSONArray" means wrong structure

## System Architecture Best Practices

### Authentication & Security
- **CSRF Protection**: All API calls secured with `?p_auth={Liferay.authtoken}` parameter
- **Conditional Rendering**: Authentication-aware UI components using `themeDisplay.isSignedIn()`
- **Native Portlet Integration**: Leverage Liferay's built-in portlets

### API Integration
- **Headless Delivery API**: Dynamic content loading from Liferay's REST APIs
- **Navigation API**: `/o/headless-delivery/v1.0/navigation-menus/{menuId}?nestedFields=true`
- **Authenticated Requests**: Consistent security parameter usage across all API calls

### Fragment Configuration System
- **Type-Safe Configuration**: Structured configuration.json with proper field types
- **Default Value Patterns**: `${configuration.fieldName!'defaultValue'}` syntax for null safety
- **Boolean Configuration**: Explicit true/false defaults for boolean fields
- **Select Options**: Dropdown configuration fields with predefined options
- **Conditional Rendering**: FreeMarker conditionals based on configuration values

### Fragment Instance Management
- **Built-in fragmentElement**: Automatic fragment container reference provided by Liferay
- **Scoped DOM Queries**: All queries use `fragmentElement.querySelector()` for instance isolation
- **Multiple Instance Support**: Prevents conflicts when same fragment appears multiple times
- **CSS Scoping**: Fragment-specific styling using `[data-lfr-fragment-entry-link-id]` selectors

### Fragment Collection Resources System
- **Shared Asset Management**: Resources directory enables sharing assets across multiple fragments
- **Reference Syntax**: `[resources:filename.ext]` in FreeMarker templates automatically resolves to collection resources
- **Performance Optimization**: Resources are cached by Liferay and served efficiently vs inline base64 data
- **Asset Organization**: Supports subdirectories within resources/ for organized asset structure
- **Deployment Structure**: Resources are deployed with the collection and available to all fragments

## Implementation Examples

### JM Header Fragment Architecture

**Core Components:**
1. Logo & Brand Identity
2. Dynamic Navigation System
3. Mega Menu System (5 configurable dropzones)
4. Mobile Hamburger Menu
5. Header Actions (Search, Login, Language Selector)
6. Modal System (Search & Login overlays)

**Key Features:**
- **API Integration**: Uses Liferay Headless Delivery API
- **Fallback System**: Graceful degradation when API unavailable
- **Authentication**: Handles both authenticated and guest users
- **URL Building**: Configurable site prefix for multi-site support

### JM Card Fragment Architecture

**Core Components:**
1. Card Image (optional)
2. Category Tag (optional)
3. Title (required)
4. Description (required)
5. Call-to-Action Button (optional)

**Key Features:**
- **Context-Aware Styling**: Recognizes when placed in mega menu context
- **Compact Mode**: Applies reduced spacing and sizing for mega menus
- **Full Mode**: Standard sizing for page content areas
- **Responsive Design**: Mobile-optimized layout