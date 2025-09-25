/**
 * Sigma Panel Fragment - Collapsible panel with Liferay dropzone
 * 
 * CRITICAL: All JavaScript is scoped to fragmentElement to support
 * multiple instances of this fragment on the same page without conflicts.
 */

(function() {
    'use strict';
    
    // Ensure fragmentElement is available (provided by Liferay)
    if (typeof fragmentElement === 'undefined') {
        console.warn('Sigma Panel: fragmentElement not available, using fallback');
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
                    panelTitle: configuration.panelTitle || 'Product Information Panel',
                    panelIcon: configuration.panelIcon || 'options',
                    isOpenByDefault: configuration.isOpenByDefault !== undefined ? configuration.isOpenByDefault : false,
                    panelStyle: configuration.panelStyle || 'primary',
                    paddingSize: configuration.paddingSize || 'md',
                    showBadge: configuration.showBadge !== undefined ? configuration.showBadge : false,
                    badgeCount: configuration.badgeCount || '0'
                };
            } else {
                // Fallback default values if configuration is not available
                config = {
                    panelTitle: 'Product Information Panel',
                    panelIcon: 'options',
                    isOpenByDefault: false,
                    panelStyle: 'primary',
                    paddingSize: 'md',
                    showBadge: false,
                    badgeCount: '0'
                };
            }
        } catch (error) {
            console.warn('Sigma Panel: Error reading configuration, using defaults:', error);
            config = {
                panelTitle: 'Product Information Panel',
                panelIcon: 'options',
                isOpenByDefault: false,
                panelStyle: 'primary',
                paddingSize: 'md',
                showBadge: false,
                badgeCount: '0'
            };
        }
        
        return config;
    }
    
    /**
     * Initialize panel toggle functionality
     * All DOM queries scoped to this fragment instance
     */
    function initializePanelToggle() {
        // Get elements within this fragment only
        const panel = fragmentElement.querySelector('.sigma-panel');
        const panelHeader = fragmentElement.querySelector('.sigma-panel-header');
        const panelBody = fragmentElement.querySelector('.sigma-panel-body');
        const panelToggle = fragmentElement.querySelector('.sigma-panel-toggle');
        const dropzone = fragmentElement.querySelector('.sigma-panel-content lfr-drop-zone');
        
        if (!panel || !panelHeader || !panelBody || !panelToggle) {
            console.warn('Sigma Panel: Required panel elements not found in fragment');
            return;
        }
        
        // Get configuration for this fragment instance
        const config = getFragmentConfiguration();
        
        // Set initial state based on configuration
        let isExpanded = config.isOpenByDefault;
        
        // Apply initial state
        updatePanelState(isExpanded);
        
        /**
         * Update panel visual state and dropzone visibility
         * @param {boolean} expanded - Whether panel should be expanded
         */
        function updatePanelState(expanded) {
            isExpanded = expanded;
            
            // Update ARIA attribute for accessibility
            panelHeader.setAttribute('aria-expanded', expanded.toString());
            
            // Update panel class for CSS styling
            if (expanded) {
                panel.classList.add('expanded');
                showPanelBody();
            } else {
                panel.classList.remove('expanded');
                hidePanelBody();
            }
            
            // Update dropzone visibility - only show when panel is open
            if (dropzone) {
                dropzone.style.display = expanded ? 'block' : 'none';
            }
        }
        
        /**
         * Show panel body with smooth animation
         */
        function showPanelBody() {
            panelBody.style.display = 'block';
            panelBody.classList.remove('closing');
            panelBody.classList.add('opening');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                panelBody.classList.remove('opening');
            }, 300);
        }
        
        /**
         * Hide panel body with smooth animation
         */
        function hidePanelBody() {
            panelBody.classList.remove('opening');
            panelBody.classList.add('closing');
            
            // Hide after animation completes
            setTimeout(() => {
                panelBody.style.display = 'none';
                panelBody.classList.remove('closing');
            }, 300);
        }
        
        /**
         * Toggle panel state
         */
        function togglePanel() {
            updatePanelState(!isExpanded);
        }
        
        // Add click event listener to panel header (scoped to this fragment)
        panelHeader.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            togglePanel();
        });
        
        // Add keyboard support for accessibility (scoped to this fragment)
        panelHeader.addEventListener('keydown', function(event) {
            // Toggle on Enter or Space key
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                togglePanel();
            }
        });
        
        // Prevent dropzone clicks from toggling panel
        if (dropzone) {
            dropzone.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        }
    }
    
    /**
     * Apply configuration settings to the panel elements
     * All DOM queries scoped to this fragment instance
     */
    function applyConfiguration() {
        const config = getFragmentConfiguration();
        const panel = fragmentElement.querySelector('.sigma-panel');
        const badge = fragmentElement.querySelector('.sigma-panel-badge');
        
        // Apply panel style and padding
        if (panel) {
            panel.setAttribute('data-style', config.panelStyle);
            panel.setAttribute('data-padding', config.paddingSize);
        }
        
        // Show/hide badge based on configuration
        if (badge) {
            badge.style.display = config.showBadge ? 'block' : 'none';
        }
    }
    
    /**
     * Initialize the panel fragment
     * Called once when fragment loads
     */
    function initializePanel() {
        try {
            // Apply configuration settings
            applyConfiguration();
            
            // Initialize toggle functionality
            initializePanelToggle();
            
        } catch (error) {
            console.error('Sigma Panel: Error during initialization:', error);
        }
    }
    
    /**
     * Cleanup function for fragment (if needed)
     */
    function cleanup() {
        // Remove any event listeners if fragment is removed
        // This helps prevent memory leaks
        const panelHeader = fragmentElement.querySelector('.sigma-panel-header');
        if (panelHeader) {
            panelHeader.removeEventListener('click', null);
            panelHeader.removeEventListener('keydown', null);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePanel);
    } else {
        // DOM is already ready, initialize immediately
        initializePanel();
    }
    
    // Optional: Add to global scope for debugging (scoped to this fragment)
    if (typeof window !== 'undefined' && window.console) {
        fragmentElement.sigmaPanelInstance = {
            config: getFragmentConfiguration(),
            reinitialize: initializePanel,
            cleanup: cleanup
        };
    }
    
})();