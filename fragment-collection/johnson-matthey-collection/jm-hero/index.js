/* Johnson Matthey Hero Fragment - ULTRA PERFORMANCE VERSION */
/* ALL ANIMATIONS REMOVED FOR MAXIMUM LCP SPEED */
(function() {
    'use strict';
    
    // Use the fragmentElement provided by Liferay instead of document.currentScript
    if (!fragmentElement) {
        return;
    }
    
    // IMMEDIATE initialization - zero delays
    initializeHero();
    
    function initializeHero() {
        const config = {
            showVideo: configuration.showVideo || false,
            showStats: configuration.showStats || false,
            layoutStyle: configuration.layoutStyle || 'split',
            backgroundStyle: configuration.backgroundStyle || 'dark'
        };
        
        // Apply configuration immediately - no animations, no delays
        applyConfiguration(config);
        
        if (config.showVideo) {
            setupVideoModal();
        }
    }
    
    function applyConfiguration(config) {
        const heroSection = fragmentElement.querySelector('.jm-hero');
        const heroContent = fragmentElement.querySelector('.jm-hero-content');
        const videoOverlay = fragmentElement.querySelector('.jm-hero-video-overlay');
        const heroStats = fragmentElement.querySelector('.jm-hero-stats');
        
        // Apply styles instantly - no transitions
        if (heroSection) {
            heroSection.setAttribute('data-background', config.backgroundStyle);
        }
        
        if (heroContent) {
            heroContent.setAttribute('data-layout', config.layoutStyle);
        }
        
        // Show/hide elements instantly - no fade animations
        if (videoOverlay) {
            videoOverlay.style.display = config.showVideo ? 'block' : 'none';
        }
        
        if (heroStats) {
            heroStats.style.display = config.showStats ? 'flex' : 'none';
        }
    }
    
    function setupVideoModal() {
        const playButton = fragmentElement.querySelector('.jm-play-button');
        const modalBackdrop = fragmentElement.querySelector('.jm-video-modal-backdrop');
        const closeButton = fragmentElement.querySelector('.jm-modal-close');
        
        if (!playButton || !modalBackdrop) return;
        
        // Open modal - instant display, no animations
        playButton.addEventListener('click', function() {
            modalBackdrop.style.display = 'block';
            loadVideoContent();
        });
        
        // Close modal - instant hide, no animations
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                modalBackdrop.style.display = 'none';
                clearVideoContent();
            });
        }
        
        // Close on backdrop click - instant
        modalBackdrop.addEventListener('click', function(e) {
            if (e.target === modalBackdrop) {
                modalBackdrop.style.display = 'none';
                clearVideoContent();
            }
        });
    }
    
    function loadVideoContent() {
        const videoContainer = fragmentElement.querySelector('.jm-video-container');
        if (!videoContainer) return;
        
        // Load video instantly - no loading animations
        videoContainer.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Johnson Matthey Video" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>`;
    }
    
    function clearVideoContent() {
        const videoContainer = fragmentElement.querySelector('.jm-video-container');
        if (videoContainer) {
            videoContainer.innerHTML = '';
        }
    }
})();