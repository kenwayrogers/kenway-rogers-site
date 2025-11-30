// Image lightbox functionality
export function initLightbox() {
  const lightboxLinks = document.querySelectorAll('.image-lightbox');
  const lightboxOverlay = document.querySelector('.lightbox-overlay');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');

  if (!lightboxOverlay) return;

  // Open lightbox
  lightboxLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const imageSrc = link.getAttribute('href');
      const caption = link.getAttribute('data-caption') || '';
      const altText = link.querySelector('img')?.getAttribute('alt') || '';
      
      lightboxImage.src = imageSrc;
      lightboxImage.alt = altText;
      lightboxCaption.textContent = caption;
      lightboxOverlay.classList.add('active');
      lightboxOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightboxOverlay.classList.remove('active');
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  
  // Close on any click anywhere in the lightbox
  lightboxOverlay.addEventListener('click', closeLightbox);

  // Close lightbox on Escape (exported for use in modal.js)
  return { closeLightbox };
}
