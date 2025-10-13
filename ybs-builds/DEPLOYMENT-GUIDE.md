# Yorkshire Building Society Liferay Fragment Collection - Deployment Guide

## Overview
Complete YBS fragment collection with 3 professional fragments and global theme client extension for Liferay DXP deployment.

## Build Files

### 1. Fragment Collection
- **File**: `ybs-collection.zip` (765KB)
- **Contains**: 3 fragments (ybs-header, ybs-footer, ybs-hero)
- **Collection Key**: `ybs-collection`

### 2. Client Extension
- **File**: `ybs-frontend-client-extension.zip` (5.4KB)
- **Contains**: Global CSS and JavaScript for YBS branding

## Deployment Steps

### Step 1: Deploy Client Extension
1. Navigate to Liferay's **Client Extensions** area
2. Upload `ybs-frontend-client-extension.zip`
3. Ensure both CSS and JavaScript client extensions are activated

### Step 2: Deploy Fragment Collection
1. Go to **Site Builder** > **Page Fragments**
2. Click **Import** or **Add Collection**
3. Upload `ybs-collection.zip`
4. Verify all 3 fragments are imported successfully

### Step 3: Build Pages
Use the fragments to create YBS-branded pages:
- **ybs-header**: Navigation, search, login, mega menu
- **ybs-hero**: Hero section with "IT'S ALL ABOUT YOU" messaging
- **ybs-footer**: Comprehensive footer with social links

## Fragment Details

### YBS Header
**Features**:
- Responsive navigation with mobile menu
- Search modal with dropzone for search components
- Login modal (auto-renders for non-authenticated users)
- 5 mega menu dropzones for rich navigation content
- User profile widget integration
- Language selector dropzone

**Configuration Options**:
- Show/hide search button
- Show/hide user menu
- Navigation menu ID selection
- Site prefix configuration
- Header style (white/light/primary)

### YBS Footer
**Features**:
- Company information with logo
- Social media links (LinkedIn, YouTube, Instagram)
- 4 navigation columns: About Us, Products, Support, News & Info
- Newsletter signup form
- Legal links (Privacy, Terms, Cookies, etc.)
- Back to top button
- Copyright with dynamic year

**Configuration Options**:
- Show/hide newsletter signup
- Show/hide social media links
- Show/hide back to top button
- Company name customization
- Footer style (dark/light/primary)
- Column layout (3/4/5 column)
- Newsletter service integration

### YBS Hero
**Features**:
- Prominent "IT'S ALL ABOUT YOU" headline
- Member-focused messaging
- Dual CTA buttons (Compare savings / Find mortgage)
- Configurable image placement
- Fully responsive design

**Configuration Options**:
- Hero style (light-gray/white/primary)
- Content alignment (left/center)
- Show/hide hero image
- Image position (right/left/background)

## Brand Colors
- **Primary Green**: #00693E
- **Secondary Green**: #008551
- **Light Gray**: #F5F5F5

## Technical Requirements
- **Liferay Version**: DXP 7.4+ or Portal CE 7.4+
- **Theme**: Liferay Classic theme recommended
- **Browser Support**: Modern browsers with CSS Grid and Flexbox

## Rebuild Instructions
To rebuild the ZIPs from source:

```bash
python3 build_ybs_zips.py
```

Output will be in the `ybs-builds/` directory.

## Support
All fragments are fully editable through Liferay's fragment editor:
- Inline text editing for all content
- Configuration panels for all options
- Dropzones for additional content

## Files Generated
✓ ybs-collection.zip (765KB)
✓ ybs-frontend-client-extension.zip (5.4KB)
✓ This deployment guide

---
Built: October 13, 2025
Based on proven Johnson Matthey collection architecture
