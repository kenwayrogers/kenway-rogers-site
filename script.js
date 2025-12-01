// Bundled from modular sources in src/js/
// To modify, edit files in src/js/ and run: node bundle-js.js

(function() {
  'use strict';

  // ===== utils.js =====
  // Easing function for smooth animations
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Throttle function for performance
function throttle(func, wait) {
  let waiting = false;
  return function(...args) {
    if (!waiting) {
      func.apply(this, args);
      waiting = true;
      setTimeout(() => { waiting = false; }, wait);
    }
  };
}

// Custom smooth scroll function with configurable duration
function smoothScrollTo(element, duration = 1800) {
  const nav = document.querySelector('.site-nav');
  const navHeight = nav ? nav.offsetHeight : 0;
  const start = window.scrollY || window.pageYOffset;
  const rect = element.getBoundingClientRect();
  const end = rect.top + start - navHeight;
  const distance = end - start;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const eased = easeInOutQuad(progress);
    window.scrollTo(0, Math.round(start + distance * eased));
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }
  requestAnimationFrame(animation);
}


  // ===== scroll.js =====
  
const SCROLL_DURATION = 1800;

// Initialize scroll button behavior
function initScrollButton() {
  const scrollBtn = document.getElementById('scrollDown');
  
  if (!scrollBtn) return;
  
  scrollBtn.addEventListener('click', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const start = window.scrollY || window.pageYOffset;
    const end = Math.max(0, Math.round(hero.offsetTop + hero.offsetHeight));
    const distance = end - start;
    let startTime = null;

    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / SCROLL_DURATION, 1);
      const eased = easeInOutQuad(progress);
      window.scrollTo(0, Math.round(start + distance * eased));
      if (timeElapsed < SCROLL_DURATION) requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
  });
}

// Initialize parallax and card reveal effects
function initScrollEffects() {
  const heroBgImg = document.querySelector('.hero-bg-img');
  
  const onScroll = () => {
    const scrolled = window.scrollY;
    if (heroBgImg) heroBgImg.style.transform = `translateY(${scrolled * 0.2}px)`;
    
    // Simple reveal for cards
    const cards = document.querySelectorAll('.card');
    for (const c of cards) {
      const rect = c.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) c.classList.add('in-view');
    }
  };
  
  window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });
  onScroll(); // Initial call to reveal any cards on load
}

// Initialize smooth scroll for anchor links
function initSmoothAnchors() {
  const scrollAnchors = document.querySelectorAll('a[href="#caseStudies"]');
  if (!scrollAnchors || scrollAnchors.length === 0) return;
  
  scrollAnchors.forEach(a => a.addEventListener('click', (ev) => {
    ev.preventDefault();
    const el = document.getElementById('caseStudies');
    if (el) smoothScrollTo(el, SCROLL_DURATION);
  }));
}


  // ===== modal.js =====
  // Contact modal management
function initContactModal() {
  const contactBtns = document.querySelectorAll('.contact-open');
  const modal = document.getElementById('contactModal');
  const overlay = document.querySelector('.modal-overlay');
  const closeBtn = modal?.querySelector('.modal-close');
  const form = document.getElementById('contactForm');

  if (!modal || !overlay) return;

  function openModal() {
    overlay.classList.add('open');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    const trigger = modal.querySelector('input, textarea, button');
    if (trigger) trigger.focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
  }

  contactBtns.forEach(btn => btn.addEventListener('click', e => { 
    e.preventDefault(); 
    openModal(); 
  }));
  
  if (overlay) overlay.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  
  // Handle Escape key for modal
  const handleEscape = (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  };
  document.addEventListener('keyup', handleEscape);

  if (form) initContactForm(form, closeModal);
}

// Initialize contact form with email menu
function initContactForm(form, closeModal) {
  // Remove the old form submit handler since we're using direct button clicks now
  initEmailMenu(form, closeModal);
}

