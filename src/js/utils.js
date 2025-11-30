// Easing function for smooth animations
export function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Custom smooth scroll function with configurable duration
export function smoothScrollTo(element, duration = 1800) {
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
