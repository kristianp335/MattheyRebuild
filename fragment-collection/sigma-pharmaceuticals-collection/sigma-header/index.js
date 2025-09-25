/* Sigma Pharmaceuticals Header Fragment JavaScript */
(function() {
    'use strict';
    
    // Use the fragmentElement provided by Liferay instead of document.currentScript
    // Liferay injects: const fragmentElement = document.querySelector('#fragment-xyz');
    if (!fragmentElement) {
        return;
    }
    
    // Initialize on DOM ready and SPA navigation events
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }
    
    // Initial load
    ready(initializeHeader);
    
    function initializeHeader() {
        // Sigma Pharmaceuticals Header Fragment initializing
        
        // Get configuration values
        const config = getFragmentConfiguration();
        
        // Check if we're in edit mode - more specific detection
        const editMode = isInEditMode();
        
        if (editMode) {
            // Apply configuration settings even in edit mode
            applyConfiguration(config);
            // Simplified initialization for edit mode
            const sampleNav = getSampleNavigation();
            renderNavigation(sampleNav);
            // Initialize mobile menu and modals for edit mode
            initializeMobileMenu();
            initializeModals();
            // Initialize mega menu content for edit mode - single call
            initializeMegaMenuContent();
            setupMegaMenuObserver();
            return;
        }
        
        // Full initialization for live mode - ensure modals are hidden
        ensureModalsHidden();
        
        // Apply configuration settings
        applyConfiguration(config);
        
        // Initialize navigation
        initializeNavigation();
        
        // Initialize logo home link
        initializeLogoLink();
        
        // Initialize mobile menu
        initializeMobileMenu();
        
        // Initialize modals
        initializeModals();
        
        // NOTE: initializeDropdowns() now called AFTER navigation renders
        
        // Sigma Pharmaceuticals Header Fragment initialized
    }
    
    function isInEditMode() {
        // Simplified edit mode detection - check for key indicators
        const body = document.body;
        
        // Check for specific Liferay edit mode indicators
        const hasEditModeMenu = body.classList.contains('has-edit-mode-menu');
        const isEditMode = body.classList.contains('is-edit-mode');
        const hasControlMenu = document.querySelector('.control-menu');
        const hasPageEditor = document.querySelector('.page-editor__sidebar, .page-editor-sidebar, [data-qa-id="pageEditor"]');
        const hasFragmentEntryProcessorEditable = document.querySelector('.fragment-entry-processor-editable');
        const hasEditableElements = document.querySelector('[contenteditable="true"], .lfr-editable-field');
        
        // Must have both control menu AND active page editor OR actively editable elements
        const inEditMode = (hasEditModeMenu || isEditMode) && (hasPageEditor || hasEditableElements);
        
        // Add/remove body class to help with mega menu dropzone visibility
        if (inEditMode) {
            body.classList.add('has-edit-mode-menu');
            fragmentElement.classList.add('sigma-edit-mode');
        } else {
            body.classList.remove('has-edit-mode-menu');
            fragmentElement.classList.remove('sigma-edit-mode');
        }
        
        return inEditMode;
    }
    
    function ensureModalsHidden() {
        // Ensure modals are hidden in live mode
        const searchOverlay = document.querySelector('#sigma-search-overlay');
        const loginOverlay = document.querySelector('#sigma-login-overlay');
        const languageDropzone = fragmentElement.querySelector('.sigma-language-selector-dropzone');
        const accountDropzone = fragmentElement.querySelector('.sigma-account-selector-dropzone');
        
        if (searchOverlay) {
            searchOverlay.classList.remove('sigma-edit-mode');
            searchOverlay.style.display = 'none';
        }
        
        if (loginOverlay) {
            loginOverlay.classList.remove('sigma-edit-mode');
            loginOverlay.style.display = 'none';
        }
        
        if (languageDropzone) {
            languageDropzone.classList.remove('sigma-edit-mode');
        }
        
        if (accountDropzone) {
            accountDropzone.classList.remove('sigma-edit-mode');
        }
    }
    
    function initializeNavigation() {
        loadNavigationMenu();
    }
    
    /**
     * Get fragment configuration values
     */
    function getFragmentConfiguration() {
        let config;
        
        // Try to get configuration from Liferay's fragment configuration system
        if (typeof configuration !== 'undefined') {
            config = {
                showSearch: configuration.showSearch !== undefined ? configuration.showSearch : true,
                showUserMenu: configuration.showUserMenu !== undefined ? configuration.showUserMenu : true,
                navigationMenuId: configuration.navigationMenuId || 'primary-menu',
                sitePrefix: configuration.sitePrefix || '',
                headerStyle: configuration.headerStyle || 'white'
            };
        } else {
            // Fallback default values if configuration is not available
            config = {
                showSearch: true,
                showUserMenu: true,
                navigationMenuId: 'primary-menu',
                sitePrefix: '',
                headerStyle: 'white'
            };
        }
        
        return config;
    }
    
    /**
     * Apply configuration settings to the header
     */
    function applyConfiguration(config) {
        const header = fragmentElement.querySelector('.sigma-header');
        const searchBtn = fragmentElement.querySelector('.sigma-search-btn');
        const userProfileWidget = fragmentElement.querySelector('.sigma-user-profile-widget');
        const loginBtn = fragmentElement.querySelector('.sigma-login-btn');
        
        // Apply header style
        if (header) {
            header.setAttribute('data-style', config.headerStyle);
        }
        
        // Show/hide search button
        if (searchBtn) {
            searchBtn.style.display = config.showSearch ? 'flex' : 'none';
        }
        
        // Show/hide user menu components
        if (userProfileWidget) {
            userProfileWidget.style.display = config.showUserMenu ? 'block' : 'none';
        }
        if (loginBtn) {
            loginBtn.style.display = config.showUserMenu ? 'flex' : 'none';
        }
    }

    /**
     * Load navigation menu from Liferay API
     */
    function loadNavigationMenu() {
        const config = getFragmentConfiguration();
        const menuId = config.navigationMenuId;
        
        // Skip API call if no valid menu ID is provided
        if (!menuId || menuId === 'primary-menu' || menuId === 'undefined' || menuId === undefined || typeof menuId !== 'string') {
            loadFallbackNavigation();
            return;
        }
        
        // Check if authentication token is available
        if (typeof Liferay === 'undefined' || !Liferay.authToken) {
            loadFallbackNavigation();
            return;
        }
        
        const apiUrl = `/o/headless-delivery/v1.0/navigation-menus/${menuId}?nestedFields=true&p_auth=${Liferay.authToken}`;
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                renderNavigationFromAPI(data.navigationMenuItems || []);
            })
            .catch(error => {
                // Error loading navigation menu
                loadFallbackNavigation();
            });
    }

    /**
     * Load fallback navigation when API is unavailable
     */
    function loadFallbackNavigation() {
        const fallbackNav = getSampleNavigation();
        renderNavigation(fallbackNav);
    }

    /**
     * Get sample navigation for edit mode and fallback
     */
    function getSampleNavigation() {
        return [
            {
                name: 'Products',
                url: '/products',
                children: [
                    { name: 'Clinical Trials', url: '/products/clinical-trials' },
                    { name: 'Exports', url: '/products/exports' },
                    { name: 'Repackaging', url: '/products/repackaging' }
                ]
            },
            {
                name: 'Services',
                url: '/services',
                children: [
                    { name: 'SigCare', url: '/services/sigcare' },
                    { name: 'Logistics', url: '/services/logistics' },
                    { name: 'Quality Assurance', url: '/services/quality' }
                ]
            },
            {
                name: 'About',
                url: '/about',
                children: [
                    { name: 'Our Story', url: '/about/story' },
                    { name: 'Values & Mission', url: '/about/values' },
                    { name: 'Leadership', url: '/about/leadership' }
                ]
            },
            {
                name: 'News',
                url: '/news'
            },
            {
                name: 'Contact',
                url: '/contact'
            }
        ];
    }

    /**
     * Render navigation from API response
     */
    function renderNavigationFromAPI(menuItems) {
        const config = getFragmentConfiguration();
        const sitePrefix = config.sitePrefix;
        
        // Transform API structure to internal format
        const navItems = menuItems.map(item => transformAPINavItem(item, sitePrefix));
        renderNavigation(navItems);
    }

    /**
     * Transform API navigation item to internal format
     */
    function transformAPINavItem(item, sitePrefix) {
        const navItem = {
            name: item.name || item.title || 'Unnamed',
            url: addSitePrefix(item.link || item.url || '#', sitePrefix)
        };
        
        // Handle children
        if (item.navigationMenuItems && item.navigationMenuItems.length > 0) {
            navItem.children = item.navigationMenuItems.map(child => transformAPINavItem(child, sitePrefix));
        } else if (item.children && item.children.length > 0) {
            navItem.children = item.children.map(child => transformAPINavItem(child, sitePrefix));
        }
        
        return navItem;
    }

    /**
     * Add site prefix to URL
     */
    function addSitePrefix(url, sitePrefix) {
        if (!sitePrefix || url.startsWith('http') || url.startsWith('#')) {
            return url;
        }
        
        return sitePrefix + (url.startsWith('/') ? url : '/' + url);
    }

    /**
     * Render navigation items
     */
    function renderNavigation(navItems) {
        const navList = fragmentElement.querySelector('#sigma-main-nav');
        const mobileNavList = fragmentElement.querySelector('.sigma-mobile-nav-list');
        
        if (!navList) return;
        
        // Clear existing navigation
        navList.innerHTML = '';
        if (mobileNavList) {
            mobileNavList.innerHTML = '';
        }
        
        // Count dropdown items for mega menu mapping
        let dropdownIndex = 0;
        
        // Render each navigation item
        navItems.forEach((item, index) => {
            // Increment dropdown index for items with dropdowns
            const currentDropdownIndex = item.children && item.children.length > 0 ? ++dropdownIndex : 0;
            const navItem = createNavItem(item, index, currentDropdownIndex);
            navList.appendChild(navItem);
            
            // Mobile navigation
            if (mobileNavList) {
                const mobileNavItem = createMobileNavItem(item);
                mobileNavList.appendChild(mobileNavItem);
            }
        });
        
        // Initialize dropdowns AFTER navigation is rendered
        initializeDropdowns();
        
        // Initialize mega menu content for both edit and live modes
        initializeMegaMenuContent();
        
        // Setup observer for edit mode content changes
        setupMegaMenuObserver();
    }

    /**
     * Create a navigation item
     */
    function createNavItem(item, index, dropdownIndex = 0) {
        const li = document.createElement('li');
        li.className = 'sigma-nav-item';
        
        const link = document.createElement('a');
        link.href = item.url;
        link.className = 'sigma-nav-link';
        link.textContent = item.name;
        
        // Add the link first
        li.appendChild(link);
        
        // Add dropdown indicator if has children
        if (item.children && item.children.length > 0) {
            li.classList.add('has-dropdown');
            // Use dropdownIndex for mega menu mapping (1st dropdown = 1, 2nd dropdown = 2, etc.)
            li.setAttribute('data-mega-menu-id', dropdownIndex);
            
            // Create dropdown menu
            const dropdown = document.createElement('div');
            dropdown.className = 'sigma-dropdown-menu';
            
            item.children.forEach(child => {
                const childLink = document.createElement('a');
                childLink.href = child.url;
                childLink.className = 'sigma-dropdown-item';
                childLink.textContent = child.name;
                dropdown.appendChild(childLink);
            });
            
            // Add dropdown after the link
            li.appendChild(dropdown);
        }
        return li;
    }

    /**
     * Create a mobile navigation item
     */
    function createMobileNavItem(item) {
        const li = document.createElement('li');
        li.className = 'sigma-mobile-nav-item';
        
        const link = document.createElement('a');
        link.href = item.url;
        link.className = 'sigma-mobile-nav-link';
        link.textContent = item.name;
        
        li.appendChild(link);
        
        // Add children as separate items
        if (item.children && item.children.length > 0) {
            const childrenContainer = document.createElement('ul');
            childrenContainer.className = 'sigma-mobile-nav-children';
            
            item.children.forEach(child => {
                const childItem = createMobileNavItem(child);
                childItem.style.paddingLeft = '2rem';
                childrenContainer.appendChild(childItem);
            });
            
            li.appendChild(childrenContainer);
        }
        
        return li;
    }

    /**
     * Initialize dropdown functionality
     */
    function initializeDropdowns() {
        const dropdownItems = fragmentElement.querySelectorAll('.sigma-nav-item.has-dropdown');
        
        dropdownItems.forEach(item => {
            const link = item.querySelector('.sigma-nav-link');
            const dropdown = item.querySelector('.sigma-dropdown-menu');
            
            if (!link || !dropdown) return;
            
            // Hover events
            item.addEventListener('mouseenter', () => {
                // Close other dropdowns, but not this one
                const otherItems = fragmentElement.querySelectorAll('.sigma-nav-item.has-dropdown.show');
                otherItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('show');
                        const otherDropdown = otherItem.querySelector('.sigma-dropdown-menu');
                        if (otherDropdown) {
                            otherDropdown.classList.remove('show');
                        }
                    }
                });
                
                // Show this dropdown
                item.classList.add('show');
                dropdown.classList.add('show');
            });
            
            item.addEventListener('mouseleave', () => {
                item.classList.remove('show');
                dropdown.classList.remove('show');
            });
            
            // Click events for all devices
            link.addEventListener('click', (e) => {
                e.preventDefault();
                toggleDropdown(item);
            });
        });
        
        // Close dropdowns when clicking outside (idempotent)
        if (!fragmentElement._hasOutsideClickHandler) {
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.sigma-nav-item.has-dropdown')) {
                    closeAllDropdowns();
                }
            });
            fragmentElement._hasOutsideClickHandler = true;
        }
    }

    /**
     * Toggle dropdown visibility
     */
    function toggleDropdown(item) {
        const dropdown = item.querySelector('.sigma-dropdown-menu');
        const isOpen = item.classList.contains('show');
        
        closeAllDropdowns();
        
        if (!isOpen) {
            item.classList.add('show');
            dropdown.classList.add('show');
        }
    }

    /**
     * Close all open dropdowns
     */
    function closeAllDropdowns() {
        const openItems = fragmentElement.querySelectorAll('.sigma-nav-item.has-dropdown.show');
        openItems.forEach(item => {
            item.classList.remove('show');
            const dropdown = item.querySelector('.sigma-dropdown-menu');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        });
    }

    /**
     * Initialize mobile menu
     */
    function initializeMobileMenu() {
        const mobileToggle = fragmentElement.querySelector('.sigma-mobile-menu-toggle');
        const mobileNav = fragmentElement.querySelector('.sigma-mobile-nav');
        
        if (!mobileToggle || !mobileNav) return;
        
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('show');
            
            if (isOpen) {
                mobileNav.classList.remove('show');
                mobileToggle.setAttribute('aria-expanded', 'false');
            } else {
                mobileNav.classList.add('show');
                mobileToggle.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.sigma-mobile-menu-toggle') && !e.target.closest('.sigma-mobile-nav')) {
                mobileNav.classList.remove('show');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /**
     * Initialize modals
     */
    function initializeModals() {
        initializeSearchModal();
        initializeLoginModal();
    }

    /**
     * Initialize search modal
     */
    function initializeSearchModal() {
        const searchBtn = fragmentElement.querySelector('.sigma-search-btn');
        const searchOverlay = document.querySelector('#sigma-search-overlay');
        const closeSearchBtn = document.querySelector('#sigma-close-search');
        
        if (!searchBtn || !searchOverlay) return;
        
        searchBtn.addEventListener('click', () => {
            searchOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        if (closeSearchBtn) {
            closeSearchBtn.addEventListener('click', () => {
                searchOverlay.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        // Close on overlay click
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.style.display === 'flex') {
                searchOverlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Initialize login modal
     */
    function initializeLoginModal() {
        const loginBtn = fragmentElement.querySelector('.sigma-login-btn');
        const mobileLoginBtn = fragmentElement.querySelector('.sigma-mobile-login-btn');
        const loginOverlay = document.querySelector('#sigma-login-overlay');
        const closeLoginBtn = document.querySelector('#sigma-close-login');
        
        if (!loginOverlay) return;
        
        function openLoginModal() {
            loginOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
        
        function closeLoginModal() {
            loginOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        if (loginBtn) {
            loginBtn.addEventListener('click', openLoginModal);
        }
        
        if (mobileLoginBtn) {
            mobileLoginBtn.addEventListener('click', openLoginModal);
        }
        
        if (closeLoginBtn) {
            closeLoginBtn.addEventListener('click', closeLoginModal);
        }
        
        // Close on overlay click
        loginOverlay.addEventListener('click', (e) => {
            if (e.target === loginOverlay) {
                closeLoginModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && loginOverlay.style.display === 'flex') {
                closeLoginModal();
            }
        });
    }

    /**
     * Initialize logo home link
     */
    function initializeLogoLink() {
        const logoLink = fragmentElement.querySelector('.sigma-logo-link');
        const config = getFragmentConfiguration();
        
        if (logoLink && config.sitePrefix) {
            logoLink.href = config.sitePrefix + '/';
        }
    }

    /**
     * Initialize mega menu content for edit mode
     */
    function initializeMegaMenuContent() {
        // Copy content from mega menu dropzones into the actual dropdown menus
        const megaDropzones = fragmentElement.querySelectorAll('.sigma-mega-dropzone');
        
        megaDropzones.forEach((dropzone, index) => {
            // Use data attribute if available, fallback to index
            let menuId = dropzone.getAttribute('data-mega-key');
            if (!menuId) {
                // Fallback: extract from label or use index
                const label = dropzone.querySelector('.sigma-mega-dropzone-label');
                if (label) {
                    const labelText = label.textContent.trim();
                    const menuIdMatch = labelText.match(/Mega Menu (\d+)/);
                    menuId = menuIdMatch ? menuIdMatch[1] : (index + 1).toString();
                } else {
                    menuId = (index + 1).toString();
                }
            }
            
            copyDropzoneContentToMenu(menuId, dropzone);
        });
    }

    /**
     * Setup mega menu observer for edit mode
     */
    function setupMegaMenuObserver() {
        // Clean up existing observers
        if (fragmentElement._megaMenuObservers) {
            fragmentElement._megaMenuObservers.forEach(observer => observer.disconnect());
        }
        fragmentElement._megaMenuObservers = [];
        
        // Set up mutation observer to watch for changes in mega menu dropzones
        const megaDropzones = fragmentElement.querySelectorAll('.sigma-mega-dropzone lfr-drop-zone');
        
        megaDropzones.forEach(dropzone => {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        // Content in dropzone changed, update the corresponding dropdown
                        const megaDropzone = mutation.target.closest('.sigma-mega-dropzone');
                        if (megaDropzone) {
                            // Use data attribute if available, fallback to label parsing
                            let menuId = megaDropzone.getAttribute('data-mega-key');
                            if (!menuId) {
                                const label = megaDropzone.querySelector('.sigma-mega-dropzone-label');
                                if (label) {
                                    const labelText = label.textContent.trim();
                                    const menuIdMatch = labelText.match(/Mega Menu (\d+)/);
                                    menuId = menuIdMatch ? menuIdMatch[1] : null;
                                }
                            }
                            
                            if (menuId) {
                                copyDropzoneContentToMenu(menuId, megaDropzone);
                            }
                        }
                    }
                });
            });
            
            observer.observe(dropzone, {
                childList: true,
                subtree: true
            });
            
            // Store observer for cleanup
            fragmentElement._megaMenuObservers.push(observer);
        });
    }

    /**
     * Copy content from mega menu dropzone to the corresponding dropdown menu
     */
    function copyDropzoneContentToMenu(menuId, dropzone) {
        // Find the navigation item with the matching mega menu ID
        const navItem = fragmentElement.querySelector(`[data-mega-menu-id="${menuId}"]`);
        if (!navItem) return;
        
        // Get the dropdown menu within this nav item
        let dropdown = navItem.querySelector('.sigma-dropdown-menu');
        if (!dropdown) return;
        
        // Get content from the dropzone
        const dropzoneContent = dropzone.querySelector('lfr-drop-zone');
        if (!dropzoneContent) return;
        
        // Clear existing mega menu content (but keep original navigation children)
        const existingMegaContent = dropdown.querySelector('.sigma-mega-menu-content');
        if (existingMegaContent) {
            existingMegaContent.remove();
        }
        
        // Count actual content children (exclude placeholders and empty elements)
        const contentChildren = Array.from(dropzoneContent.children).filter(child => {
            // Skip empty elements and Liferay placeholder content
            if (child.textContent.trim().length === 0) return false;
            
            // Skip if it's just placeholder text like "Drop content here"
            if (child.textContent.trim().includes('Drop content here')) return false;
            
            // Include portlets that have actual content
            if (child.classList.contains('portlet-boundary')) {
                const portletContent = child.querySelector('.portlet-content');
                return portletContent && portletContent.textContent.trim().length > 0;
            }
            
            // Include fragments and other elements with content
            return true;
        });
        
        // Only add mega content if dropzone has actual content
        if (contentChildren.length > 0) {
            // Create container for mega menu content
            const megaContentContainer = document.createElement('div');
            megaContentContainer.className = 'sigma-mega-menu-content';
            
            // Clone the dropzone content (ensure deep clone)
            contentChildren.forEach(child => {
                const clonedChild = child.cloneNode(true);
                megaContentContainer.appendChild(clonedChild);
            });
            
            // Add mega content to the dropdown
            dropdown.appendChild(megaContentContainer);
            
            // Add mega menu class to the dropdown for styling
            dropdown.classList.add('has-mega-content');
        } else {
            // Remove mega menu class if no content
            dropdown.classList.remove('has-mega-content');
        }
    }
    
})();