// Initialize email menu dropdown
function initEmailMenu(form, closeModal) {
  const emailWrappers = document.querySelectorAll('.email-menu-wrapper');
  
  emailWrappers.forEach(wrapper => {
    const mainBtn = wrapper.querySelector('.email-main');
    const toggleBtn = wrapper.querySelector('.email-dropdown-toggle');
    const options = wrapper.querySelector('.email-options');
    const optBtns = wrapper.querySelectorAll('.email-option');
    
    if (!mainBtn || !toggleBtn || !options) return;

    // Ensure options block has an id for aria-controls
    if (!options.id) {
      options.id = `email-options-${Math.random().toString(36).slice(2, 8)}`;
    }
    toggleBtn.setAttribute('aria-controls', options.id);

    // Main button clicks Gmail directly
    mainBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      openEmail(form, 'gmail', closeModal);
    });

    const toggleMenu = (show) => {
      const expanded = show ?? (toggleBtn.getAttribute('aria-expanded') === 'true');
      const willOpen = typeof show === 'undefined' ? !expanded : show;
      toggleBtn.setAttribute('aria-expanded', willOpen);
      options.setAttribute('aria-hidden', !willOpen);
      if (willOpen) optBtns[0]?.focus();
    };

    // Toggle button opens dropdown
    toggleBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      toggleMenu();
    });

    // Keyboard interactions for toggle button
    toggleBtn.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowDown') { 
        ev.preventDefault(); 
        toggleMenu(true); 
        optBtns[0]?.focus(); 
      }
      if (ev.key === 'ArrowUp') { 
        ev.preventDefault(); 
        toggleMenu(true); 
        optBtns[optBtns.length-1]?.focus(); 
      }
    });

    // Close on outside click
    document.addEventListener('click', (ev) => { 
      if (!wrapper.contains(ev.target)) toggleMenu(false); 
    });

    // Option button behaviors
    optBtns.forEach((btn, idx) => {
      const activate = (ev) => {
        ev.preventDefault();
        const kind = btn.dataset.kind || 'other';
        openEmail(form, kind, closeModal);
        toggleMenu(false);
      };
      
      btn.addEventListener('click', (ev) => activate(ev));
      btn.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { 
          ev.preventDefault(); 
          activate(ev); 
        }
        else if (ev.key === 'ArrowDown') { 
          ev.preventDefault(); 
          optBtns[(idx+1)%optBtns.length].focus(); 
        }
        else if (ev.key === 'ArrowUp') { 
          ev.preventDefault(); 
          optBtns[(idx-1+optBtns.length)%optBtns.length].focus(); 
        }
        else if (ev.key === 'Home') { 
          ev.preventDefault(); 
          optBtns[0].focus(); 
        }
        else if (ev.key === 'End') { 
          ev.preventDefault(); 
          optBtns[optBtns.length-1].focus(); 
        }
        else if (ev.key === 'Escape') { 
          ev.preventDefault(); 
          toggleMenu(false); 
          toggleBtn.focus(); 
        }
      });
    });
  });
}

// Open email client
function openEmail(form, kind, closeModal) {
  const data = new FormData(form);
  const message = data.get('message') || '';
  const body = message;
  
  if (kind === 'gmail') {
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=kenwayrogers@gmail.com&body=${encodeURIComponent(body)}`;
    const gmailAppUrl = `googlegmail://co?to=kenwayrogers@gmail.com&body=${encodeURIComponent(body)}`;
    
    // On mobile, try Gmail app first, then fall back to web
    // Create an invisible iframe to test the app URL
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    let appOpened = false;
    
    // Listen for visibility change (app opening will hide the page)
    const visibilityHandler = () => {
      if (document.hidden) {
        appOpened = true;
      }
    };
    document.addEventListener('visibilitychange', visibilityHandler);
    
    // Try the app URL
    iframe.src = gmailAppUrl;
    
    // After a short delay, open web version if app didn't open
    setTimeout(() => {
      document.removeEventListener('visibilitychange', visibilityHandler);
      document.body.removeChild(iframe);
      
      if (!appOpened) {
        // App didn't open, use web version
        window.open(gmailWebUrl, '_blank', 'noopener');
      }
    }, 500);
  } else {
    // For other email clients, use mailto
    const mailto = `mailto:kenwayrogers@gmail.com?body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }
  
  setTimeout(closeModal, 500);
}


  // ===== lightbox.js =====
  // Image lightbox functionality
function initLightbox() {
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


  // ===== main.js (initialization) =====
  
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

})();
