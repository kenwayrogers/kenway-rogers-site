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
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const message = data.get('message') || '';
    const subject = 'Contact from KenwayRogers.com';
    const body = message;
    const mailto = `mailto:kenwayrogers@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setTimeout(closeModal, 500);
  });

  initEmailMenu(form, closeModal);
}

// Initialize email menu dropdown
function initEmailMenu(form, closeModal) {
  const emailWrappers = document.querySelectorAll('.email-menu-wrapper');
  
  emailWrappers.forEach(wrapper => {
    const mainBtn = wrapper.querySelector('.email-main');
    const options = wrapper.querySelector('.email-options');
    const optBtns = wrapper.querySelectorAll('.email-option');
    const resetBtn = wrapper.querySelector('.email-reset');
    
    if (!mainBtn || !options) return;

    // Ensure options block has an id for aria-controls
    if (!options.id) {
      options.id = `email-options-${Math.random().toString(36).slice(2, 8)}`;
    }
    mainBtn.setAttribute('aria-controls', options.id);

    // Setup ARIA attributes for options
    optBtns.forEach((o) => {
      o.setAttribute('role', 'menuitemradio');
      o.setAttribute('tabindex', '-1');
      if (!o.hasAttribute('aria-checked')) o.setAttribute('aria-checked', 'false');
    });

    // Load saved preference
    const STORAGE_KEY = 'kr_email_kind';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      optBtns.forEach(o => o.setAttribute('aria-checked', (o.dataset.kind === saved).toString()));
    }

    const toggleMenu = (show) => {
      const expanded = show ?? (mainBtn.getAttribute('aria-expanded') === 'true');
      const willOpen = typeof show === 'undefined' ? !expanded : show;
      mainBtn.setAttribute('aria-expanded', willOpen);
      options.setAttribute('aria-hidden', !willOpen);
      if (willOpen) optBtns[0]?.focus();
    };

    mainBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      const savedNow = localStorage.getItem(STORAGE_KEY);
      
      // Alt/Ctrl/Shift click opens menu even if preference exists
      if (savedNow && !ev.altKey && !ev.ctrlKey && !ev.shiftKey) {
        openEmail(form, savedNow, closeModal);
      } else {
        toggleMenu();
      }
    });

    // Keyboard interactions for main button
    mainBtn.addEventListener('keydown', (ev) => {
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
      const activate = (ev, remember = true) => {
        ev.preventDefault();
        const kind = btn.dataset.kind || 'gmail';
        openEmail(form, kind, closeModal);
        
        // Set aria-checked state & optionally remember
        optBtns.forEach(o => o.setAttribute('aria-checked', 'false'));
        btn.setAttribute('aria-checked', 'true');
        if (remember) localStorage.setItem(STORAGE_KEY, kind);
        toggleMenu(false);
      };
      
      btn.addEventListener('click', (ev) => activate(ev, true));
      btn.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { 
          ev.preventDefault(); 
          activate(ev, !ev.shiftKey); 
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
          mainBtn.focus(); 
        }
      });
    });

    // Reset preference button
    if (resetBtn) {
      resetBtn.setAttribute('role', 'menuitem');
      resetBtn.setAttribute('tabindex', '-1');
      resetBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        localStorage.removeItem(STORAGE_KEY);
        optBtns.forEach(o => o.setAttribute('aria-checked', 'false'));
        toggleMenu(false);
        mainBtn.focus();
      });
      
      resetBtn.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { 
          ev.preventDefault(); 
          resetBtn.click(); 
        }
        else if (ev.key === 'ArrowDown') { 
          ev.preventDefault(); 
          optBtns[0].focus(); 
        }
        else if (ev.key === 'ArrowUp') { 
          ev.preventDefault(); 
          optBtns[optBtns.length-1].focus(); 
        }
        else if (ev.key === 'Escape') { 
          ev.preventDefault(); 
          toggleMenu(false); 
          mainBtn.focus(); 
        }
      });
    }
  });
}

// Open email client
function openEmail(form, kind, closeModal) {
  const data = new FormData(form);
  const message = data.get('message') || '';
  const subject = 'Contact from KenwayRogers.com';
  const body = message;
  
  if (kind === 'gmail') {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=kenwayrogers@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank', 'noopener');
  } else {
    const mailto = `mailto:kenwayrogers@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
  
  // Close on overlay click (but not on image)
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
      closeLightbox();
    }
  });

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
