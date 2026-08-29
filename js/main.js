/**
 * BARJATYA POLYCHEM (BP) - INDUSTRIAL CORE JAVASCRIPT
 * Professional interaction logic for B2B portal, RFQ modal, Application Matrix & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initStatsCounter();
  initRfqModal();
  initApplicationFilter();
  initInquiryForms();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER & SCROLL BEHAVIOR
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER & ACCORDIONS
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle-btn');
  const closeBtn = document.querySelector('.mobile-close-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Mobile Accordion Items
  const accordionTriggers = drawer.querySelectorAll('.mobile-accordion-btn');
  accordionTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = btn.closest('.mobile-nav-item');
      if (parentItem) {
        parentItem.classList.toggle('expanded');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. ANIMATED STATISTICS COUNTER
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-number[data-count]');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const duration = 1200; // ms
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out curve
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = start + (target - start) * easeOut;

          if (Number.isInteger(target)) {
            el.textContent = Math.floor(current).toLocaleString();
          } else {
            el.textContent = current.toFixed(1);
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target.toLocaleString();
          }
        };

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  statElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. RFQ / SAMPLE REQUEST MODAL CONTROLLER
   -------------------------------------------------------------------------- */
function initRfqModal() {
  const modal = document.querySelector('#rfqModal');
  if (!modal) return;

  const openTriggers = document.querySelectorAll('[data-open-rfq]');
  const closeBtn = modal.querySelector('.modal-close-btn');
  const productSelect = modal.querySelector('#rfqProductSelect');

  const openModal = (productName = '') => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (productSelect && productName) {
      // Find matching option
      Array.from(productSelect.options).forEach(opt => {
        if (opt.value.toLowerCase().includes(productName.toLowerCase()) || 
            opt.text.toLowerCase().includes(productName.toLowerCase())) {
          opt.selected = true;
        }
      });
    }
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  openTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const product = trigger.getAttribute('data-product') || '';
      openModal(product);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE APPLICATION FILTER MATRIX
   -------------------------------------------------------------------------- */
function initApplicationFilter() {
  const filterButtons = document.querySelectorAll('.app-filter-btn');
  const appCards = document.querySelectorAll('.app-card, .app-matrix-card');

  if (!filterButtons.length || !appCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      appCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. B2B ENQUIRY & RFQ FORM SUBMISSION HANDLER
   -------------------------------------------------------------------------- */
function initInquiryForms() {
  const forms = document.querySelectorAll('form[data-b2b-form]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit Enquiry';
      const statusBox = form.querySelector('.form-status');

      // Basic client-side validation
      const requiredInputs = form.querySelectorAll('[required]');
      let isValid = true;

      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#C0392B';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!isValid) {
        if (statusBox) {
          statusBox.className = 'form-status error';
          statusBox.textContent = 'Please fill out all mandatory fields.';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Transmitting Enquiry...';
      }

      // Simulate instantaneous enterprise dispatch
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        if (statusBox) {
          statusBox.className = 'form-status success';
          statusBox.innerHTML = '<strong>Enquiry Transmitted Successfully.</strong><br>Our technical formulation team in Jaipur will review your requirements and respond within 24 hours. For urgent needs, call +91 9314657754.';
        }

        form.reset();

        // If inside a modal, keep open briefly then optionally close
      }, 700);
    });
  });
}

/* --------------------------------------------------------------------------
   7. SMOOTH SCROLL FOR IN-PAGE ANCHORS
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
