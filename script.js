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

  // Form submit via AJAX to Netlify function (SendGrid)
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());
      const statusEl = form.querySelector('.form-status');
      statusEl.textContent = '';
      try {
        const res = await fetch('/.netlify/functions/send-contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) {
          statusEl.textContent = 'Thanks! Your message has been sent.';
          statusEl.style.color = '#2b6a2b';
          form.reset();
          setTimeout(closeModal, 1400);
        } else {
          statusEl.textContent = 'There was a problem sending your message. ' + (json && json.error ? json.error : 'Try again later.');
          statusEl.style.color = '#8a2b2b';
        }
      } catch (err) {
        statusEl.textContent = 'There was a problem sending your message. Try again later.';
        statusEl.style.color = '#8a2b2b';
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
