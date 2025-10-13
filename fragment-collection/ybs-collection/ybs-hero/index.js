(function() {
  // Liferay automatically provides fragmentElement for each fragment instance
  if (typeof fragmentElement === 'undefined') {
    console.warn('YBS Hero: fragmentElement not available');
    return;
  }

  const isEditMode = typeof layoutMode !== 'undefined' && layoutMode === 'edit';
  
  if (!isEditMode) {
    const buttons = fragmentElement.querySelectorAll('.ybs-btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const href = button.getAttribute('href');
        if (!href || href === '#') {
          e.preventDefault();
        }
      });
    });
  }
})();
