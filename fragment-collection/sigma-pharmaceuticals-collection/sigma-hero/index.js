/* Sigma Pharmaceuticals Hero Fragment JavaScript */
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
    ready(initializeHero);
    
    // Listen for Liferay SPA navigation events
    if (window.Liferay) {
        Liferay.on('allPortletsReady', function(event) {
            setTimeout(initializeHero, 100);
        });
    }
    
    function initializeHero() {
        // Sigma Pharmaceuticals Hero Fragment initializing
        
        // Get and apply configuration
        const config = getFragmentConfiguration();
        applyConfiguration(config);
        
        // Initialize animations
        initializeAnimations();
        
        // Initialize counter animations
        initializeCounters();
        
        // Initialize parallax effect (optional)
        initializeParallax();
        
        // Initialize background image loading
        initializeBackgroundImage();
        
        // Sigma Pharmaceuticals Hero Fragment initialized
    }
    
    /**
     * Get fragment configuration from Liferay
     */
    function getFragmentConfiguration() {
        let config;
        
        // Try to get configuration from Liferay's fragment configuration system
        if (typeof configuration !== 'undefined') {
            config = {
                layoutStyle: configuration.layoutStyle || 'centered',
                backgroundStyle: configuration.backgroundStyle || 'image',
                showStats: configuration.showStats !== undefined ? configuration.showStats : true,
                showButtons: configuration.showButtons !== undefined ? configuration.showButtons : true
            };
        } else {
            // Fallback default values if configuration is not available
            config = {
                layoutStyle: 'centered',
                backgroundStyle: 'image',
                showStats: true,
                showButtons: true
            };
        }
        
        return config;
    }
    
    /**
     * Apply configuration settings to the hero
     */
    function applyConfiguration(config) {
        const hero = fragmentElement.querySelector('.sigma-hero');
        const stats = fragmentElement.querySelector('.sigma-hero-stats');
        const buttons = fragmentElement.querySelector('.sigma-hero-actions');
        
        // Apply layout and background styles
        if (hero) {
            hero.setAttribute('data-layout', config.layoutStyle);
            hero.setAttribute('data-background', config.backgroundStyle);
        }
        
        // Show/hide components based on configuration
        if (stats) {
            stats.style.display = config.showStats ? 'flex' : 'none';
        }
        
        if (buttons) {
            buttons.style.display = config.showButtons ? 'flex' : 'none';
        }
    }
    
    /**
     * Initialize scroll animations
     */
    function initializeAnimations() {
        const animatedElements = fragmentElement.querySelectorAll('.sigma-hero-title, .sigma-hero-description, .sigma-hero-actions, .sigma-hero-stats');
        
        // Add initial animation classes
        animatedElements.forEach(function(element, index) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            element.style.transitionDelay = (index * 0.2) + 's';
        });
        
        // Trigger animations
        setTimeout(function() {
            animatedElements.forEach(function(element) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
        }, 300);
    }
    
    /**
     * Initialize counter animations
     */
    function initializeCounters() {
        const counters = fragmentElement.querySelectorAll('.sigma-stat-number');
        
        counters.forEach(function(counter) {
            const text = counter.textContent.trim();
            const number = parseInt(text.replace(/\D/g, ''));
            const suffix = text.replace(/\d/g, '');
            
            if (number && number > 0) {
                animateCounter(counter, 0, number, suffix, 2000);
            }
        });
    }
    
    /**
     * Animate counter from start to end value
     */
    function animateCounter(element, start, end, suffix, duration) {
        const increment = end / (duration / 16); // 60fps
        let current = start;
        
        function updateCounter() {
            current += increment;
            if (current < end) {
                element.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = end + suffix;
            }
        }
        
        setTimeout(updateCounter, 800); // Delay start
    }
    
    /**
     * Initialize parallax effect for background image
     */
    function initializeParallax() {
        const hero = fragmentElement.querySelector('.sigma-hero');
        const bgImage = fragmentElement.querySelector('.sigma-hero-bg-image');
        
        if (!hero || !bgImage) return;
        
        // Only enable parallax on larger screens
        if (window.innerWidth < 768) return;
        
        function handleScroll() {
            const rect = hero.getBoundingClientRect();
            const isVisible = rect.bottom >= 0 && rect.top <= window.innerHeight;
            
            if (isVisible) {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                bgImage.style.transform = 'translateY(' + rate + 'px)';
            }
        }
        
        // Throttle scroll events for performance
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', function() {
            requestTick();
            ticking = false;
        }, { passive: true });
    }
    
    /**
     * Initialize background image loading
     */
    function initializeBackgroundImage() {
        const bgImage = fragmentElement.querySelector('.sigma-hero-bg-image');
        
        if (!bgImage) return;
        
        // Add loading state
        bgImage.style.opacity = '0';
        bgImage.style.transition = 'opacity 0.5s ease';
        
        // Handle image load
        function handleImageLoad() {
            bgImage.style.opacity = '1';
        }
        
        // Handle image error
        function handleImageError() {
            console.warn('Hero background image failed to load');
            // Fallback to gradient background
            const hero = fragmentElement.querySelector('.sigma-hero');
            const overlay = fragmentElement.querySelector('.sigma-hero-overlay');
            if (hero && overlay) {
                bgImage.style.display = 'none';
                overlay.style.background = 'linear-gradient(135deg, var(--sigma-primary) 0%, var(--sigma-secondary) 100%)';
            }
        }
        
        if (bgImage.complete) {
            handleImageLoad();
        } else {
            bgImage.addEventListener('load', handleImageLoad);
            bgImage.addEventListener('error', handleImageError);
        }
    }
    
})();