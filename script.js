document.addEventListener('DOMContentLoaded', () => {
  // Debug: record the deploy commit id so we can verify the script version
  try { console.info('Loaded script at commit: 83af991'); } catch (e) { /* ignore */ }
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

  // Form submit via mailto: link (static GitHub Pages; no server-side email delivery)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const email = data.get('email') || '';
      const name = data.get('name') || '';
      const message = data.get('message') || '';
      const subject = name ? `Contact from ${name}` : 'Contact from KenwayRogers.com';
      const body = `From: ${name ? name + ' ' : ''}<${email}>\n\n${message}`;
      const mailto = `mailto:kenwayrogers@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      try { console.info('Triggering mailto:', mailto); } catch (e) { }
      window.location.href = mailto;
      setTimeout(closeModal, 500);
    });
  }

  // Micro interactions on tool icons
  tools.forEach((t, idx) => {
    t.style.transitionDelay = `${idx * 80}ms`;
  });
});
