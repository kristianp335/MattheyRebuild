/* Johnson Matthey Header Fragment JavaScript */
(function() {
    'use strict';
    
    let fragmentElement = document.currentScript ? document.currentScript.closest('.jm-header-fragment') : null;
    if (!fragmentElement) {
        // Fallback for when currentScript is not available
        const headerFragments = document.querySelectorAll('.jm-header-fragment');
        if (headerFragments.length === 0) return;
        fragmentElement = headerFragments[headerFragments.length - 1]; // Use the last one as fallback
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
    
    // Listen for Liferay SPA navigation events
    if (window.Liferay) {
        // Listen for all portlets ready (SennaJS navigation complete)
        Liferay.on('allPortletsReady', function(event) {
            console.log('SPA navigation complete - reinitializing header');
            setTimeout(initializeHeader, 100);
        });
        
        // Listen for page editor events
        Liferay.on('pageEditorModeChanged', function(event) {
            console.log('Page editor mode changed:', event);
            setTimeout(initializeHeader, 100);
        });
    }
    
    // Listen for standard navigation events
    document.addEventListener('navigate', function(event) {
        setTimeout(initializeHeader, 100);
    });
    
    // Listen for hash changes
    window.addEventListener('hashchange', function(event) {
        console.log('Hash changed, reinitializing header');
        setTimeout(initializeHeader, 200);
    });
    
    // Listen for body class changes (edit mode detection)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && 
                mutation.target === document.body && 
                mutation.attributeName === 'class') {
                console.log('Body class changed, reinitializing header');
                setTimeout(initializeHeader, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    function initializeHeader() {
        console.log('Johnson Matthey Header Fragment initializing...');
        
        // Get configuration values
        const config = getFragmentConfiguration();
        
        // Check if we're in edit mode - more specific detection
        const editMode = isInEditMode();
        
        if (editMode) {
            console.log('Edit mode detected - using simplified initialization');
            // Apply configuration settings even in edit mode
            applyConfiguration(config);
            // Simplified initialization for edit mode
            const sampleNav = getSampleNavigation();
            renderNavigation(sampleNav);
            // Initialize mobile menu and modals for edit mode
            initializeMobileMenu();
            initializeModals();
            // Add edit mode classes to modals for visual indication
            initializeEditModeDisplay();
            console.log('Johnson Matthey Header Fragment initialized for edit mode');
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
        
        // Initialize dropdowns
        setTimeout(initializeDropdowns, 100);
        
        console.log('Johnson Matthey Header Fragment initialized with config:', config);
    }
    
    function isInEditMode() {
        // Very strict edit mode detection - only show modals when actually editing
        const body = document.body;
        
        // Check for specific Liferay edit mode indicators
        const hasEditModeMenu = body.classList.contains('has-edit-mode-menu');
        const isEditMode = body.classList.contains('is-edit-mode');
        const hasControlMenu = document.querySelector('.control-menu');
        const hasPageEditor = document.querySelector('.page-editor__sidebar, .page-editor-sidebar, [data-qa-id="pageEditor"]');
        const hasFragmentEntryProcessorEditable = document.querySelector('.fragment-entry-processor-editable');
        const hasEditableElements = document.querySelector('[contenteditable="true"], .lfr-editable-field');
        
        // Must have both control menu AND active page editor OR actively editable elements
        // This prevents false positives on live sites that might have control menu but no editing
        const inEditMode = (hasEditModeMenu || isEditMode) && (hasPageEditor || hasEditableElements);
        
        console.log('Edit mode check:', {
            hasEditModeMenu,
            isEditMode,
            hasControlMenu: !!hasControlMenu,
            hasPageEditor: !!hasPageEditor,
            hasFragmentEntryProcessorEditable: !!hasFragmentEntryProcessorEditable,
            hasEditableElements: !!hasEditableElements,
            inEditMode
        });
        
        return inEditMode;
    }
    
    function ensureModalsHidden() {
        // Ensure modals are hidden in live mode
        const searchOverlay = document.querySelector('#jm-search-overlay');
        const loginOverlay = document.querySelector('#jm-login-overlay');
        const languageDropzone = fragmentElement.querySelector('.jm-language-selector-dropzone');
        
        if (searchOverlay) {
            searchOverlay.classList.remove('jm-edit-mode');
            searchOverlay.style.display = 'none';
        }
        
        if (loginOverlay) {
            loginOverlay.classList.remove('jm-edit-mode');
            loginOverlay.style.display = 'none';
        }
        
        if (languageDropzone) {
            languageDropzone.classList.remove('jm-edit-mode');
        }
    }
    
    function initializeNavigation() {
        loadNavigationMenu();
    }
    
    /**
     * Get fragment configuration values
     */
    function getFragmentConfiguration() {
        // Try to get configuration from Liferay's fragment configuration system
        if (typeof configuration !== 'undefined') {
            return {
                showSearch: configuration.showSearch !== undefined ? configuration.showSearch : true,
                showUserMenu: configuration.showUserMenu !== undefined ? configuration.showUserMenu : true,
                stickyHeader: configuration.stickyHeader !== undefined ? configuration.stickyHeader : true,

                navigationMenuId: configuration.navigationMenuId || 'primary-menu',
                headerStyle: configuration.headerStyle || 'white'
            };
        }
        
        // Fallback default values if configuration is not available
        return {
            showSearch: true,
            showUserMenu: true,
            stickyHeader: true,

            navigationMenuId: 'primary-menu',
            headerStyle: 'white'
        };
    }
    
    /**
     * Apply configuration settings to the header
     */
    function applyConfiguration(config) {
        const header = fragmentElement.querySelector('.jm-header');
        const searchBtn = fragmentElement.querySelector('.jm-search-btn');
        const userProfileWidget = fragmentElement.querySelector('.jm-user-profile-widget');
        const loginBtn = fragmentElement.querySelector('.jm-login-btn');

        
        // Apply sticky header setting
        if (config.stickyHeader) {
            header.classList.add('jm-sticky');
        } else {
            header.classList.remove('jm-sticky');
        }
        
        // Apply header style
        if (header) {
            header.setAttribute('data-style', config.headerStyle);
            console.log('Header style applied:', config.headerStyle, 'Element:', header);
        } else {
            console.warn('Header element not found for styling');
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
        

        
        console.log('Configuration applied:', config);
    }

    /**
     * Load navigation menu from Liferay API
     */
    function loadNavigationMenu() {
        const config = getFragmentConfiguration();
        const menuId = config.navigationMenuId;
        
        // Check if authentication token is available
        if (typeof Liferay === 'undefined' || !Liferay.authToken) {
            console.warn('Liferay authentication not available, loading fallback navigation');
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
                console.log('API Navigation Data:', data);
                console.log('Navigation Menu Items:', data.navigationMenuItems);
                if (data.navigationMenuItems && data.navigationMenuItems.length > 0) {
                    console.log('First nav item structure:', data.navigationMenuItems[0]);
                }
                
                renderNavigationFromAPI(data.navigationMenuItems || []);
            })
            .catch(error => {
                console.error('Error loading navigation menu:', error);
                loadFallbackNavigation();
            });
    }

    /**
     * Load fallback navigation when API is unavailable
     */
    function loadFallbackNavigation() {
        const fallbackNav = [
            {
                name: 'About',
                url: '/about',
                children: [
                    { name: 'Our History', url: '/about/history' },
                    { name: 'Leadership', url: '/about/leadership' },
                    { name: 'Locations', url: '/about/locations' }
                ]
            },
            {
                name: 'Markets',
                url: '/markets',
                children: [
                    { name: 'Automotive', url: '/markets/automotive' },
                    { name: 'Chemical Processing', url: '/markets/chemical-processing' },
                    { name: 'Oil & Gas', url: '/markets/oil-gas' }
                ]
            },
            {
                name: 'Products',
                url: '/products',
                children: [
                    { name: 'Catalysts', url: '/products/catalysts' },
                    { name: 'Precious Metals', url: '/products/precious-metals' },
                    { name: 'Chemicals', url: '/products/chemicals' }
                ]
            },
            {
                name: 'Innovation',
                url: '/innovation'
            },
            {
                name: 'Sustainability',
                url: '/sustainability'
            },
            {
                name: 'Investors',
                url: '/investors'
            },
            {
                name: 'Careers',
                url: '/careers'
            },
            {
                name: 'News & Insights',
                url: '/news'
            }
        ];
        
        renderNavigationFromAPI(fallbackNav);
    }

    /**
     * Get the site base path from current URL
     */
    function getSiteBasePath() {
        try {
            const relativeURL = Liferay.ThemeDisplay.getRelativeURL();
            // Extract everything up to the last slash: /web/johnson-matthey/home -> /web/johnson-matthey/
            const lastSlashIndex = relativeURL.lastIndexOf('/');
            return relativeURL.substring(0, lastSlashIndex + 1);
        } catch (error) {
            console.warn('Could not get site base path from ThemeDisplay, using fallback');
            return '/web/guest/'; // Fallback for guest site
        }
    }

    /**
     * Build complete page URL with site context
     */
    function buildPageURL(pagePath) {
        if (!pagePath || pagePath === '#') return '#';
        
        // If it's already a complete URL, return as-is
        if (pagePath.startsWith('/web/') || pagePath.startsWith('http')) {
            return pagePath;
        }
        
        // Remove leading slash if present, we'll add it with site base path
        const cleanPath = pagePath.startsWith('/') ? pagePath.substring(1) : pagePath;
        const siteBasePath = getSiteBasePath();
        
        return `${siteBasePath}${cleanPath}`;
    }

    /**
     * Render navigation menu in both desktop and mobile containers using API data
     */
    function renderNavigationFromAPI(menuItems) {
        const desktopNav = fragmentElement.querySelector('#jm-main-nav');
        const mobileNav = fragmentElement.querySelector('.jm-mobile-nav-list');
        
        if (!desktopNav || !mobileNav) {
            console.error('Navigation containers not found');
            console.log('Available elements in fragment:', fragmentElement.querySelectorAll('*'));
            console.log('Looking for:', '#jm-main-nav', '.jm-mobile-nav-list');
            console.log('Fragment element:', fragmentElement);
            return;
        }
        
        // Clear existing content
        desktopNav.innerHTML = '';
        mobileNav.innerHTML = '';
        
        // Render desktop navigation
        menuItems.forEach(item => {
            const navItem = createNavItemFromAPI(item, false);
            desktopNav.appendChild(navItem);
        });
        
        // Render mobile navigation
        menuItems.forEach(item => {
            const mobileItem = createNavItemFromAPI(item, true);
            mobileNav.appendChild(mobileItem);
        });
        
        // Initialize dropdowns after rendering
        setTimeout(() => {
            initializeDropdowns();
        }, 100);
    }

    /**
     * Create navigation item element from API data
     */
    function createNavItemFromAPI(item, isMobile) {
        // Check for navigationMenuItems (API response) or children (fallback)
        const hasChildren = (item.navigationMenuItems && item.navigationMenuItems.length > 0) || 
                          (item.children && item.children.length > 0);
        const children = item.navigationMenuItems || item.children || [];
        
        const listItem = document.createElement('li');
        listItem.className = isMobile ? 'jm-mobile-nav-item' : 'jm-nav-item';
        
        if (hasChildren && !isMobile) {
            listItem.classList.add('jm-has-dropdown');
        }
        
        // Create main link
        const link = document.createElement('a');
        const originalUrl = item.link || item.url || '#';
        const builtUrl = buildPageURL(originalUrl);
        
        console.log(`Navigation item "${item.name || item.title}": ${originalUrl} -> ${builtUrl}`);
        
        link.href = builtUrl;
        link.textContent = item.name || item.title;
        link.className = isMobile ? 'jm-mobile-nav-link' : 'jm-nav-link';
        
        if (item.external) {
            link.target = '_blank';
            link.rel = 'noopener';
        }
        
        listItem.appendChild(link);
        
        // Add dropdown menu for desktop or submenu for mobile
        if (hasChildren) {
            const dropdown = document.createElement(isMobile ? 'div' : 'ul');
            dropdown.className = isMobile ? 'jm-mobile-dropdown' : 'jm-dropdown-menu';
            
            children.forEach(child => {
                if (isMobile) {
                    const childLink = document.createElement('a');
                    childLink.href = buildPageURL(child.link || child.url || '#');
                    childLink.textContent = child.name || child.title;
                    childLink.className = 'jm-mobile-dropdown-item';
                    
                    if (child.external) {
                        childLink.target = '_blank';
                        childLink.rel = 'noopener';
                    }
                    
                    dropdown.appendChild(childLink);
                } else {
                    const childItem = document.createElement('li');
                    const childLink = document.createElement('a');
                    childLink.href = buildPageURL(child.link || child.url || '#');
                    childLink.textContent = child.name || child.title;
                    childLink.className = 'jm-dropdown-item';
                    
                    if (child.external) {
                        childLink.target = '_blank';
                        childLink.rel = 'noopener';
                    }
                    
                    childItem.appendChild(childLink);
                    dropdown.appendChild(childItem);
                }
            });
            
            listItem.appendChild(dropdown);
        }
        
        return listItem;
    }

    /**
     * Initialize logo home link with proper site URL
     */
    function initializeLogoLink() {
        const logoLink = fragmentElement.querySelector('#jm-logo-home-link');
        if (logoLink) {
            logoLink.href = buildPageURL('/home');
        }
    }
    
    function getSampleNavigation() {
        return [
            {
                name: 'About Us',
                url: '/about-us',
                navigationMenuItems: [
                    { name: 'Our Purpose', url: '/about-us/purpose' },
                    { name: 'History', url: '/about-us/history' },
                    { name: 'Leadership', url: '/about-us/leadership' },
                    { name: 'Locations', url: '/about-us/locations' }
                ]
            },
            {
                name: 'Our Business',
                url: '/business',
                navigationMenuItems: [
                    { name: 'Catalyst Technologies', url: '/business/catalyst' },
                    { name: 'Precious Metal Services', url: '/business/precious-metals' },
                    { name: 'Hydrogen Technologies', url: '/business/hydrogen' }
                ]
            },
            {
                name: 'Sustainability',
                url: '/sustainability',
                navigationMenuItems: [
                    { name: 'Net Zero Transition', url: '/sustainability/net-zero' },
                    { name: 'Circular Economy', url: '/sustainability/circular-economy' },
                    { name: 'ESG Report', url: '/sustainability/esg-report' }
                ]
            },
            {
                name: 'Investors',
                url: '/investors',
                navigationMenuItems: [
                    { name: 'Financial Results', url: '/investors/results' },
                    { name: 'Share Price', url: '/investors/share-price' },
                    { name: 'Annual Reports', url: '/investors/reports' },
                    { name: 'Presentations', url: '/investors/presentations' }
                ]
            },
            {
                name: 'Media',
                url: '/media',
                navigationMenuItems: [
                    { name: 'News & Press', url: '/media/news' },
                    { name: 'PGM Market Report', url: '/media/pgm-report' },
                    { name: 'Events', url: '/media/events' }
                ]
            },
            {
                name: 'Careers',
                url: '/careers'
            }
        ];
        
        return navigationItems;
    }
    
    function renderNavigation(items) {
        const mainNav = fragmentElement.querySelector('#jm-main-nav');
        const mobileNav = fragmentElement.querySelector('.jm-mobile-nav-list');
        
        if (!mainNav || !mobileNav) return;
        
        // Clear existing navigation
        mainNav.innerHTML = '';
        mobileNav.innerHTML = '';
        
        items.forEach(item => {
            // Create main navigation item
            const navItem = createNavItem(item, false);
            mainNav.appendChild(navItem);
            
            // Create mobile navigation item
            const mobileNavItem = createNavItem(item, true);
            mobileNav.appendChild(mobileNavItem);
        });
    }
    
    function createNavItem(item, isMobile) {
        const li = document.createElement('li');
        li.className = isMobile ? 'jm-mobile-nav-item' : 'jm-nav-item';
        
        const hasChildren = item.navigationMenuItems && item.navigationMenuItems.length > 0;
        if (hasChildren) {
            li.classList.add('has-dropdown');
        }
        
        const link = document.createElement('a');
        link.href = item.link || item.url || '#';
        link.textContent = item.name || item.title;
        link.className = isMobile ? 'jm-mobile-nav-link' : 'jm-nav-link';
        
        if (hasChildren && !isMobile) {
            link.setAttribute('aria-expanded', 'false');
            link.setAttribute('aria-haspopup', 'true');
            
            // Add dropdown arrow
            const arrow = document.createElement('span');
            arrow.className = 'jm-nav-arrow';
            arrow.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg>';
            link.appendChild(arrow);
        }
        
        li.appendChild(link);
        
        // Create dropdown menu if has children
        if (hasChildren) {
            const dropdown = document.createElement('ul');
            dropdown.className = isMobile ? 'jm-mobile-dropdown-menu' : 'jm-dropdown-menu';
            
            item.navigationMenuItems.forEach(childItem => {
                const childLi = document.createElement('li');
                const childLink = document.createElement('a');
                childLink.href = childItem.link || childItem.url || '#';
                childLink.textContent = childItem.name || childItem.title;
                childLink.className = isMobile ? 'jm-mobile-dropdown-item' : 'jm-dropdown-item';
                
                childLi.appendChild(childLink);
                dropdown.appendChild(childLi);
            });
            
            li.appendChild(dropdown);
        }
        
        return li;
    }
    
    function initializeDropdowns() {
        const dropdownTriggers = fragmentElement.querySelectorAll('.jm-nav-item.has-dropdown > .jm-nav-link');
        
        console.log(`Found ${dropdownTriggers.length} dropdown triggers`);
        
        dropdownTriggers.forEach(trigger => {
            const parentItem = trigger.parentElement;
            const dropdownMenu = parentItem.querySelector('.jm-dropdown-menu');
            
            if (!dropdownMenu) return;
            
            // Hover events
            parentItem.addEventListener('mouseenter', () => {
                showDropdown(trigger, dropdownMenu);
            });
            
            parentItem.addEventListener('mouseleave', () => {
                hideDropdown(trigger, dropdownMenu);
            });
            
            // Click events
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                toggleDropdown(trigger, dropdownMenu);
            });
            
            // Keyboard events
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown(trigger, dropdownMenu);
                } else if (e.key === 'Escape') {
                    hideDropdown(trigger, dropdownMenu);
                    trigger.focus();
                }
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.jm-header-fragment')) return;
            
            if (!e.target.closest('.jm-nav-item.has-dropdown')) {
                fragmentElement.querySelectorAll('.jm-dropdown-menu.show').forEach(menu => {
                    const trigger = menu.parentElement.querySelector('.jm-nav-link');
                    hideDropdown(trigger, menu);
                });
            }
        });
    }
    
    function showDropdown(trigger, menu) {
        // Close other dropdowns first
        fragmentElement.querySelectorAll('.jm-dropdown-menu.show').forEach(otherMenu => {
            if (otherMenu !== menu) {
                const otherTrigger = otherMenu.parentElement.querySelector('.jm-nav-link');
                hideDropdown(otherTrigger, otherMenu);
            }
        });
        
        menu.classList.add('show');
        trigger.setAttribute('aria-expanded', 'true');
        trigger.parentElement.classList.add('active');
    }
    
    function hideDropdown(trigger, menu) {
        menu.classList.remove('show');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.parentElement.classList.remove('active');
    }
    
    function toggleDropdown(trigger, menu) {
        if (menu.classList.contains('show')) {
            hideDropdown(trigger, menu);
        } else {
            showDropdown(trigger, menu);
        }
    }
    
    function initializeMobileMenu() {
        const mobileToggle = fragmentElement.querySelector('.jm-mobile-menu-toggle');
        const mobileNav = fragmentElement.querySelector('.jm-mobile-nav');
        
        if (!mobileToggle || !mobileNav) return;
        
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('show');
            
            if (isOpen) {
                mobileNav.classList.remove('show');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            } else {
                mobileNav.classList.add('show');
                mobileToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Mobile dropdown functionality
        const mobileDropdownTriggers = fragmentElement.querySelectorAll('.jm-mobile-nav-item.has-dropdown > .jm-mobile-nav-link');
        
        mobileDropdownTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const parentItem = trigger.parentElement;
                const dropdownMenu = parentItem.querySelector('.jm-mobile-dropdown-menu');
                
                if (dropdownMenu) {
                    parentItem.classList.toggle('active');
                    dropdownMenu.style.display = parentItem.classList.contains('active') ? 'block' : 'none';
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.jm-header-fragment') && mobileNav.classList.contains('show')) {
                mobileNav.classList.remove('show');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
    
    function initializeModals() {
        initializeSearchModal();
        initializeLoginModal();
    }
    
    function initializeSearchModal() {
        const searchBtn = fragmentElement.querySelector('.jm-search-btn');
        const searchOverlay = document.querySelector('#jm-search-overlay');
        const closeSearch = document.querySelector('#jm-close-search');
        
        if (!searchBtn || !searchOverlay) {
            console.log('Search elements not found');
            return;
        }
        
        // Open search modal
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openSearchModal();
        });
        
        // Close search modal
        if (closeSearch) {
            closeSearch.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeSearchModal();
            });
        }
        
        // Close on overlay click
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                closeSearchModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.style.display !== 'none') {
                closeSearchModal();
            }
        });
    }
    
    function initializeLoginModal() {
        const loginBtn = fragmentElement.querySelector('.jm-login-btn');
        const mobileLoginBtn = fragmentElement.querySelector('.jm-mobile-login-btn');
        const loginOverlay = document.querySelector('#jm-login-overlay');
        const closeLogin = document.querySelector('#jm-close-login');
        
        if (!loginOverlay) {
            console.log('Login overlay not found');
            return;
        }
        
        // Open login modal
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openLoginModal();
            });
        }
        
        if (mobileLoginBtn) {
            mobileLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close mobile menu first
                const mobileNav = fragmentElement.querySelector('.jm-mobile-nav');
                const mobileToggle = fragmentElement.querySelector('.jm-mobile-menu-toggle');
                if (mobileNav) {
                    mobileNav.classList.remove('show');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
                
                openLoginModal();
            });
        }
        
        // Close login modal
        if (closeLogin) {
            closeLogin.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeLoginModal();
            });
        }
        
        // Close on overlay click
        loginOverlay.addEventListener('click', function(e) {
            if (e.target === loginOverlay) {
                closeLoginModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && loginOverlay.style.display !== 'none') {
                closeLoginModal();
            }
        });
    }
    
    function openSearchModal() {
        const searchOverlay = document.querySelector('#jm-search-overlay');
        if (searchOverlay) {
            searchOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeSearchModal() {
        const searchOverlay = document.querySelector('#jm-search-overlay');
        if (searchOverlay) {
            searchOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    function openLoginModal() {
        const loginOverlay = document.querySelector('#jm-login-overlay');
        if (loginOverlay) {
            loginOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeLoginModal() {
        const loginOverlay = document.querySelector('#jm-login-overlay');
        if (loginOverlay) {
            loginOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    function initializeEditModeDisplay() {
        // Add edit mode classes to modals for visual indication ONLY in actual edit mode
        // Use even stricter detection to prevent false positives
        const hasActivePageEditor = document.querySelector('.page-editor__sidebar, .page-editor-sidebar, [data-qa-id="pageEditor"]');
        const hasEditableElements = document.querySelector('[contenteditable="true"], .lfr-editable-field');
        const isActuallyEditing = hasActivePageEditor || hasEditableElements;
        
        if (!isInEditMode() || !isActuallyEditing) {
            console.log('Not in active edit mode - skipping edit mode display');
            return;
        }
        
        const searchOverlay = document.querySelector('#jm-search-overlay');
        const loginOverlay = document.querySelector('#jm-login-overlay');
        const languageDropzone = fragmentElement.querySelector('.jm-language-selector-dropzone');
        
        if (searchOverlay) {
            searchOverlay.classList.add('jm-edit-mode');
        }
        
        if (loginOverlay) {
            loginOverlay.classList.add('jm-edit-mode');
        }
        
        if (languageDropzone) {
            languageDropzone.classList.add('jm-edit-mode');
        }
        
        console.log('Edit mode display initialized - modals and dropzones visible for configuration');
    }
    
})();
