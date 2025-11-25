document.addEventListener('DOMContentLoaded', () => {
  const scrollBtn = document.getElementById('scrollDown');
  const target = document.getElementById('caseStudies');
  const heroBg = document.querySelector('.hero-bg');
  const tools = document.querySelectorAll('.tool-icon');

  if (scrollBtn && target) {
    scrollBtn.addEventListener('click', () => {
      target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Parallax effect for hero background
  const onScroll = () => {
    const scrolled = window.scrollY;
    if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.2}px)`;
    // simple reveal for cards
    const cards = document.querySelectorAll('.card');
    for (const c of cards) {
      const rect = c.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) c.classList.add('in-view');
    }
  };
  window.addEventListener('scroll', onScroll);
  // initial call to reveal any cards on load
  onScroll();

  // Contact modal behavior
  const contactBtns = document.querySelectorAll('.contact-open');
  const modal = document.getElementById('contactModal');
  const overlay = document.querySelector('.modal-overlay');
  const closeBtn = modal?.querySelector('.modal-close');
  const form = document.getElementById('contactForm');

  function openModal() {
    if (!modal || !overlay) return;
    overlay.classList.add('open');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    // focus the first input
    const trigger = modal.querySelector('input, textarea, button');
    if (trigger) trigger.focus();
  }

  function closeModal() {
    if (!modal || !overlay) return;
    overlay.classList.remove('open');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
  }

  contactBtns.forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); openModal(); }));
  if (overlay) overlay.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keyup', (e) => { if (e.key === 'Escape') closeModal(); });

  // Form submit via AJAX to Netlify Forms
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      // Convert to urlencoded for Netlify
      const encode = (d) => {
        const params = new URLSearchParams();
        for (const [key, value] of d.entries()) params.append(key, value);
        return params.toString();
      };
      const statusEl = form.querySelector('.form-status');
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode(data),
        });
        if (res.ok) {
          statusEl.textContent = 'Thanks! Your message has been sent.';
          form.reset();
          setTimeout(closeModal, 1600);
        } else {
          statusEl.textContent = 'There was a problem sending your message. Try again later.';
        }
      } catch (err) {
        statusEl.textContent = 'There was a problem sending your message. Try again later.';
      }
    });
  }

  // Micro interactions on tool icons
  tools.forEach((t, idx) => {
    t.style.transitionDelay = `${idx * 80}ms`;
  });
});
const scrollBtn = document.getElementById("scrollDown");
const target = document.getElementById("caseStudies");


scrollBtn.addEventListener("click", () => {
target.scrollIntoView({ behavior: "smooth" });
});
