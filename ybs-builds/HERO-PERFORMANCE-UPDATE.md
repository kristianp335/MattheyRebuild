# YBS Hero Fragment - Performance Update

## Changes Applied (October 13, 2025)

### ✅ Fixed: Hero Image Performance Issues

The hero fragment has been updated with critical performance optimizations to improve Largest Contentful Paint (LCP) and prevent layout shift.

---

## What Was Changed

### 1. **Added Fixed Dimensions to Hero Image**

**Before:**
```html
<img 
  src="data:image/svg+xml,..."
  alt="Yorkshire Building Society - Members enjoying their community"
  class="ybs-hero-img"
  data-lfr-editable-id="hero-image"
  data-lfr-editable-type="image"
/>
```

**After:**
```html
<img 
  src="data:image/svg+xml,..."
  alt="Yorkshire Building Society - Members enjoying their community"
  width="1200"
  height="800"
  fetchpriority="high"
  loading="eager"
  class="ybs-hero-img"
  data-lfr-editable-id="hero-image"
  data-lfr-editable-type="image"
/>
```

**Impact:**
- ✅ Browser reserves exact space for image (prevents layout shift)
- ✅ Image loads with high priority (improves LCP)
- ✅ Eager loading ensures hero appears immediately

---

### 2. **Enhanced CSS for Performance**

**Before:**
```css
.ybs-hero-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
}
```

**After:**
```css
.ybs-hero-img {
  width: 100%;
  height: auto;
  aspect-ratio: 3/2;        /* Maintains aspect ratio */
  object-fit: cover;        /* Proper image scaling */
  border-radius: 8px;
  display: block;
  contain: layout style;    /* CSS containment for performance */
}
```

**Impact:**
- ✅ Aspect ratio prevents layout shift during loading
- ✅ CSS containment isolates layout calculations
- ✅ Proper object-fit ensures image scales correctly

---

## Hard-Coded SVG Image

The hero fragment now includes a **fully embedded SVG image** with Yorkshire Building Society branding:

**SVG Features:**
- 🟢 YBS green color scheme (#00693E primary, #008551 secondary)
- 👥 Community illustration with member silhouettes
- 📅 "Member-owned since 1864" messaging
- 🎨 Soft green gradient background
- 🔒 No external dependencies (fully self-contained)

**SVG Content:**
- Light green gradient background (E8F5E9 → C8E6C9)
- Abstract member silhouettes in YBS brand colors
- Decorative circles and shapes for visual interest
- Member ownership message at bottom
- Rounded corners (20px radius) for modern look

---

## Expected Performance Improvements

### Lighthouse Metrics:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **LCP** | 13.3s | ~9-10s | **-25-30%** |
| **CLS** | Variable | 0 | **No shift** |
| **FCP** | 10.1s | ~9s | **-10%** |

### Why This Helps:

1. **Fixed Dimensions (width/height)**
   - Browser knows image size before download
   - Reserves correct space immediately
   - Prevents content jumping (layout shift)

2. **High Priority Loading**
   - `fetchpriority="high"` tells browser this is critical
   - Image loads before less important resources
   - Reduces LCP time significantly

3. **Aspect Ratio CSS**
   - Maintains proportions during responsive scaling
   - Works perfectly with width: 100%
   - No additional layout calculations needed

4. **CSS Containment**
   - Isolates fragment rendering from rest of page
   - Reduces browser paint/layout work
   - Improves overall rendering performance

---

## SVG is Fully Embedded

The SVG image is **hard-coded directly in the fragment** as a data URL:

```
src="data:image/svg+xml,%3Csvg width='600' height='400' viewBox='0 0 600 400' xmlns='http://www.w3.org/2000/svg'%3E..."
```

**Benefits:**
- ✅ No external HTTP request required
- ✅ Instant rendering (already in HTML)
- ✅ No CORS or loading issues
- ✅ Perfect for hero/above-fold content

---

## Deployment

The updated fragment is ready to deploy:

**File:** `ybs-builds/ybs-collection.zip` (1.18 MB)

**Steps:**
1. Upload `ybs-collection.zip` to Liferay
2. Fragment will automatically include performance optimizations
3. Clear browser cache (Ctrl+Shift+R)
4. Run Lighthouse test to verify improvements

---

## Additional Quick Wins

To maximize performance, also consider:

1. **Enable Fragment Caching** (Liferay UI)
   - Site Menu → Design → Fragments
   - Mark hero as cacheable

2. **Fix Trustpilot HTTP Request** (if present)
   - Change to HTTPS + add `async` attribute

3. **Check Configuration**
   - Ensure `showImage` is set to `true` in fragment config
   - Verify hero displays correctly in Liferay

---

## Testing Checklist

After deployment:
- [ ] Hero image displays correctly
- [ ] No layout shift when page loads
- [ ] Image appears quickly (within 3-4 seconds)
- [ ] Responsive sizing works on mobile
- [ ] Run Lighthouse test - LCP should improve
- [ ] Check browser console - no errors

---

**Updated:** October 13, 2025  
**Version:** YBS Collection v1.3 (Performance Optimized)
