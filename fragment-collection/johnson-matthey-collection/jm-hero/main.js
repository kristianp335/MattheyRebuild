/* Johnson Matthey Hero Fragment JavaScript */
(function() {
    'use strict';
    
    const fragmentElement = document.currentScript.closest('.jm-hero-fragment');
    if (!fragmentElement) return;
    
    // Initialize hero functionality
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHero);
    } else {
        initializeHero();
    }
    
    function initializeHero() {
        console.log('Johnson Matthey Hero Fragment initializing...');
        
        // Initialize video functionality
        initializeVideo();
        
        // Initialize animations
        initializeAnimations();
        
        // Initialize statistics counter
        initializeStatsCounter();
        
        console.log('Johnson Matthey Hero Fragment initialized');
    }
    
    function initializeVideo() {
        const playButton = fragmentElement.querySelector('.jm-play-button');
        const videoModal = fragmentElement.querySelector('.jm-video-modal');
        const videoBackdrop = fragmentElement.querySelector('.jm-video-modal-backdrop');
        const videoIframe = fragmentElement.querySelector('#jm-hero-video');
        
        if (!playButton || !videoModal || !videoIframe) return;
        
        // Sample video URL - replace with actual Johnson Matthey video
        const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';
        
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
    
    function initializeAnimations() {
        // Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('jm-animate-in');
                        
                        // Start stats counter if it's the stats element
                        if (entry.target.classList.contains('jm-hero-stats')) {
                            animateStatsCounter();
                        }
                    }
                });
            }, observerOptions);
            
            // Observe hero elements
            const animateElements = fragmentElement.querySelectorAll(
                '.jm-hero-title, .jm-hero-description, .jm-hero-actions, .jm-hero-media, .jm-hero-stats'
            );
            
            animateElements.forEach(el => {
                el.classList.add('jm-animate-ready');
                observer.observe(el);
            });
        }
    }
    
    function initializeStatsCounter() {
        // This will be triggered by intersection observer
        window.heroStatsAnimated = false;
    }
    
    function animateStatsCounter() {
        if (window.heroStatsAnimated) return;
        window.heroStatsAnimated = true;
        
        const statNumber = fragmentElement.querySelector('.jm-hero-stat-number');
        if (!statNumber) return;
        
        const finalValue = parseInt(statNumber.textContent) || 200;
        const duration = 2000; // 2 seconds
        const frameRate = 60;
        const totalFrames = (duration / 1000) * frameRate;
        const increment = finalValue / totalFrames;
        
        let currentValue = 0;
        let frame = 0;
        
        const counter = () => {
            frame++;
            currentValue += increment;
            
            if (currentValue >= finalValue) {
                statNumber.textContent = finalValue;
                return;
            }
            
            statNumber.textContent = Math.floor(currentValue);
            requestAnimationFrame(counter);
        };
        
        // Start the animation
        statNumber.textContent = '0';
        requestAnimationFrame(counter);
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
