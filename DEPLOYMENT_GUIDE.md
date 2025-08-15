# CLIENT EXTENSION DEPLOYMENT GUIDE

## 📦 **Client Extension Configuration (Updated)**

The client extension now uses **split CSS architecture** for optimal performance:

### **New YAML Configuration:**
```yaml
johnson-matthey-critical-css:
  name: Johnson Matthey Critical CSS - High Priority
  type: globalCSS
  url: global-critical.css
  cssElementAttributes:
    media: "all"
    fetchpriority: "high"

johnson-matthey-deferred-css:
  name: Johnson Matthey Deferred CSS - Low Priority  
  type: globalCSS
  url: global-deferred.css
  cssElementAttributes:
    media: "all"
    fetchpriority: "low"

johnson-matthey-global-js:
  name: Johnson Matthey Global JavaScript - Non-blocking
  type: globalJS
  scriptLocation: head
  url: global.js
  scriptElementAttributes:
    data-senna-track: "permanent"
    async: "true"
    defer: "true"
    fetchpriority: "low"
```

## **🎯 CSS Loading Strategy:**

### **Critical CSS (63 lines)**
- **File**: `global-critical.css`
- **Priority**: HIGH
- **Contains**: Essential LCP styles, hero text, header logo, basic layout
- **Loads**: Immediately for fast LCP rendering

### **Deferred CSS (90 lines)**  
- **File**: `global-deferred.css`
- **Priority**: LOW
- **Contains**: Modals, forms, scrollbars, hover effects, animations
- **Loads**: After LCP, non-blocking

### **Legacy CSS (473 lines)**
- **File**: `global.css` 
- **Status**: Kept for backward compatibility
- **Priority**: LOW
- **Note**: Can be removed after confirming split CSS works

## **📋 Deployment Steps:**

1. **Deploy Client Extension** with updated `client-extension.yaml`
2. **Deploy Fragment Collection** with inlined critical CSS
3. **Test Performance** - Should see dramatic LCP improvement
4. **Remove Legacy** `global.css` entry after verification

## **🚀 Expected Performance:**

- **Critical CSS loads first** (63 lines) - enables immediate LCP render
- **Deferred CSS loads later** (90 lines) - doesn't block critical path  
- **JavaScript non-blocking** - won't delay text rendering
- **Total improvement**: 808ms render-blocking → ~200ms

**Target Result**: LCP 4.9s → 2.5s (2.4s improvement)