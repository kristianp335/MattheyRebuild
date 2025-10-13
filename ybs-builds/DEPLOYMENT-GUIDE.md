# Yorkshire Building Society Liferay Fragment Collection - Deployment Guide

## Overview
Complete YBS fragment collection with 3 professional fragments and global theme client extension for Liferay DXP deployment.

## Build Files

### 1. Fragment Collection
- **File**: `ybs-collection.zip` (1.2MB)
- **Contains**: 3 fragments (ybs-header, ybs-footer, ybs-hero)
- **Collection Key**: `ybs-collection`
- **Note**: All thumbnails are valid and meet Liferay's 70+ byte requirement

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
- Professional branded SVG illustration showing community/members
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
✓ ybs-collection.zip (1.2MB) - All thumbnails validated
✓ ybs-frontend-client-extension.zip (5.4KB)
✓ This deployment guide

## Troubleshooting

### Issue 1: ZIP Upload - Empty Thumbnails
**Error**: "HTML content must not be empty"
**Cause**: Empty thumbnail files (0 bytes)
**Solution**: All fragments must have valid thumbnail.png files (70+ bytes minimum)
**Status**: ✓ Fixed - All YBS thumbnails are valid (172KB header, 584KB footer, 399KB hero)

### Issue 2: Database Error - Emojis in CSS
**Error**: `Incorrect string value: '\xF0\x9F\x8E\xAF E...' for column 'css'`
**Cause**: Liferay's MySQL database uses utf8mb3 charset which doesn't support 4-byte UTF-8 characters (emojis)
**Solution**: Removed all emojis from CSS files and replaced with ASCII text:
- `🎯 Edit Mode` → `>> Edit Mode`
- `🌐 Language Selector` → `[Language Selector]`
**Status**: ✓ Fixed - All emojis removed from CSS content properties

### Issue 3: Editable Image Validation
**Error**: "Each editable image element must contain an IMG tag"
**Cause**: SVG element marked as editable image (Liferay requires actual `<img>` tags for editable images)
**Solution**: Converted SVG logo to IMG tag with data URL containing the SVG graphic
**Status**: ✓ Fixed - Logo now uses proper IMG element with editable image attributes

### Issue 4: JavaScript Variable Conflict
**Error**: "Uncaught SyntaxError: Identifier 'fragmentElement' has already been declared"
**Cause**: Improper fragmentElement availability check causing scope conflicts when multiple fragments load
**Solution**: Changed all fragments from `!fragmentElement` to `typeof fragmentElement === 'undefined'` check
**Pattern Used**: 
```javascript
if (typeof fragmentElement === 'undefined') {
    console.warn('Fragment: fragmentElement not available');
    return;
}
```
**Status**: ✓ Fixed - All fragments use proper typeof check to avoid redeclaration errors

---
**Build History:**
- Initial build: October 13, 2025
- Fixed empty thumbnail issue: October 13, 2025 09:37
- Fixed emoji/UTF-8 encoding issue: October 13, 2025 09:55
- Fixed editable image validation: October 13, 2025 10:01
- Fixed JavaScript variable conflict: October 13, 2025 11:48
- Added branded hero SVG image: October 13, 2025 11:43
- Based on proven Johnson Matthey collection architecture
- **Current version**: 1.2MB (production-ready, fully validated, branded)
