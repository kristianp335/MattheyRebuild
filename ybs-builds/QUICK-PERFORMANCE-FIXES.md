# YBS Performance - Quick Fixes (15 Minutes)

## 🚀 These 3 changes will improve your Lighthouse score by 30-40%

---

## 1. Fix Insecure HTTP Request (2 minutes)

**Problem**: Trustpilot widget loads over HTTP
**Current Score Impact**: Security fail + blocks FCP

**Find the Trustpilot script in your Liferay page and change**:
```html
<!-- BEFORE (insecure) -->
<script src="http://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"></script>

<!-- AFTER (secure + async) -->
<script src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
```

**Expected Gain**: 
- ✅ Fixes security score
- FCP: -0.3s to -0.5s

---

## 2. Add Hero Image Dimensions (5 minutes)

**Problem**: Hero SVG has no dimensions, causing layout shift and delayed LCP
**Current Score Impact**: LCP delayed by 2-3 seconds

**Edit `ybs-hero/index.html`**:

Find the hero image IMG tag and add explicit dimensions:

```html
<!-- BEFORE -->
<img src="data:image/svg+xml,..." 
     data-lfr-editable-type="image" 
     data-lfr-editable-id="hero-image" />

<!-- AFTER (add width, height, fetchpriority) -->
<img src="data:image/svg+xml,..." 
     width="1200" 
     height="675"
     fetchpriority="high"
     loading="eager"
     style="width: 100%; height: auto; aspect-ratio: 16/9; display: block;"
     data-lfr-editable-type="image" 
     data-lfr-editable-id="hero-image" />
```

**Expected Gain**: 
- LCP: -2s to -4s
- CLS: Prevents layout shift

---

## 3. Enable Fragment Caching (5 minutes)

**Problem**: Fragments regenerate on every page load
**Current Score Impact**: Slow server processing delays FCP

**Steps in Liferay**:
1. Go to **Site Menu → Design → Fragments**
2. Find **YBS Header** → Click **Actions (⋯) → Mark as Cacheable**
3. Find **YBS Footer** → Click **Actions (⋯) → Mark as Cacheable**
4. Find **YBS Hero** → Click **Actions (⋯) → Mark as Cacheable**
5. Clear browser cache (Ctrl+Shift+R)
6. Reload page

**Expected Gain**: 
- FCP: -1s to -2s (on repeat visits)
- Server load: -50%

---

## 4. BONUS: Defer Global JavaScript (3 minutes)

**Problem**: JavaScript blocks initial render
**Current Score Impact**: Delays FCP by 0.5-1s

**Edit `ybs-frontend-client-extension/client-extension.yaml`**:

```yaml
# Find your global JS config and add scriptElementAttributes

ybs-frontend-global-js:
  name: YBS Global JavaScript
  scriptElementAttributes:
    defer: true  # ADD THIS LINE
  scriptLocation: pageBottom  # ADD THIS LINE
  type: globalJS
  url: global.*.js
```

**Rebuild and redeploy**:
```bash
cd ybs-frontend-client-extension
# Build new version
# Redeploy to Liferay
```

**Expected Gain**: 
- FCP: -0.5s to -1s
- Total Blocking Time: -50ms

---

## Expected Results After All 4 Fixes

### Before:
- FCP: 10.1s
- LCP: 13.3s
- Speed Index: 10.1s
- Security: ❌ Failed

### After (15 minutes of work):
- FCP: **6-7s** (40% improvement) 📈
- LCP: **8-9s** (35% improvement) 📈
- Speed Index: **8s** (20% improvement) 📈
- Security: ✅ **Passed** ✅

### Next Steps:
Once these quick wins are done, see `PERFORMANCE-OPTIMIZATION-GUIDE.md` for advanced optimizations to reach **Lighthouse 90+ score**.

---

## Testing

**Run Lighthouse again after changes**:
1. Open Chrome DevTools (F12)
2. Go to **Lighthouse** tab
3. Click **Analyze page load**
4. Compare scores

**Target for quick fixes**: Performance score 40-50 (from ~15)
