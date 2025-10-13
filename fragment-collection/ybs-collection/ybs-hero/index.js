(function() {
  // Liferay injects: const fragmentElement = document.querySelector('#fragment-xyz');
  if (!fragmentElement) {
    console.warn('YBS Hero: fragmentElement not found');
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
