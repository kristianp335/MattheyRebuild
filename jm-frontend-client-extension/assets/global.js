/* Johnson Matthey Global JavaScript */
(function() {
    'use strict';
    
    // Initialize when Liferay is ready
    if (window.Liferay) {
        Liferay.on('allPortletsReady', function() {
            initializeJohnsonMatthey();
        });
    } else {
        document.addEventListener('DOMContentLoaded', initializeJohnsonMatthey);
    }
    
    function initializeJohnsonMatthey() {
        console.log('Johnson Matthey Global JavaScript initialized');
        
        // Initialize global modal system
        initializeGlobalModals();
        
        // Initialize global utilities
        initializeGlobalUtilities();
        
        // Initialize accessibility features
        initializeAccessibility();
    }
    
    function initializeGlobalModals() {
        // Global modal close functionality
        document.addEventListener('click', function(e) {
            if (e.target.matches('.jm-modal-close') || e.target.closest('.jm-modal-close')) {
                closeModal(e.target.closest('.jm-modal'));
            }
            
            // Close modal when clicking backdrop
            if (e.target.matches('.jm-modal-backdrop')) {
                closeModal(e.target.querySelector('.jm-modal'));
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.jm-modal.show');
                if (openModal) {
                    closeModal(openModal);
                }
            }
        });
    }
    
    function openModal(modal) {
        if (!modal) return;
        
        const backdrop = modal.parentElement;
        if (backdrop && backdrop.classList.contains('jm-modal-backdrop')) {
            backdrop.classList.add('show');
        }
        modal.classList.add('show');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus first focusable element
        const focusableElement = modal.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElement) {
            focusableElement.focus();
        }
        
        // Dispatch custom event
        modal.dispatchEvent(new CustomEvent('jm:modal:opened', { 
            detail: { modal: modal },
            bubbles: true 
        }));
    }
    
    function closeModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('show');
        const backdrop = modal.parentElement;
        if (backdrop && backdrop.classList.contains('jm-modal-backdrop')) {
            backdrop.classList.remove('show');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Dispatch custom event
        modal.dispatchEvent(new CustomEvent('jm:modal:closed', { 
            detail: { modal: modal },
            bubbles: true 
        }));
    }
    
    function initializeGlobalUtilities() {
        // Smooth scroll for anchor links
        document.addEventListener('click', function(e) {
            if (e.target.matches('a[href^="#"]') && e.target.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
        
        // Global dropdown functionality (fallback for fragments)
        document.addEventListener('click', function(e) {
            // Close all dropdowns when clicking outside
            if (!e.target.closest('.jm-dropdown')) {
                document.querySelectorAll('.jm-dropdown-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                });
            }
        });
    }
    
    function initializeAccessibility() {
        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.className = 'jm-skip-link';
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--jm-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.15s;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Enhance keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Tab trapping in modals
            if (e.key === 'Tab') {
                const openModal = document.querySelector('.jm-modal.show');
                if (openModal) {
                    trapTabInModal(e, openModal);
                }
            }
        });
    }
    
    function trapTabInModal(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    // Expose global utilities
    window.JohnsonMatthey = {
        openModal: openModal,
        closeModal: closeModal,
        version: '1.0.0'
    };
    
})();
