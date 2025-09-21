/* Sigma Pharmaceuticals Global JavaScript */
/* Version: 1.0.0 - Core utilities and enhancements */

(function(window, document) {
    'use strict';
    
    // Create Sigma namespace
    window.Sigma = window.Sigma || {};
    
    // Sigma utilities
    Sigma.utils = {
        
        /**
         * Debounce function calls
         */
        debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },
        
        /**
         * Throttle function calls
         */
        throttle: function(func, limit) {
            var inThrottle;
            return function() {
                var args = arguments;
                var context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(function() {
                        inThrottle = false;
                    }, limit);
                }
            };
        },
        
        /**
         * Check if element is in viewport
         */
        isInViewport: function(element) {
            var rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },
        
        /**
         * Smooth scroll to element
         */
        scrollToElement: function(element, offset) {
            offset = offset || 0;
            var elementPosition = element.offsetTop - offset;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        },
        
        /**
         * Add CSS class with animation
         */
        addClass: function(element, className, callback) {
            element.classList.add(className);
            if (callback && typeof callback === 'function') {
                setTimeout(callback, 300); // Default animation duration
            }
        },
        
        /**
         * Remove CSS class with animation
         */
        removeClass: function(element, className, callback) {
            element.classList.remove(className);
            if (callback && typeof callback === 'function') {
                setTimeout(callback, 300); // Default animation duration
            }
        }
    };
    
    // Sigma animation utilities
    Sigma.animations = {
        
        /**
         * Initialize scroll-triggered animations
         */
        initScrollAnimations: function() {
            var animatedElements = document.querySelectorAll('[data-sigma-animate]');
            
            if (animatedElements.length === 0) return;
            
            // Check if Intersection Observer is supported
            if ('IntersectionObserver' in window) {
                var observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            var element = entry.target;
                            var animationType = element.getAttribute('data-sigma-animate');
                            var delay = element.getAttribute('data-sigma-delay') || 0;
                            
                            setTimeout(function() {
                                element.classList.add('sigma-animate-' + animationType);
                                element.classList.add('sigma-animated');
                            }, parseInt(delay));
                            
                            observer.unobserve(element);
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                });
                
                animatedElements.forEach(function(element) {
                    observer.observe(element);
                });
            } else {
                // Fallback for browsers without Intersection Observer
                animatedElements.forEach(function(element) {
                    element.classList.add('sigma-animate-fadeIn');
                    element.classList.add('sigma-animated');
                });
            }
        },
        
        /**
         * Initialize counter animations
         */
        initCounterAnimations: function() {
            var counters = document.querySelectorAll('[data-sigma-counter]');
            
            counters.forEach(function(counter) {
                var target = parseInt(counter.getAttribute('data-sigma-counter'));
                var duration = parseInt(counter.getAttribute('data-counter-duration')) || 2000;
                var start = 0;
                var increment = target / (duration / 16); // 60fps
                
                function updateCounter() {
                    start += increment;
                    counter.textContent = Math.floor(start);
                    
                    if (start < target) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }
                
                // Start animation when element is in viewport
                if (Sigma.utils.isInViewport(counter)) {
                    updateCounter();
                }
            });
        }
    };
    
    // Sigma accessibility enhancements
    Sigma.accessibility = {
        
        /**
         * Initialize accessibility features
         */
        init: function() {
            this.initKeyboardNavigation();
            this.initFocusManagement();
            this.initAriaLabels();
        },
        
        /**
         * Enhanced keyboard navigation
         */
        initKeyboardNavigation: function() {
            // Skip to main content link
            var skipLink = document.createElement('a');
            skipLink.href = '#main';
            skipLink.textContent = 'Skip to main content';
            skipLink.className = 'sigma-skip-link';
            skipLink.style.cssText = 'position:absolute;top:-40px;left:6px;background:#0055b7;color:white;padding:8px;text-decoration:none;z-index:1000;';
            
            skipLink.addEventListener('focus', function() {
                this.style.top = '6px';
            });
            
            skipLink.addEventListener('blur', function() {
                this.style.top = '-40px';
            });
            
            document.body.insertBefore(skipLink, document.body.firstChild);
            
            // Trap focus in modals
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    var openModal = document.querySelector('.sigma-search-overlay[style*="flex"], .sigma-login-overlay[style*="flex"]');
                    if (openModal) {
                        var closeBtn = openModal.querySelector('.sigma-modal-close');
                        if (closeBtn) {
                            closeBtn.click();
                        }
                    }
                }
            });
        },
        
        /**
         * Focus management for better accessibility
         */
        initFocusManagement: function() {
            // Visible focus indicators
            var style = document.createElement('style');
            style.textContent = `
                .sigma-focus-visible:focus {
                    outline: 2px solid var(--sigma-primary, #0055b7) !important;
                    outline-offset: 2px !important;
                    box-shadow: 0 0 0 4px rgba(0, 85, 183, 0.3) !important;
                }
            `;
            document.head.appendChild(style);
            
            // Add focus-visible class to interactive elements
            var focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
            focusableElements.forEach(function(element) {
                element.classList.add('sigma-focus-visible');
            });
        },
        
        /**
         * Ensure proper ARIA labels
         */
        initAriaLabels: function() {
            // Add aria-label to buttons without text
            var iconButtons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
            iconButtons.forEach(function(button) {
                if (button.textContent.trim() === '') {
                    if (button.querySelector('svg')) {
                        button.setAttribute('aria-label', 'Button');
                    }
                }
            });
            
            // Ensure form inputs have labels
            var inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
            inputs.forEach(function(input) {
                var label = document.querySelector('label[for="' + input.id + '"]');
                if (!label && input.placeholder) {
                    input.setAttribute('aria-label', input.placeholder);
                }
            });
        }
    };
    
    // Sigma performance monitoring
    Sigma.performance = {
        
        /**
         * Monitor and log performance metrics
         */
        monitor: function() {
            if ('performance' in window) {
                window.addEventListener('load', function() {
                    setTimeout(function() {
                        var perfData = performance.timing;
                        var loadTime = perfData.loadEventEnd - perfData.navigationStart;
                        
                        // Log performance data (remove in production or send to analytics)
                        console.log('Sigma Pharmaceuticals - Page Load Time:', loadTime + 'ms');
                        
                        // Track Core Web Vitals if supported
                        if ('PerformanceObserver' in window) {
                            // Largest Contentful Paint (LCP)
                            new PerformanceObserver(function(entryList) {
                                var entries = entryList.getEntries();
                                var lastEntry = entries[entries.length - 1];
                                console.log('LCP:', lastEntry.startTime);
                            }).observe({entryTypes: ['largest-contentful-paint']});
                            
                            // First Input Delay (FID)
                            new PerformanceObserver(function(entryList) {
                                var entries = entryList.getEntries();
                                entries.forEach(function(entry) {
                                    console.log('FID:', entry.processingStart - entry.startTime);
                                });
                            }).observe({entryTypes: ['first-input']});
                        }
                    }, 0);
                });
            }
        }
    };
    
    // Sigma form enhancements
    Sigma.forms = {
        
        /**
         * Initialize form enhancements
         */
        init: function() {
            this.initValidation();
            this.initFileUpload();
            this.initAutoSave();
        },
        
        /**
         * Basic form validation
         */
        initValidation: function() {
            var forms = document.querySelectorAll('form[data-sigma-validate]');
            
            forms.forEach(function(form) {
                form.addEventListener('submit', function(e) {
                    var isValid = true;
                    var inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
                    
                    inputs.forEach(function(input) {
                        if (!input.value.trim()) {
                            input.classList.add('sigma-invalid');
                            isValid = false;
                        } else {
                            input.classList.remove('sigma-invalid');
                        }
                        
                        // Email validation
                        if (input.type === 'email' && input.value) {
                            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(input.value)) {
                                input.classList.add('sigma-invalid');
                                isValid = false;
                            }
                        }
                    });
                    
                    if (!isValid) {
                        e.preventDefault();
                        var firstInvalid = form.querySelector('.sigma-invalid');
                        if (firstInvalid) {
                            firstInvalid.focus();
                        }
                    }
                });
            });
        },
        
        /**
         * File upload enhancements
         */
        initFileUpload: function() {
            var fileInputs = document.querySelectorAll('input[type="file"][data-sigma-upload]');
            
            fileInputs.forEach(function(input) {
                input.addEventListener('change', function() {
                    var file = this.files[0];
                    if (file) {
                        var sizeLimit = parseInt(this.getAttribute('data-size-limit')) || 5; // MB
                        var allowedTypes = this.getAttribute('data-allowed-types');
                        
                        // File size validation
                        if (file.size > sizeLimit * 1024 * 1024) {
                            alert('File size must be less than ' + sizeLimit + 'MB');
                            this.value = '';
                            return;
                        }
                        
                        // File type validation
                        if (allowedTypes) {
                            var types = allowedTypes.split(',');
                            var fileType = file.type || file.name.split('.').pop();
                            if (!types.some(function(type) { return fileType.includes(type.trim()); })) {
                                alert('File type not allowed. Allowed types: ' + allowedTypes);
                                this.value = '';
                                return;
                            }
                        }
                    }
                });
            });
        },
        
        /**
         * Auto-save form data
         */
        initAutoSave: function() {
            var autoSaveForms = document.querySelectorAll('form[data-sigma-autosave]');
            
            autoSaveForms.forEach(function(form) {
                var formId = form.id || 'sigma-form-' + Date.now();
                var inputs = form.querySelectorAll('input, textarea, select');
                
                // Load saved data
                inputs.forEach(function(input) {
                    var savedValue = localStorage.getItem(formId + '-' + input.name);
                    if (savedValue && input.type !== 'password') {
                        input.value = savedValue;
                    }
                });
                
                // Save data on input
                var saveData = Sigma.utils.debounce(function() {
                    inputs.forEach(function(input) {
                        if (input.name && input.type !== 'password') {
                            localStorage.setItem(formId + '-' + input.name, input.value);
                        }
                    });
                }, 1000);
                
                inputs.forEach(function(input) {
                    input.addEventListener('input', saveData);
                });
                
                // Clear saved data on successful submit
                form.addEventListener('submit', function() {
                    inputs.forEach(function(input) {
                        if (input.name) {
                            localStorage.removeItem(formId + '-' + input.name);
                        }
                    });
                });
            });
        }
    };
    
    // Initialize Sigma when DOM is ready
    function initSigma() {
        // Initialize modules
        Sigma.accessibility.init();
        Sigma.animations.initScrollAnimations();
        Sigma.animations.initCounterAnimations();
        Sigma.forms.init();
        Sigma.performance.monitor();
        
        // Dispatch custom event
        var event = new CustomEvent('sigmaReady', {
            detail: { version: '1.0.0' }
        });
        document.dispatchEvent(event);
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSigma);
    } else {
        initSigma();
    }
    
    // Reinitialize on Liferay SPA navigation
    if (window.Liferay) {
        Liferay.on('allPortletsReady', function() {
            setTimeout(initSigma, 100);
        });
    }
    
})(window, document);