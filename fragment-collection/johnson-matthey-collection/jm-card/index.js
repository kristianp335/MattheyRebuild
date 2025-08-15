// JM Card Fragment JavaScript
(function() {
    'use strict';
    
    // Ensure fragmentElement is available
    if (typeof fragmentElement === 'undefined') {
        console.warn('JM Card: fragmentElement not available');
        return;
    }
    
    const cardElement = fragmentElement.querySelector('.jm-card');
    
    if (!cardElement) {
        console.warn('JM Card: Card element not found');
        return;
    }
    
    // Initialize card
    function initializeCard() {
        console.log('JM Card: Initializing card...');
        
        // Add compact class if in mega menu context
        const isInMegaMenu = cardElement.closest('.jm-mega-content') || 
                           cardElement.closest('.jm-dropdown-menu');
        
        if (isInMegaMenu) {
            cardElement.classList.add('compact');
            console.log('JM Card: Applied compact styling for mega menu');
        }
        
        // Add click analytics if needed
        const cardButton = cardElement.querySelector('.jm-card-button');
        if (cardButton) {
            cardButton.addEventListener('click', function(e) {
                // Track card click analytics
                const cardTitle = cardElement.querySelector('.jm-card-title')?.textContent || 'Unknown';
                console.log('JM Card: Button clicked -', cardTitle);
                
                // Add any analytics tracking here
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'card_click', {
                        'card_title': cardTitle,
                        'card_location': isInMegaMenu ? 'mega_menu' : 'page'
                    });
                }
            });
        }
        
        // Image lazy loading optimization
        const cardImage = cardElement.querySelector('.jm-card-image img');
        if (cardImage) {
            cardImage.loading = 'lazy';
            
            // Add error handling
            cardImage.addEventListener('error', function() {
                console.warn('JM Card: Image failed to load');
                this.style.display = 'none';
            });
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCard);
    } else {
        initializeCard();
    }
    
    console.log('JM Card: Fragment initialized');
    
})();