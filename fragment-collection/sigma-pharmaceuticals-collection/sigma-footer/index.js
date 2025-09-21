/* Sigma Pharmaceuticals Footer Fragment JavaScript */
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
    ready(initializeFooter);
    
    // Listen for Liferay SPA navigation events
    if (window.Liferay) {
        Liferay.on('allPortletsReady', function(event) {
            setTimeout(initializeFooter, 100);
        });
    }
    
    // Listen for standard navigation events
    document.addEventListener('navigate', function(event) {
        setTimeout(initializeFooter, 100);
    });
    
    function initializeFooter() {
        // Sigma Pharmaceuticals Footer Fragment initializing
        
        // Get and apply configuration
        const config = getFragmentConfiguration();
        applyConfiguration(config);
        
        // Initialize back to top functionality
        initializeBackToTop();
        
        // Initialize newsletter functionality
        initializeNewsletter();
        
        // Initialize accessibility features
        initializeAccessibility();
        
        // Initialize social media tracking (if needed)
        initializeSocialTracking();
        
        // Sigma Pharmaceuticals Footer Fragment initialized
    }
    
    /**
     * Get fragment configuration from Liferay
     */
    function getFragmentConfiguration() {
        let config;
        
        // Try to get configuration from Liferay's fragment configuration system
        if (typeof configuration !== 'undefined') {
            config = {
                showNewsletter: configuration.showNewsletter !== undefined ? configuration.showNewsletter : false,
                showSocialMedia: configuration.showSocialMedia !== undefined ? configuration.showSocialMedia : true,
                showBackToTop: configuration.showBackToTop !== undefined ? configuration.showBackToTop : true,
                companyName: configuration.companyName || 'Sigma Pharmaceuticals',
                footerStyle: configuration.footerStyle || 'dark',
                columnLayout: configuration.columnLayout || '5-column',
                enableTracking: configuration.enableTracking !== undefined ? configuration.enableTracking : true,
                newsletterService: configuration.newsletterService || 'custom'
            };
        } else {
            // Fallback default values if configuration is not available
            config = {
                showNewsletter: false,
                showSocialMedia: true,
                showBackToTop: true,
                companyName: 'Sigma Pharmaceuticals',
                footerStyle: 'dark',
                columnLayout: '5-column',
                enableTracking: true,
                newsletterService: 'custom'
            };
        }
        
        return config;
    }
    
    /**
     * Apply configuration settings to the footer
     */
    function applyConfiguration(config) {
        const footer = fragmentElement.querySelector('.sigma-footer');
        const footerMain = fragmentElement.querySelector('.sigma-footer-main');
        const socialMedia = fragmentElement.querySelector('.sigma-footer-social');
        const newsletter = fragmentElement.querySelector('.sigma-footer-newsletter');
        const backToTop = fragmentElement.querySelector('.sigma-footer-back-to-top');
        const companyNameSpan = fragmentElement.querySelector('.sigma-company-name');
        
        // Apply footer style
        if (footer) {
            footer.setAttribute('data-style', config.footerStyle);
        }
        
        // Apply column layout
        if (footerMain) {
            footerMain.setAttribute('data-layout', config.columnLayout);
        }
        
        // Show/hide components based on configuration
        if (socialMedia) {
            socialMedia.style.display = config.showSocialMedia ? 'block' : 'none';
        }
        
        if (newsletter) {
            newsletter.style.display = config.showNewsletter ? 'block' : 'none';
        }
        
        if (backToTop) {
            backToTop.style.display = config.showBackToTop ? 'block' : 'none';
        }
        
        // Update company name
        if (companyNameSpan && config.companyName) {
            companyNameSpan.textContent = config.companyName;
        }
    }
    
    /**
     * Initialize back to top functionality
     */
    function initializeBackToTop() {
        const backToTopBtn = fragmentElement.querySelector('.sigma-back-to-top-btn');
        
        if (!backToTopBtn) return;
        
        // Show/hide button based on scroll position
        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const shouldShow = scrollTop > 300;
            
            if (shouldShow) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        }
        
        // Initially hide the button
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
        backToTopBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        // Listen for scroll events
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Handle click
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Handle keyboard access
        backToTopBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    /**
     * Initialize newsletter functionality
     */
    function initializeNewsletter() {
        const newsletterForm = fragmentElement.querySelector('#sigma-newsletter-form');
        const emailInput = fragmentElement.querySelector('#newsletter-email');
        const submitBtn = fragmentElement.querySelector('.sigma-newsletter-btn');
        
        if (!newsletterForm || !emailInput || !submitBtn) return;
        
        // Handle form submission
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (!email) {
                showNotification('Please enter your email address.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Disable form during submission
            emailInput.disabled = true;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Subscribing...</span>';
            
            // Get configuration
            const config = getFragmentConfiguration();
            
            // Handle different newsletter services
            switch (config.newsletterService) {
                case 'mailchimp':
                    handleMailchimpSubscription(email);
                    break;
                case 'campaign-monitor':
                    handleCampaignMonitorSubscription(email);
                    break;
                case 'constant-contact':
                    handleConstantContactSubscription(email);
                    break;
                default:
                    handleCustomSubscription(email);
                    break;
            }
        });
        
        // Handle input validation
        emailInput.addEventListener('blur', function() {
            const email = emailInput.value.trim();
            if (email && !isValidEmail(email)) {
                emailInput.classList.add('error');
                showNotification('Please enter a valid email address.', 'error');
            } else {
                emailInput.classList.remove('error');
            }
        });
    }
    
    /**
     * Validate email address
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Handle custom newsletter subscription
     */
    function handleCustomSubscription(email) {
        // Simulate API call
        setTimeout(function() {
            showNotification('Thank you for subscribing! We\'ll keep you updated with the latest news from Sigma Pharmaceuticals.', 'success');
            resetForm();
        }, 1000);
    }
    
    /**
     * Handle Mailchimp subscription
     */
    function handleMailchimpSubscription(email) {
        // Implementation for Mailchimp integration
        // This would typically involve calling Mailchimp's API
        handleCustomSubscription(email); // Fallback for now
    }
    
    /**
     * Handle Campaign Monitor subscription
     */
    function handleCampaignMonitorSubscription(email) {
        // Implementation for Campaign Monitor integration
        handleCustomSubscription(email); // Fallback for now
    }
    
    /**
     * Handle Constant Contact subscription
     */
    function handleConstantContactSubscription(email) {
        // Implementation for Constant Contact integration
        handleCustomSubscription(email); // Fallback for now
    }
    
    /**
     * Reset newsletter form
     */
    function resetForm() {
        const emailInput = fragmentElement.querySelector('#newsletter-email');
        const submitBtn = fragmentElement.querySelector('.sigma-newsletter-btn');
        
        if (emailInput) {
            emailInput.value = '';
            emailInput.disabled = false;
            emailInput.classList.remove('error');
        }
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Subscribe</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        }
    }
    
    /**
     * Show notification to user
     */
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `sigma-notification sigma-notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--sigma-success, #28a745)' : 'var(--sigma-danger, #dc3545)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    /**
     * Initialize accessibility features
     */
    function initializeAccessibility() {
        // Add focus indicators for keyboard navigation
        const focusableElements = fragmentElement.querySelectorAll('a, button, input');
        
        focusableElements.forEach(function(element) {
            element.addEventListener('focus', function() {
                element.style.outline = '2px solid var(--sigma-primary)';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', function() {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
        
        // Ensure social links have proper aria labels
        const socialLinks = fragmentElement.querySelectorAll('.sigma-social-link');
        socialLinks.forEach(function(link) {
            if (!link.getAttribute('aria-label')) {
                const href = link.getAttribute('href');
                if (href.includes('linkedin')) {
                    link.setAttribute('aria-label', 'Follow us on LinkedIn');
                } else if (href.includes('twitter')) {
                    link.setAttribute('aria-label', 'Follow us on Twitter');
                } else if (href.includes('facebook')) {
                    link.setAttribute('aria-label', 'Follow us on Facebook');
                }
            }
        });
    }
    
    /**
     * Initialize social media tracking
     */
    function initializeSocialTracking() {
        const config = getFragmentConfiguration();
        
        if (!config.enableTracking) return;
        
        const socialLinks = fragmentElement.querySelectorAll('.sigma-social-link');
        const footerLinks = fragmentElement.querySelectorAll('.sigma-footer-links a');
        
        // Track social media clicks
        socialLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                const platform = getSocialPlatform(link.getAttribute('href'));
                trackEvent('Footer Social Click', {
                    platform: platform,
                    location: 'footer'
                });
            });
        });
        
        // Track footer navigation clicks
        footerLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                trackEvent('Footer Link Click', {
                    link_text: link.textContent.trim(),
                    link_url: link.getAttribute('href'),
                    location: 'footer'
                });
            });
        });
    }
    
    /**
     * Get social platform from URL
     */
    function getSocialPlatform(url) {
        if (url.includes('linkedin')) return 'LinkedIn';
        if (url.includes('twitter')) return 'Twitter';
        if (url.includes('facebook')) return 'Facebook';
        if (url.includes('instagram')) return 'Instagram';
        if (url.includes('youtube')) return 'YouTube';
        return 'Unknown';
    }
    
    /**
     * Track event (placeholder for analytics integration)
     */
    function trackEvent(eventName, eventData) {
        // Integration with Google Analytics, Adobe Analytics, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Integration with other analytics platforms
        if (typeof analytics !== 'undefined') {
            analytics.track(eventName, eventData);
        }
        
        // Console log for debugging (remove in production)
        // console.log('Tracking event:', eventName, eventData);
    }
    
})();