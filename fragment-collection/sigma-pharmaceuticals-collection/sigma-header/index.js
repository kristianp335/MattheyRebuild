/* Sigma Pharmaceuticals Header Fragment JavaScript */
(function() {
    'use strict';
    
    try {
        // Defensive fragment element detection with multiple fallbacks
        let root;
        try {
            root = (typeof fragmentElement !== 'undefined' && fragmentElement) || null;
        } catch (e) {
            console.log('🎯 SIGMA HEADER: Fragment element access error, trying fallbacks:', e.message);
            root = null;
        }
        
        // Fallback 1: Try document.currentScript approach
        if (!root && document.currentScript) {
            root = document.currentScript.closest('.lfr-fragment-entry-link');
            console.log('🎯 SIGMA HEADER: Trying document.currentScript fallback:', !!root);
        }
        
        // Fallback 2: Look for sigma header fragments in DOM
        if (!root) {
            const sigmaHeaders = document.querySelectorAll('[data-fragment-entry-key*="sigma-header"]');
            if (sigmaHeaders.length > 0) {
                root = sigmaHeaders[0];
                console.log('🎯 SIGMA HEADER: Found via data-fragment-entry-key:', !!root);
            }
        }
        
        // Fallback 3: Look for elements containing sigma header classes
        if (!root) {
            const headerElements = document.querySelectorAll('.sigma-header-container, .sigma-header');
            if (headerElements.length > 0) {
                root = headerElements[0].closest('.lfr-fragment-entry-link') || headerElements[0];
                console.log('🎯 SIGMA HEADER: Found via sigma header classes:', !!root);
            }
        }
        
        // Fallback 4: Look for any fragment entry link containing header elements
        if (!root) {
            const allFragments = document.querySelectorAll('.lfr-fragment-entry-link');
            for (const fragment of allFragments) {
                if (fragment.querySelector('.sigma-nav, .sigma-logo, .sigma-header-container')) {
                    root = fragment;
                    console.log('🎯 SIGMA HEADER: Found via header element search:', !!root);
                    break;
                }
            }
        }
        
        console.log('🎯 SIGMA HEADER: Fragment element check:', {
            fragmentElement: root,
            fragmentElementExists: !!root,
            fragmentElementId: root ? root.id : 'N/A',
            fragmentElementClass: root ? root.className : 'N/A'
        });
        
        if (!root) {
            console.warn('🎯 SIGMA HEADER: no root/fragmentElement found - exiting');
            return;
        }
        
        // Use root as our fragment element throughout
        const fragmentElement = root;
    
    // Initialize on DOM ready and SPA navigation events
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }
    
    // Add idempotency to prevent duplicate initialization
    let isInitialized = false;
    
    function safeInitializeHeader() {
        if (isInitialized) return;
        initializeHeader();
        isInitialized = true;
        fragmentElement.setAttribute('data-sigma-initialized', 'true');
    }
    
    // Initial load
    ready(safeInitializeHeader);
    
    // Handle Liferay SPA navigation
    if (typeof Liferay !== 'undefined' && Liferay.on) {
        Liferay.on('endNavigate', function() {
            // Reset initialization flag for SPA navigation
            isInitialized = false;
            setTimeout(safeInitializeHeader, 100);
        });
    }
    
    function initializeHeader() {
        console.log('🎯 SIGMA HEADER: Starting initialization', {
            fragmentElement: fragmentElement,
            fragmentElementClass: fragmentElement ? fragmentElement.className : 'NOT FOUND',
            documentReadyState: document.readyState
        });
        
        // Get configuration values
        const config = getFragmentConfiguration();
        console.log('🎯 SIGMA HEADER: Configuration loaded', config);
        
        // Check if we're in edit mode - more specific detection
        const editMode = isInEditMode();
        console.log('🎯 SIGMA HEADER: Edit mode detection result:', editMode);
        
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
        // Enhanced edit mode detection - check for multiple indicators
        const body = document.body;
        
        // Check for specific Liferay edit mode indicators
        const hasEditModeMenu = body.classList.contains('has-edit-mode-menu');
        const isEditMode = body.classList.contains('is-edit-mode');
        const hasControlMenu = document.querySelector('.control-menu');
        const hasPageEditor = document.querySelector('.page-editor__sidebar, .page-editor-sidebar, [data-qa-id="pageEditor"]');
        const hasFragmentEntryProcessorEditable = document.querySelector('.fragment-entry-processor-editable');
        const hasEditableElements = document.querySelector('[contenteditable="true"], .lfr-editable-field');
        
        // Additional edit mode indicators
        const hasPageDesignMode = document.querySelector('[data-qa-id="pageDesign"], .page-design');
        const hasFragmentConfigPanel = document.querySelector('.fragment-configuration-panel, .sidebar-panel');
        const hasComponentsPanel = document.querySelector('.components-panel, .fragment-sidebar');
        const hasEditableFields = document.querySelector('.lfr-editable, .editable-field');
        const hasFragmentEntryLinks = document.querySelectorAll('.lfr-fragment-entry-link').length > 0;
        const hasLiferayEditorEnabled = document.querySelector('[data-editor-enabled="true"]') || 
                                       document.documentElement.getAttribute('data-editor-enabled') === 'true';
        
        // Check URL for edit mode indicators
        const urlContainsEdit = window.location.href.includes('/edit') || 
                               window.location.href.includes('p_l_mode=edit') ||
                               window.location.href.includes('pageDesign');
        
        console.log('🎯 SIGMA HEADER: Edit mode indicators:', {
            hasEditModeMenu,
            isEditMode,
            hasControlMenu: !!hasControlMenu,
            hasPageEditor: !!hasPageEditor,
            hasFragmentEntryProcessorEditable: !!hasFragmentEntryProcessorEditable,
            hasEditableElements: !!hasEditableElements,
            hasPageDesignMode: !!hasPageDesignMode,
            hasFragmentConfigPanel: !!hasFragmentConfigPanel,
            hasComponentsPanel: !!hasComponentsPanel,
            hasEditableFields: !!hasEditableFields,
            hasFragmentEntryLinks,
            hasLiferayEditorEnabled: !!hasLiferayEditorEnabled,
            urlContainsEdit,
            bodyClasses: body.className,
            currentURL: window.location.href
        });
        
        // More flexible edit mode detection
        const inEditMode = hasEditModeMenu || 
                          isEditMode || 
                          hasPageDesignMode ||
                          hasFragmentConfigPanel ||
                          hasComponentsPanel ||
                          hasLiferayEditorEnabled ||
                          urlContainsEdit ||
                          (hasFragmentEntryLinks && (hasEditableFields || hasEditableElements));
        
        console.log('🎯 SIGMA HEADER: Final edit mode result:', inEditMode);
        
        // Add/remove body class to help with mega menu dropzone visibility
        if (inEditMode) {
            body.classList.add('has-edit-mode-menu');
            fragmentElement.classList.add('sigma-edit-mode');
            console.log('🎯 SIGMA HEADER: Added edit mode classes to body and fragment');
        } else {
            body.classList.remove('has-edit-mode-menu');
            fragmentElement.classList.remove('sigma-edit-mode');
            console.log('🎯 SIGMA HEADER: Removed edit mode classes from body and fragment');
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
        
        // Render each navigation item
        navItems.forEach((item, index) => {
            const navItem = createNavItem(item, index);
            navList.appendChild(navItem);
            
            // Mobile navigation
            if (mobileNavList) {
                const mobileNavItem = createMobileNavItem(item);
                mobileNavList.appendChild(mobileNavItem);
            }
        });
        
        // Initialize dropdowns AFTER navigation is rendered
        initializeDropdowns();
    }

    /**
     * Create a navigation item
     */
    function createNavItem(item, index) {
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
            li.setAttribute('data-mega-menu-id', index + 1);
            
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
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.sigma-nav-item.has-dropdown')) {
                closeAllDropdowns();
            }
        });
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
        console.log('🎯 SIGMA HEADER: Initializing mega menu content');
        
        const editModeStatus = isInEditMode();
        console.log('🎯 SIGMA HEADER: Current edit mode status:', editModeStatus);
        
        // Show mega menu dropzones in edit mode
        if (editModeStatus) {
            const megaMenuContainer = fragmentElement.querySelector('.sigma-mega-menu-dropzones');
            console.log('🎯 SIGMA HEADER: Mega menu container found:', !!megaMenuContainer);
            
            if (megaMenuContainer) {
                megaMenuContainer.style.display = 'block';
                console.log('🎯 SIGMA HEADER: Set mega menu container display to block');
                
                // Check all dropzones
                const dropzones = megaMenuContainer.querySelectorAll('.sigma-mega-dropzone');
                console.log('🎯 SIGMA HEADER: Found dropzones:', dropzones.length);
                
                dropzones.forEach((zone, index) => {
                    console.log(`🎯 SIGMA HEADER: Dropzone ${index + 1}:`, {
                        id: zone.id || 'no-id',
                        menuItem: zone.getAttribute('data-menu-item'),
                        visible: zone.style.display !== 'none'
                    });
                });
            }
        } else {
            console.log('🎯 SIGMA HEADER: Not in edit mode, skipping dropzone display');
        }
        
        // Setup mega menu content mapping to dropdowns
        setupMegaMenuMapping();
    }

    /**
     * Setup mega menu observer for edit mode
     */
    function setupMegaMenuObserver() {
        console.log('🎯 SIGMA HEADER: Setting up mega menu observer');
        
        // Create mutation observer to watch for edit mode changes
        const observer = new MutationObserver((mutations) => {
            console.log('🎯 SIGMA HEADER: Mutation observed:', mutations.length, 'mutations');
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'class' || mutation.attributeName === 'data-editor-enabled')) {
                    console.log('🎯 SIGMA HEADER: Edit mode class/attribute changed, re-initializing mega menu');
                    initializeMegaMenuContent();
                }
            });
        });

        // Observe body and wrapper for edit mode class changes
        observer.observe(document.body, { 
            attributes: true, 
            attributeFilter: ['class', 'data-editor-enabled'] 
        });
        console.log('🎯 SIGMA HEADER: Observing body for edit mode changes');
        
        const wrapper = document.getElementById('wrapper');
        if (wrapper) {
            observer.observe(wrapper, { 
                attributes: true, 
                attributeFilter: ['class', 'data-editor-enabled'] 
            });
            console.log('🎯 SIGMA HEADER: Observing wrapper for edit mode changes');
        } else {
            console.log('🎯 SIGMA HEADER: No wrapper element found to observe');
        }
    }

    /**
     * Setup mapping between menu items and mega menu content
     */
    function setupMegaMenuMapping() {
        console.log('🎯 SIGMA HEADER: Setting up mega menu mapping');
        
        const dropdownItems = fragmentElement.querySelectorAll('.sigma-nav-item.has-dropdown');
        console.log('🎯 SIGMA HEADER: Found dropdown items:', dropdownItems.length);
        
        dropdownItems.forEach((item, index) => {
            const menuIndex = index + 1; // 1-based indexing
            const dropdown = item.querySelector('.sigma-dropdown-menu');
            const megaContentId = `dropzone-mega-menu-${menuIndex}`;
            const megaContent = fragmentElement.querySelector(`#${megaContentId}`);
            
            console.log(`🎯 SIGMA HEADER: Processing dropdown ${menuIndex}:`, {
                hasDropdown: !!dropdown,
                megaContentId,
                hasMegaContent: !!megaContent
            });
            
            if (dropdown && megaContent) {
                // Clone mega menu content to show in dropdown
                const megaContentClone = megaContent.cloneNode(true);
                megaContentClone.id = `${megaContentId}-dropdown`;
                megaContentClone.style.display = 'block';
                
                // Insert mega content at the top of dropdown
                dropdown.insertBefore(megaContentClone, dropdown.firstChild);
                
                // Add data attribute to link them
                item.setAttribute('data-mega-menu-id', menuIndex);
                
                console.log(`🎯 SIGMA HEADER: Successfully mapped mega menu ${menuIndex} to dropdown`);
                
                // Update dropdown hover/click handlers to show mega content
                setupMegaMenuEvents(item, megaContentClone);
            } else {
                console.log(`🎯 SIGMA HEADER: Skipping dropdown ${menuIndex} - missing dropdown or mega content`);
            }
        });
    }

    /**
     * Setup events for mega menu functionality
     */
    function setupMegaMenuEvents(navItem, megaContent) {
        const dropdown = navItem.querySelector('.sigma-dropdown-menu');
        
        if (!dropdown || !megaContent) return;
        
        // Show/hide mega content based on dropdown state
        navItem.addEventListener('mouseenter', () => {
            if (!isEditMode()) {
                megaContent.style.display = 'block';
            }
        });
        
        navItem.addEventListener('mouseleave', () => {
            if (!isEditMode()) {
                megaContent.style.display = 'none';
            }
        });
        
        // Handle click events
        const link = navItem.querySelector('.sigma-nav-link');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = navItem.classList.contains('show');
                
                closeAllDropdowns();
                
                if (!isOpen && !isEditMode()) {
                    navItem.classList.add('show');
                    dropdown.classList.add('show');
                    megaContent.style.display = 'block';
                }
            });
        }
    }

    /**
     * Check if we're in edit mode
     */
    function isEditMode() {
        const hasEditModeMenu = document.body.classList.contains('has-edit-mode-menu');
        const wrapperEditMode = document.querySelector('#wrapper.is-edit-mode');
        const editorEnabled = document.querySelector('[data-editor-enabled="true"]');
        const fragmentEditor = fragmentElement ? fragmentElement.closest('[data-editor-enabled="true"]') : null;
        
        const result = hasEditModeMenu || !!wrapperEditMode || !!editorEnabled || !!fragmentEditor;
        
        console.log('🎯 SIGMA HEADER: isEditMode check:', {
            hasEditModeMenu,
            wrapperEditMode: !!wrapperEditMode,
            editorEnabled: !!editorEnabled,
            fragmentEditor: !!fragmentEditor,
            result
        });
        
        return result;
    }
    
    } catch (e) {
        console.error('🎯 SIGMA HEADER fatal error:', e);
        return;
    }
})();