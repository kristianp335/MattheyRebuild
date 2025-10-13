const fragmentElement = fragmentElement || document.currentScript.closest('.ybs-hero-fragment');

if (fragmentElement) {
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
}
