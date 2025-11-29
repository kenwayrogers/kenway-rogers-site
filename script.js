document.addEventListener('DOMContentLoaded', () => {
  // initialize: no debug logs in production
  const scrollBtn = document.getElementById('scrollDown');
  const heroBg = document.querySelector('.hero-bg');

  // global scroll duration (ms) — increase for a slower feel
  const SCROLL_DURATION = 1800;
  // custom smooth scroll function to control duration (ms)
  function smoothScrollTo(element, duration = SCROLL_DURATION) {
    const nav = document.querySelector('.site-nav');
    const navHeight = nav ? nav.offsetHeight : 0;
    const start = window.scrollY || window.pageYOffset;
    const rect = element.getBoundingClientRect();
    const end = rect.top + start - navHeight; // position element right below nav
    const distance = end - start;
    let startTime = null;

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

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

  // Scroll button - scroll down exactly by hero height (nav is not fixed)
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      const hero = document.querySelector('.hero');
      if (hero) {
        const start = window.scrollY || window.pageYOffset;
        // Scroll target: hero top + hero height (nav does not stay fixed)
        const end = Math.max(0, Math.round(hero.offsetTop + hero.offsetHeight));
        const distance = end - start;
        let startTime = null;

        function easeInOutQuad(t) {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        function animation(currentTime) {
          if (!startTime) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / SCROLL_DURATION, 1);
          const eased = easeInOutQuad(progress);
          window.scrollTo(0, Math.round(start + distance * eased));
          if (timeElapsed < SCROLL_DURATION) requestAnimationFrame(animation);
        }
        requestAnimationFrame(animation);
      }
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
      const resetBtn = wrapper.querySelector('.email-reset');
      if (!mainBtn || !options) return;
      // ensure each options block has an id for aria-controls
      if (!options.id) options.id = `email-options-${Math.random().toString(36).slice(2, 8)}`;
      mainBtn.setAttribute('aria-controls', options.id);

      // role/tabindex/aria for options
      optBtns.forEach((o) => {
        o.setAttribute('role', 'menuitemradio');
        o.setAttribute('tabindex', '-1');
        if (!o.hasAttribute('aria-checked')) o.setAttribute('aria-checked', 'false');
      });

      // load saved preference (optional remember)
      const STORAGE_KEY = 'kr_email_kind';
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // mark saved option as checked
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
        // if user has a saved preference, directly open that, otherwise show menu
        const savedNow = localStorage.getItem(STORAGE_KEY);
        // Alt/Ctrl/Shift click will open the menu even if a preference exists
        if (savedNow && !ev.altKey && !ev.ctrlKey && !ev.shiftKey) {
          const choice = savedNow;
          // 'gmail' opens compose in a new tab
          const data = new FormData(form);
          const email = data.get('email') || '';
          const name = data.get('name') || '';
          const message = data.get('message') || '';
          const subject = name ? `Contact from ${name}` : 'Contact from KenwayRogers.com';
          const body = `From: ${name ? name + ' ' : ''}<${email}>\n\n${message}`;
          if (choice === 'gmail') {
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=kenwayrogers@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(gmailUrl, '_blank', 'noopener');
          } else {
            const mailto = `mailto:kenwayrogers@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailto;
          }
          setTimeout(closeModal, 500);
        } else {
          toggleMenu();
        }
      });

      // keyboard interactions for main button
      mainBtn.addEventListener('keydown', (ev) => {
        if (ev.key === 'ArrowDown') { ev.preventDefault(); toggleMenu(true); optBtns[0]?.focus(); }
        if (ev.key === 'ArrowUp') { ev.preventDefault(); toggleMenu(true); optBtns[optBtns.length-1]?.focus(); }
      });
      // close on outside click
      document.addEventListener('click', (ev) => { if (!wrapper.contains(ev.target)) toggleMenu(false); });
      // escape to close
      document.addEventListener('keyup', (ev) => { if (ev.key === 'Escape') toggleMenu(false); });
      // option behavior (click and keyboard activation)
      optBtns.forEach((btn, idx) => {
        const activate = (ev, remember = true) => {
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
          // set aria-checked state & optionally remember
          optBtns.forEach(o => o.setAttribute('aria-checked', 'false'));
          btn.setAttribute('aria-checked', 'true');
          if (remember) localStorage.setItem(STORAGE_KEY, kind);
          toggleMenu(false);
        setTimeout(closeModal, 500);
        };
        btn.addEventListener('click', (ev) => activate(ev, true));
        btn.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); activate(ev, !ev.shiftKey); }
          else if (ev.key === 'ArrowDown') { ev.preventDefault(); optBtns[(idx+1)%optBtns.length].focus(); }
          else if (ev.key === 'ArrowUp') { ev.preventDefault(); optBtns[(idx-1+optBtns.length)%optBtns.length].focus(); }
          else if (ev.key === 'Home') { ev.preventDefault(); optBtns[0].focus(); }
          else if (ev.key === 'End') { ev.preventDefault(); optBtns[optBtns.length-1].focus(); }
          else if (ev.key === 'Escape') { ev.preventDefault(); toggleMenu(false); mainBtn.focus(); }
        });
      });

      // reset preference behavior
      if (resetBtn) {
        resetBtn.setAttribute('role', 'menuitem');
        resetBtn.setAttribute('tabindex', '-1');
        resetBtn.addEventListener('click', (ev) => {
          ev.preventDefault();
          localStorage.removeItem(STORAGE_KEY);
          optBtns.forEach(o => o.setAttribute('aria-checked', 'false'));
          // close and focus main
          toggleMenu(false);
          mainBtn.focus();
        });
        resetBtn.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); resetBtn.click(); }
          else if (ev.key === 'ArrowDown') { ev.preventDefault(); optBtns[0].focus(); }
          else if (ev.key === 'ArrowUp') { ev.preventDefault(); optBtns[optBtns.length-1].focus(); }
          else if (ev.key === 'Escape') { ev.preventDefault(); toggleMenu(false); mainBtn.focus(); }
        });
      }
    });
  }

  // No hero tool icons; nothing to wire up here

  // Smooth scroll for anchors linking to #caseStudies
  const scrollAnchors = document.querySelectorAll('a[href="#caseStudies"]');
  if (scrollAnchors && scrollAnchors.length) {
      scrollAnchors.forEach(a => a.addEventListener('click', (ev) => {
        ev.preventDefault();
        const el = document.getElementById('caseStudies');
        if (el) smoothScrollTo(el, SCROLL_DURATION);
      }));
  }
});
