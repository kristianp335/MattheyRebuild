/* Johnson Matthey Hero Fragment JavaScript */
(function() {
    'use strict';
    
    const fragmentElement = document.currentScript.closest('.jm-hero-fragment');
    if (!fragmentElement) return;
    
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
    
    // Single initialization only - no looping event listeners for performance
    
    function initializeHero() {
        // Get configuration and apply immediately
        const config = getFragmentConfiguration();
        applyConfiguration(config);
        
        // Initialize video functionality if enabled
        if (config.showVideo) {
            initializeVideo();
        }
    }
    
    /**
     * Get fragment configuration values
     */
    function getFragmentConfiguration() {
        return {
            showVideo: configuration.showVideo,
            showStats: configuration.showStats,
            layoutStyle: configuration.layoutStyle,
            backgroundStyle: configuration.backgroundStyle
        };
    }
    
    /**
     * Apply configuration settings to the hero
     */
    function applyConfiguration(config) {
        const heroSection = fragmentElement.querySelector('.jm-hero');
        const heroContent = fragmentElement.querySelector('.jm-hero-content');
        const videoOverlay = fragmentElement.querySelector('.jm-hero-video-overlay');
        const heroStats = fragmentElement.querySelector('.jm-hero-stats');
        
        // Apply layout style
        if (heroContent) {
            heroContent.setAttribute('data-layout', config.layoutStyle);
        }
        
        // Apply background style
        if (heroSection) {
            heroSection.setAttribute('data-background', config.backgroundStyle);
        }
        
        // Show/hide video button
        if (videoOverlay) {
            videoOverlay.style.display = config.showVideo ? 'block' : 'none';
        }
        
        // Show/hide statistics
        if (heroStats) {
            heroStats.style.display = config.showStats ? 'flex' : 'none';
        }

    }
    
    function initializeVideo() {
        const playButton = fragmentElement.querySelector('.jm-play-button');
        const videoModal = fragmentElement.querySelector('.jm-video-modal');
        const videoBackdrop = fragmentElement.querySelector('.jm-video-modal-backdrop');
        const videoIframe = fragmentElement.querySelector('#jm-hero-video');
        
        if (!playButton || !videoModal || !videoIframe) return;
        
        // Get video URL from editable content or use default
        const videoCaption = fragmentElement.querySelector('.jm-video-caption');
        let videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0'; // Default video
        
        // Try to extract video URL from caption or other editable content
        if (videoCaption && videoCaption.dataset.videoUrl) {
            videoUrl = videoCaption.dataset.videoUrl;
        }
        
        playButton.addEventListener('click', () => {
            // Set video source
            videoIframe.src = videoUrl;
            
            // Open modal
            if (window.JohnsonMatthey && window.JohnsonMatthey.openModal) {
                window.JohnsonMatthey.openModal(videoModal);
            } else {
                videoBackdrop.classList.add('show');
                videoModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Close video and stop playback when modal closes
        videoModal.addEventListener('jm:modal:closed', () => {
            videoIframe.src = '';
        });
        
        // Fallback close handler
        const closeButton = videoModal.querySelector('.jm-modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                videoIframe.src = '';
                videoBackdrop.classList.remove('show');
                videoModal.classList.remove('show');
                document.body.style.overflow = '';
            });
        }
    }
    
    // Handle keyboard navigation for video button
    const playButton = fragmentElement.querySelector('.jm-play-button');
    if (playButton) {
        playButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playButton.click();
            }
        });
    }
    
})();
