document.addEventListener('DOMContentLoaded', () => {
  // initialize: no debug logs in production
  const scrollBtn = document.getElementById('scrollDown');
  const target = document.getElementById('caseStudies');
  const heroBg = document.querySelector('.hero-bg');

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
      window.location.href = mailto;
      setTimeout(closeModal, 500);
    });
    // Email menu: single button shows Gmail/Other options
    const emailWrappers = document.querySelectorAll('.email-menu-wrapper');
    emailWrappers.forEach(wrapper => {
      const mainBtn = wrapper.querySelector('.email-main');
      const options = wrapper.querySelector('.email-options');
      const optBtns = wrapper.querySelectorAll('.email-option');
      if (!mainBtn || !options) return;
      const toggleMenu = (show) => {
        const expanded = show ?? (mainBtn.getAttribute('aria-expanded') === 'true');
        const willOpen = typeof show === 'undefined' ? !expanded : show;
        mainBtn.setAttribute('aria-expanded', willOpen);
        options.setAttribute('aria-hidden', !willOpen);
        if (willOpen) optBtns[0]?.focus();
      };
      mainBtn.addEventListener('click', (ev) => { ev.preventDefault(); toggleMenu(); });
      // close on outside click
      document.addEventListener('click', (ev) => { if (!wrapper.contains(ev.target)) toggleMenu(false); });
      // escape to close
      document.addEventListener('keyup', (ev) => { if (ev.key === 'Escape') toggleMenu(false); });
      // option behavior
      optBtns.forEach(btn => btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        const kind = btn.dataset.kind || 'gmail';
        const data = new FormData(form);
        const email = data.get('email') || '';
        const name = data.get('name') || '';
        const message = data.get('message') || '';
        const subject = name ? `Contact from ${name}` : 'Contact from KenwayRogers.com';
        const body = `From: ${name ? name + ' ' : ''}<${email}>\n\n${message}`;
        if (kind === 'gmail') {
          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=kenwayrogers@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          window.open(gmailUrl, '_blank', 'noopener');
        } else {
          const mailto = `mailto:kenwayrogers@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          window.location.href = mailto;
        }
        toggleMenu(false);
        setTimeout(closeModal, 500);
      }));
    });
  }

  // No hero tool icons; nothing to wire up here

  // Smooth scroll for anchors linking to #caseStudies
  const scrollAnchors = document.querySelectorAll('a[href="#caseStudies"]');
  if (scrollAnchors && scrollAnchors.length) {
    scrollAnchors.forEach(a => a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const el = document.getElementById('caseStudies');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }));
  }
});
