# YBS Fragment Collection - Performance Optimization Guide

## Current Lighthouse Scores (Baseline)

### Critical Performance Metrics
- ❌ **First Contentful Paint (FCP)**: 10.1s (Target: < 1.8s) - **POOR**
- ❌ **Largest Contentful Paint (LCP)**: 13.3s (Target: < 2.5s) - **POOR**
- ❌ **Speed Index**: 10.1s (Target: < 3.4s) - **POOR**
- ✅ **Total Blocking Time**: 230ms (Target: < 200ms) - **GOOD**
- ⚠️ **Security Issue**: 1 insecure HTTP request detected

---

## Immediate Actions (Quick Wins)

### 1. Fix Insecure HTTP Request ⚠️
**Issue**: Trustpilot widget loading over HTTP instead of HTTPS
```
http://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js
```

**Solution**:
- Change to HTTPS: `https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js`
- Or remove Trustpilot widget if not essential
- Add `async` or `defer` attribute to prevent render blocking

**Impact**: Improves security score + slight FCP improvement

---

### 2. Optimize Hero Fragment Image (Critical for LCP)

**Current Issue**: The hero SVG is inline and large, delaying LCP

**Recommended Changes to `ybs-hero/index.html`**:

```html
<!-- Add explicit dimensions to prevent layout shift -->
<div class="ybs-hero-container">
  <img 
    src="data:image/svg+xml,..." 
    alt="Yorkshire Building Society Community"
    width="1200" 
    height="675"
    fetchpriority="high"
    loading="eager"
    class="ybs-hero-image"
    data-lfr-editable-type="image"
    data-lfr-editable-id="hero-image"
  />
</div>

<style>
.ybs-hero-image {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9; /* Prevents layout shift */
  object-fit: cover;
  display: block;
}
</style>
```

**Impact**: Reduces LCP by 2-4 seconds

---

### 3. Add Resource Hints to Fragments

**In `ybs-header/index.html` add preconnect hints**:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="dns-prefetch" href="https://widget.trustpilot.com">
```

**Impact**: Reduces DNS lookup time, improves FCP by 0.3-0.5s

---

## Medium Priority Optimizations

### 4. Optimize Client Extension CSS Loading

**Current**: Global CSS (474 lines) loads on every page

**Optimization Strategy**:

#### Option A: Split CSS into Critical + Non-Critical
Create two CSS files:

**critical.css** (load in `<head>`):
```css
/* Only above-the-fold styles */
:root {
  --ybs-primary: #00693E;
  --ybs-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

#wrapper {
  font-family: var(--ybs-font-family);
  color: #393a4a;
}

.ybs-btn {
  background-color: var(--ybs-primary);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
}
```

**deferred.css** (load with `rel="preload"`):
```html
<link rel="preload" href="/path/to/deferred.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/path/to/deferred.css"></noscript>
```

**Impact**: Improves FCP by 1-2 seconds

---

### 5. Optimize JavaScript Loading

**Current `global.js`** (189 lines) - loads synchronously

**Recommended Changes**:

#### Add to client-extension.yaml:
```yaml
ybs-frontend-global-js:
  name: YBS Global JavaScript
  scriptElementAttributes:
    defer: true  # Load after HTML parsing
  scriptLocation: pageBottom  # Place at bottom of page
  type: globalJS
  url: global.*.js
```

**Impact**: Prevents JavaScript from blocking initial render, improves FCP by 0.5-1s

---

### 6. Enable Fragment Caching (Liferay-Specific)

**Steps**:
1. Go to **Site Menu → Design → Fragments**
2. For each fragment (header, footer, hero):
   - Click **Actions (⋯) → Mark as Cacheable**
3. Set cache duration appropriately

**Impact**: Reduces server processing time, improves repeat visit performance

---

## Advanced Optimizations

### 7. Implement Lazy Loading for Below-Fold Content

**In `ybs-footer/index.html`**:
```html
<!-- Add lazy loading to social icons and images -->
<img src="/social-icon.png" loading="lazy" alt="Social Icon">
```

**Impact**: Reduces initial page load size, improves FCP

---

### 8. Optimize Header Mega Menu

**Current Issue**: Large dropdown menus in header may delay interactivity

**Optimization**:
```javascript
// In ybs-header/index.js
// Lazy initialize mega menu only when needed
function initializeMegaMenu() {
  const menuTriggers = fragmentElement.querySelectorAll('.mega-menu-trigger');
  
  menuTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', function initMenu() {
      // Initialize mega menu content on first hover
      loadMegaMenuContent(this);
      trigger.removeEventListener('mouseenter', initMenu);
    }, { once: true });
  });
}
```

**Impact**: Reduces Total Blocking Time, improves interactivity

---

### 9. Minify and Bundle Resources

**Add build optimization to client extension**:

Create `webpack.config.js` in `ybs-frontend-client-extension/`:
```javascript
const webpack = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.logs
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
};
```

**Impact**: Reduces file size by 30-40%, improves load times

---

### 10. Use CSS Containment for Fragments

**Add to fragment CSS**:
```css
.ybs-header-wrapper {
  contain: layout style; /* Isolates layout calculations */
}

