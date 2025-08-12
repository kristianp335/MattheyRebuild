/* Johnson Matthey News Carousel Fragment JavaScript */
(function() {
    'use strict';
    
    const fragmentElement = document.currentScript.closest('.jm-news-carousel-fragment');
    if (!fragmentElement) return;
    
    let currentSlide = 0;
    let slides = [];
    let slidesToShow = 3;
    let autoplayInterval = null;
    let isAutoplayPaused = false;
    
    // Initialize on DOM ready and SPA navigation events
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }
    
    // Initial load
    ready(initializeCarousel);
    
    // Listen for Liferay SPA navigation events
    if (window.Liferay) {
        Liferay.on('allPortletsReady', function(event) {
            console.log('SPA navigation complete - reinitializing news carousel');
            setTimeout(initializeCarousel, 100);
        });
    }
    
    // Listen for standard navigation events
    document.addEventListener('navigate', function(event) {
        setTimeout(initializeCarousel, 100);
    });
    
    function initializeCarousel() {
        console.log('Johnson Matthey News Carousel Fragment initializing...');
        
        // Get carousel elements
        const track = fragmentElement.querySelector('#jm-news-track');
        const prevButton = fragmentElement.querySelector('.jm-carousel-prev');
        const nextButton = fragmentElement.querySelector('.jm-carousel-next');
        const indicatorsContainer = fragmentElement.querySelector('#jm-carousel-indicators');
        
        if (!track || !prevButton || !nextButton || !indicatorsContainer) {
            console.error('Carousel elements not found');
            return;
        }
        
        slides = track.querySelectorAll('.jm-carousel-slide');
        
        if (slides.length === 0) {
            console.error('No carousel slides found');
            return;
        }
        
        // Setup responsive behavior
        setupResponsiveCarousel();
        
        // Setup controls
        setupCarouselControls(prevButton, nextButton);
        
        // Setup indicators
        setupCarouselIndicators(indicatorsContainer);
        
        // Setup touch/swipe support
        setupTouchSupport(track);
        
        // Setup keyboard navigation
        setupKeyboardNavigation();
        
        // Setup autoplay
        setupAutoplay();
        
        // Initial display
        updateCarousel();
        
        // Setup resize listener
        window.addEventListener('resize', debounce(setupResponsiveCarousel, 250));
        
        console.log(`Johnson Matthey News Carousel initialized with ${slides.length} slides`);
    }
    
    function setupResponsiveCarousel() {
        const containerWidth = fragmentElement.querySelector('.jm-carousel-container').offsetWidth;
        
        if (containerWidth < 768) {
            slidesToShow = 1;
        } else if (containerWidth < 1024) {
            slidesToShow = 2;
        } else {
            slidesToShow = 3;
        }
        
        // Ensure current slide is still valid
        const maxSlide = Math.max(0, slides.length - slidesToShow);
        currentSlide = Math.min(currentSlide, maxSlide);
        
        updateCarousel();
    }
    
    function setupCarouselControls(prevButton, nextButton) {
        prevButton.addEventListener('click', () => {
            previousSlide();
            pauseAutoplay();
        });
        
        nextButton.addEventListener('click', () => {
            nextSlide();
            pauseAutoplay();
        });
        
        // Update button states
        updateControlButtons();
    }
    
    function setupCarouselIndicators(container) {
        container.innerHTML = '';
        
        const totalSlides = Math.max(1, slides.length - slidesToShow + 1);
        
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'jm-carousel-indicator';
            indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
            indicator.addEventListener('click', () => {
                goToSlide(i);
                pauseAutoplay();
            });
            container.appendChild(indicator);
        }
        
        updateIndicators();
    }
    
    function setupTouchSupport(track) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            pauseAutoplay();
        }, { passive: true });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const difference = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(difference) > threshold) {
                if (difference > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }
        }, { passive: true });
        
        // Mouse support for desktop
        track.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            pauseAutoplay();
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
            e.preventDefault();
        });
        
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const difference = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(difference) > threshold) {
                if (difference > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }
        });
    }
    
    function setupKeyboardNavigation() {
        const carousel = fragmentElement.querySelector('.jm-carousel-container');
        carousel.setAttribute('tabindex', '0');
        carousel.setAttribute('role', 'region');
        carousel.setAttribute('aria-label', 'News carousel');
        
        carousel.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    previousSlide();
                    pauseAutoplay();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    pauseAutoplay();
                    break;
                case 'Home':
                    e.preventDefault();
                    goToSlide(0);
                    pauseAutoplay();
                    break;
                case 'End':
                    e.preventDefault();
                    goToSlide(slides.length - slidesToShow);
                    pauseAutoplay();
                    break;
            }
        });
    }
    
    function setupAutoplay() {
        // Start autoplay
        startAutoplay();
        
        // Pause on hover
        const container = fragmentElement.querySelector('.jm-carousel-container');
        container.addEventListener('mouseenter', pauseAutoplay);
        container.addEventListener('mouseleave', resumeAutoplay);
        
        // Pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                pauseAutoplay();
            } else {
                resumeAutoplay();
            }
        });
    }
    
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        
        autoplayInterval = setInterval(() => {
            if (!isAutoplayPaused) {
                nextSlide();
            }
        }, 5000); // 5 seconds
    }
    
    function pauseAutoplay() {
        isAutoplayPaused = true;
    }
    
    function resumeAutoplay() {
        isAutoplayPaused = false;
        if (!autoplayInterval) {
            startAutoplay();
        }
    }
    
    function nextSlide() {
        const maxSlide = Math.max(0, slides.length - slidesToShow);
        currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
        updateCarousel();
    }
    
    function previousSlide() {
        const maxSlide = Math.max(0, slides.length - slidesToShow);
        currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
        updateCarousel();
    }
    
    function goToSlide(index) {
        const maxSlide = Math.max(0, slides.length - slidesToShow);
        currentSlide = Math.max(0, Math.min(index, maxSlide));
        updateCarousel();
    }
    
    function updateCarousel() {
        const track = fragmentElement.querySelector('#jm-news-track');
        if (!track) return;
        
        // Calculate slide width as percentage
        const slideWidth = 100 / slidesToShow;
        const translateX = -(currentSlide * slideWidth);
        
        // Update track position
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update slides visibility and layout
        slides.forEach((slide, index) => {
            slide.style.width = `${slideWidth}%`;
            slide.style.flex = `0 0 ${slideWidth}%`;
            
            // Update accessibility
            const isVisible = index >= currentSlide && index < currentSlide + slidesToShow;
            slide.setAttribute('aria-hidden', !isVisible);
            
            // Update tab index for focusable elements
            const focusableElements = slide.querySelectorAll('a, button');
            focusableElements.forEach(el => {
                el.tabIndex = isVisible ? 0 : -1;
            });
        });
        
        updateControlButtons();
        updateIndicators();
    }
    
    function updateControlButtons() {
        const prevButton = fragmentElement.querySelector('.jm-carousel-prev');
        const nextButton = fragmentElement.querySelector('.jm-carousel-next');
        
        if (!prevButton || !nextButton) return;
        
        const maxSlide = Math.max(0, slides.length - slidesToShow);
        
        // Update button states
        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide >= maxSlide;
        
        // Update ARIA labels
        prevButton.setAttribute('aria-label', 
            `Previous news items ${currentSlide === 0 ? '(disabled)' : ''}`);
        nextButton.setAttribute('aria-label', 
            `Next news items ${currentSlide >= maxSlide ? '(disabled)' : ''}`);
    }
    
    function updateIndicators() {
        const indicators = fragmentElement.querySelectorAll('.jm-carousel-indicator');
        const totalSlides = Math.max(1, slides.length - slidesToShow + 1);
        
        indicators.forEach((indicator, index) => {
            const isActive = index === currentSlide;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-pressed', isActive);
        });
    }
    
    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    });
    
})();
