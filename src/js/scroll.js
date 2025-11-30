import { easeInOutQuad, smoothScrollTo, throttle } from './utils.js';

const SCROLL_DURATION = 1800;

// Initialize scroll button behavior
export function initScrollButton() {
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
export function initScrollEffects() {
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
export function initSmoothAnchors() {
  const scrollAnchors = document.querySelectorAll('a[href="#caseStudies"]');
  if (!scrollAnchors || scrollAnchors.length === 0) return;
  
  scrollAnchors.forEach(a => a.addEventListener('click', (ev) => {
    ev.preventDefault();
    const el = document.getElementById('caseStudies');
    if (el) smoothScrollTo(el, SCROLL_DURATION);
  }));
}