.ybs-footer-wrapper {
  contain: layout style;
}

.ybs-hero-wrapper {
  contain: layout style paint; /* Strongest containment */
}
```

**Impact**: Reduces browser layout/paint work, improves rendering speed

---

## Liferay Platform Configuration

### 11. Disable Auto-Propagation (For Production)

**For large Liferay instances**:
1. Go to **Control Panel → Instance Settings → Page Fragments**
2. Uncheck **"Propagate Default Fragments Changes During Deploy Process Automatically"**
3. Use manual **"Propagate Changes"** button when needed

**Impact**: Reduces server load during deployments

---

### 12. Enable Liferay Caching

**Add to `portal-ext.properties`**:
```properties
# Enable browser caching
browser.launcher.cache.enabled=true

# Enable JavaScript/CSS minification
minifier.enabled=true

# Enable fragment caching
fragment.entry.processor.editable.map.cache.enabled=true
```

**Impact**: Significant improvement for repeat visitors

---

## Expected Performance Gains

### After Implementing Quick Wins (1-3):
- **FCP**: 10.1s → **6-7s** (30-40% improvement)
- **LCP**: 13.3s → **8-9s** (30-40% improvement)
- **Security Score**: ✅ Fixed

### After Implementing Medium Priority (4-6):
- **FCP**: 6-7s → **3-4s** (50-60% total improvement)
- **LCP**: 8-9s → **5-6s** (50-60% total improvement)

### After Implementing Advanced (7-12):
- **FCP**: 3-4s → **< 2.5s** (75% total improvement) ✅
- **LCP**: 5-6s → **< 4s** (70% total improvement) ✅
- **Speed Index**: 10.1s → **< 5s** (50% improvement)

---

## Testing & Validation

### Testing Checklist:
- [ ] Run Lighthouse after each change to measure impact
- [ ] Test on mobile network (3G/4G simulation)
- [ ] Verify fragment caching works correctly
- [ ] Check browser console for errors
- [ ] Test with browser cache disabled
- [ ] Validate on different browsers (Chrome, Firefox, Safari)

### Monitoring Tools:
- **Google Lighthouse** (Chrome DevTools)
- **WebPageTest** (https://www.webpagetest.org/)
- **Chrome User Experience Report** (CrUX data)

---

## Implementation Priority

### Week 1 (Immediate):
1. Fix insecure HTTP request
2. Add image dimensions to hero fragment
3. Add resource hints to header

### Week 2 (Medium):
4. Split CSS into critical/deferred
5. Optimize JavaScript loading
6. Enable fragment caching

### Week 3+ (Advanced):
7. Implement lazy loading
8. Optimize mega menu
9. Add minification/bundling
10. Configure Liferay platform settings

---

## Notes on Local Development

**Current Test Environment**: `http://localhost:8080`
- HTTPS warnings are expected in local dev
- FCP/LCP times may be slower due to local server overhead
- Test on production/staging for accurate metrics
- Consider using Liferay's built-in performance profiling tools

---

## Additional Resources

- **Liferay Performance Tuning**: https://learn.liferay.com/w/dxp/development/developing-page-fragments
- **Web.dev Performance Guides**: https://web.dev/articles/optimize-lcp
- **Lighthouse Documentation**: https://developer.chrome.com/docs/lighthouse/performance/

---

**Last Updated**: October 13, 2025  
**Target Lighthouse Performance Score**: 90+ (from current ~15)
