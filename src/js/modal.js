// Contact modal management
export function initContactModal() {
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
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=james.rarefinder@gmail.com&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank', 'noopener');
  } else {
    const mailto = `mailto:james.rarefinder@gmail.com?body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }
  
  setTimeout(closeModal, 500);
}
