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
    
    // Wait for DOM to be ready before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHeader);
    } else {
        initializeHeader();
    }
    
    function initializeHeader() {
        console.log('Johnson Matthey Header Fragment initializing...');
        
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
        // Search modal
        const searchBtn = fragmentElement.querySelector('.jm-search-btn');
        const searchModal = fragmentElement.querySelector('.jm-search-modal');
        const searchBackdrop = fragmentElement.querySelector('.jm-search-modal-backdrop');
        
        if (searchBtn && searchBackdrop) {
            searchBtn.addEventListener('click', () => {
                openModal(searchBackdrop);
            });
        }
        
        // Login modal
        const loginBtn = fragmentElement.querySelector('.jm-login-btn');
        const mobileLoginBtn = fragmentElement.querySelector('.jm-mobile-login-btn');
        const loginModal = fragmentElement.querySelector('.jm-login-modal');
        const loginBackdrop = fragmentElement.querySelector('.jm-login-modal-backdrop');
        
        if (loginBtn && loginBackdrop) {
            loginBtn.addEventListener('click', () => {
                openModal(loginBackdrop);
            });
        }
        
        if (mobileLoginBtn && loginBackdrop) {
            mobileLoginBtn.addEventListener('click', () => {
                // Close mobile menu first
                const mobileNav = fragmentElement.querySelector('.jm-mobile-nav');
                const mobileToggle = fragmentElement.querySelector('.jm-mobile-menu-toggle');
                if (mobileNav) {
                    mobileNav.classList.remove('show');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                }
                
                openModal(loginBackdrop);
            });
        }
        
        // Modal close functionality
        const modalCloseButtons = fragmentElement.querySelectorAll('.jm-modal-close');
        const modalBackdrops = fragmentElement.querySelectorAll('.jm-modal-backdrop');
        
        modalCloseButtons.forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const modal = closeBtn.closest('.jm-modal-backdrop');
                if (modal) {
                    closeModal(modal);
                }
            });
        });
        
        modalBackdrops.forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    closeModal(backdrop);
                }
            });
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = fragmentElement.querySelector('.jm-modal-backdrop.show');
                if (openModal) {
                    closeModal(openModal);
                }
            }
        });
    }
    
    function openModal(modalBackdrop) {
        modalBackdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const modal = modalBackdrop.querySelector('.jm-modal');
        if (modal) {
            const firstFocusable = modal.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
        }
    }
    
    function closeModal(modalBackdrop) {
        modalBackdrop.classList.remove('show');
        document.body.style.overflow = '';
    }
    
})();
