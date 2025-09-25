/**
 * Sigma Title Fragment - Full-width pharmaceutical title with configurable icons
 * 
 * CRITICAL: All JavaScript is scoped to fragmentElement to support
 * multiple instances of this fragment on the same page without conflicts.
 */

(function() {
    'use strict';
    
    // Ensure fragmentElement is available (provided by Liferay)
    if (typeof fragmentElement === 'undefined') {
        console.warn('Sigma Title: fragmentElement not available, using fallback');
        return;
    }
    
    /**
     * Get fragment configuration from Liferay
     * Scoped to this fragment instance only
     */
    function getFragmentConfiguration() {
        let config;
        
        try {
            // Try to get configuration from Liferay's fragment configuration system
            if (typeof configuration !== 'undefined') {
                config = {
                    headingLevel: configuration.headingLevel || 'h1',
                    titleIcon: configuration.titleIcon || 'pharmaceutical',
                    backgroundStyle: configuration.backgroundStyle || 'gradient-primary',
                    textAlignment: configuration.textAlignment || 'left',
                    textColor: configuration.textColor || 'auto',
                    showDivider: configuration.showDivider !== undefined ? configuration.showDivider : true,
                    compactMode: configuration.compactMode !== undefined ? configuration.compactMode : false
                };
            } else {
                // Fallback default values if configuration is not available
                config = {
                    headingLevel: 'h1',
                    titleIcon: 'pharmaceutical',
                    backgroundStyle: 'gradient-primary',
                    textAlignment: 'left',
                    textColor: 'auto',
                    showDivider: true,
                    compactMode: false
                };
            }
        } catch (error) {
            console.warn('Sigma Title: Error reading configuration, using defaults:', error);
            config = {
                headingLevel: 'h1',
                titleIcon: 'pharmaceutical',
                backgroundStyle: 'gradient-primary',
                textAlignment: 'left',
                textColor: 'auto',
                showDivider: true,
                compactMode: false
            };
        }
        
        return config;
    }
    
    /**
     * Apply configuration settings to the title elements
     * All DOM queries scoped to this fragment instance
     */
    function applyConfiguration() {
        const config = getFragmentConfiguration();
        const container = fragmentElement.querySelector('.sigma-title-container');
        const divider = fragmentElement.querySelector('.sigma-title-divider');
        const icon = fragmentElement.querySelector('.sigma-title-icon');
        
        // Apply container attributes
        if (container) {
            container.setAttribute('data-background', config.backgroundStyle);
            container.setAttribute('data-alignment', config.textAlignment);
            container.setAttribute('data-compact', config.compactMode.toString());
            container.setAttribute('data-text-color', config.textColor);
        }
        
        // Show/hide divider based on configuration
        if (divider) {
            divider.style.display = config.showDivider ? 'block' : 'none';
        }
        
        // Show/hide icon based on configuration
        if (icon) {
            icon.style.display = config.titleIcon === 'none' ? 'none' : 'flex';
        }
    }
    
    /**
     * Initialize accessibility features
     * All DOM queries scoped to this fragment instance
     */
    function initializeAccessibility() {
        const heading = fragmentElement.querySelector('.sigma-title-heading');
        const container = fragmentElement.querySelector('.sigma-title-container');
        
        if (!heading || !container) return;
        
        // Ensure proper heading hierarchy awareness
        const config = getFragmentConfiguration();
        
        // Add role and aria-label for better screen reader support
        heading.setAttribute('role', 'heading');
        heading.setAttribute('aria-level', config.headingLevel.charAt(1)); // Extract number from h1, h2, h3
        
        // Add landmark role to container for navigation
        container.setAttribute('role', 'banner');
        container.setAttribute('aria-label', 'Section heading');
    }
    
    /**
     * Initialize intersection observer for animation effects (optional)
     * All observations scoped to this fragment instance
     */
    function initializeAnimations() {
        const container = fragmentElement.querySelector('.sigma-title-container');
        
        if (!container || !('IntersectionObserver' in window)) return;
        
        // Create intersection observer for entrance animations
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // Add animation class when title comes into view
                    entry.target.classList.add('animated-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe this fragment's container only
        observer.observe(container);
        
        // Store observer reference for cleanup
        fragmentElement.titleObserver = observer;
    }
    
    /**
     * Handle dynamic content updates
     * Scoped to this fragment instance
     */
    function handleContentUpdates() {
        const heading = fragmentElement.querySelector('.sigma-title-heading');
        
        if (!heading) return;
        
        // Monitor heading text changes for dynamic updates
        const textObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    // Update accessibility attributes when text changes
                    const text = heading.textContent.trim();
                    if (text) {
                        heading.setAttribute('aria-label', text);
                    }
                }
            });
        });
        
        // Observe text content changes
        textObserver.observe(heading, {
            childList: true,
            characterData: true,
            subtree: true
        });
        
        // Store observer reference for cleanup
        fragmentElement.textObserver = textObserver;
    }
    
    /**
     * Initialize the title fragment
     * Called once when fragment loads
     */
    function initializeTitle() {
        try {
            // Apply configuration settings
            applyConfiguration();
            
            // Initialize accessibility features
            initializeAccessibility();
            
            // Initialize animations (optional)
            initializeAnimations();
            
            // Handle dynamic content updates
            handleContentUpdates();
            
        } catch (error) {
            console.error('Sigma Title: Error during initialization:', error);
        }
    }
    
    /**
     * Cleanup function for fragment (if needed)
     */
    function cleanup() {
        // Clean up intersection observers to prevent memory leaks
        if (fragmentElement.titleObserver) {
            fragmentElement.titleObserver.disconnect();
            delete fragmentElement.titleObserver;
        }
        
        if (fragmentElement.textObserver) {
            fragmentElement.textObserver.disconnect();
            delete fragmentElement.textObserver;
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTitle);
    } else {
        // DOM is already ready, initialize immediately
        initializeTitle();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    
    // Optional: Add to global scope for debugging (scoped to this fragment)
    if (typeof window !== 'undefined' && window.console) {
        fragmentElement.sigmaTitleInstance = {
            config: getFragmentConfiguration(),
            reinitialize: initializeTitle,
            cleanup: cleanup
        };
    }
    
})();