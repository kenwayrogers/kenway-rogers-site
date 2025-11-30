import { initScrollButton, initScrollEffects, initSmoothAnchors } from './scroll.js';
import { initContactModal } from './modal.js';
import { initLightbox } from './lightbox.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollButton();
  initScrollEffects();
  initSmoothAnchors();
  initContactModal();
  const lightbox = initLightbox();
  
  // Consolidated Escape key handler
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      // Close lightbox if active
      if (lightbox && document.querySelector('.lightbox-overlay.active')) {
        lightbox.closeLightbox();
      }
    }
  });
});
