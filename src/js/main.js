import { initScrollButton, initScrollEffects, initSmoothAnchors } from './scroll.js';
import { initContactModal } from './modal.js';
import { initLightbox } from './lightbox.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollButton();
  initScrollEffects();
  initSmoothAnchors();
  initContactModal();
  initLightbox();
});
