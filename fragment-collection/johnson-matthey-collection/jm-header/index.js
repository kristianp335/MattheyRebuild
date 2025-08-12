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
        
        // Check if we're in edit mode - more specific detection
        const editMode = isInEditMode();
        
        if (editMode) {
            console.log('Edit mode detected - using simplified initialization');
            // Simplified initialization for edit mode
            renderNavigation(getSampleNavigation());
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
        
        // Initialize navigation
        initializeNavigation();
        
        // Initialize mobile menu
        initializeMobileMenu();
        
        // Initialize modals
        initializeModals();
        
        // Initialize dropdowns
        setTimeout(initializeDropdowns, 100);
        
        console.log('Johnson Matthey Header Fragment initialized');
    }
    
    function isInEditMode() {
        // More specific edit mode detection
        const body = document.body;
        
        // Check for specific Liferay edit mode indicators
        const hasEditModeMenu = body.classList.contains('has-edit-mode-menu');
        const isEditMode = body.classList.contains('is-edit-mode');
        const hasControlMenu = document.querySelector('.control-menu');
        const hasPageEditor = document.querySelector('.page-editor');
        const hasFragmentEntryProcessorEditable = document.querySelector('.fragment-entry-processor-editable');
        
        // Only consider in edit mode if we have clear indicators
        const inEditMode = hasEditModeMenu || isEditMode || (hasControlMenu && (hasPageEditor || hasFragmentEntryProcessorEditable));
        
        console.log('Edit mode check:', {
            hasEditModeMenu,
            isEditMode,
            hasControlMenu: !!hasControlMenu,
            hasPageEditor: !!hasPageEditor,
            hasFragmentEntryProcessorEditable: !!hasFragmentEntryProcessorEditable,
            inEditMode
        });
        
        return inEditMode;
    }
    
    function ensureModalsHidden() {
        // Ensure modals are hidden in live mode
        const searchOverlay = document.querySelector('#jm-search-overlay');
        const loginOverlay = document.querySelector('#jm-login-overlay');
        
        if (searchOverlay) {
            searchOverlay.classList.remove('jm-edit-mode');
            searchOverlay.style.display = 'none';
        }
        
        if (loginOverlay) {
            loginOverlay.classList.remove('jm-edit-mode');
            loginOverlay.style.display = 'none';
        }
    }
    
    function initializeNavigation() {
        // Try to fetch navigation from Liferay Navigation API first
        if (window.Liferay && window.Liferay.authtoken) {
            fetchLiferayNavigation();
        } else {
            // Fallback to sample navigation structure
            renderNavigation(getSampleNavigation());
        }
    }
    
    function fetchLiferayNavigation() {
        // Attempt to get navigation from Liferay Headless Delivery API
        const authToken = window.Liferay.authtoken;
        const apiUrl = '/o/headless-delivery/v1.0/sites/${themeDisplay.getScopeGroupId()}/navigation-menus?nestedFields=navigationMenuItems';
        
        fetch(`${apiUrl}&p_auth=${authToken}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Navigation API not available');
                }
                return response.json();
            })
            .then(data => {
                if (data.items && data.items.length > 0) {
                    // Use the first navigation menu found
                    const navigationItems = data.items[0].navigationMenuItems || [];
                    renderNavigation(navigationItems);
                } else {
                    renderNavigation(getSampleNavigation());
                }
            })
            .catch(error => {
                console.log('Using fallback navigation structure');
                renderNavigation(getSampleNavigation());
            });
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
        
        renderNavigation(navigationItems);
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
            searchOverlay.style.display = 'block';
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
            loginOverlay.style.display = 'block';
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
        if (!isInEditMode()) {
            console.log('Not in edit mode - skipping edit mode display');
            return;
        }
        
        const searchOverlay = document.querySelector('#jm-search-overlay');
        const loginOverlay = document.querySelector('#jm-login-overlay');
        
        if (searchOverlay) {
            searchOverlay.classList.add('jm-edit-mode');
        }
        
        if (loginOverlay) {
            loginOverlay.classList.add('jm-edit-mode');
        }
        
        console.log('Edit mode display initialized - modals visible for configuration');
    }
    
})();
