/**
 * BARJATYA POLYCHEM (BP) - INDUSTRIAL CORE JAVASCRIPT
 * Professional interaction engine: Editorial Hero Slider, Synchronized Product Showcase,
 * Application Matrix, B2B RFQ Controller & Touch Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initHeroSlider();
  initProductShowcase();
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

  // Mobile Accordions
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
   3. EDITORIAL HERO IMAGE SLIDER WITH TOUCH SWIPE & ACCESSIBILITY
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const stage = document.querySelector('.hero-slider-stage');
  if (!stage) return;

  const slides = stage.querySelectorAll('.hero-slide');
  const currentCounter = document.querySelector('#heroSlideCurrent');
  const totalCounter = document.querySelector('#heroSlideTotal');
  const prevBtn = document.querySelector('#heroSliderPrev');
  const nextBtn = document.querySelector('#heroSliderNext');

  if (!slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;
  const autoplayDuration = 6000; // 6 seconds per slide

  if (totalCounter) {
    totalCounter.textContent = totalSlides < 10 ? `0${totalSlides}` : `${totalSlides}`;
  }

  const updateSlide = (newIndex, direction = 'next') => {
    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev');
      if (idx === newIndex) {
        slide.classList.add('active');
      } else if (idx === currentIndex) {
        slide.classList.add('prev');
      }
    });

    currentIndex = newIndex;

    if (currentCounter) {
      const displayNum = currentIndex + 1;
      currentCounter.textContent = displayNum < 10 ? `0${displayNum}` : `${displayNum}`;
    }
  };

  const nextSlide = () => {
    const nextIdx = (currentIndex + 1) % totalSlides;
    updateSlide(nextIdx, 'next');
  };

  const prevSlide = () => {
    const prevIdx = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlide(prevIdx, 'prev');
  };

  // Autoplay handler
  const startAutoplay = () => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, autoplayDuration);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  // Pause on hover or keyboard focus
  stage.addEventListener('mouseenter', stopAutoplay);
  stage.addEventListener('mouseleave', startAutoplay);
  stage.addEventListener('focusin', stopAutoplay);
  stage.addEventListener('focusout', startAutoplay);

  // Keyboard navigation
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
      startAutoplay();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      startAutoplay();
    }
  });

  // Touch Swipe Handling (Mobile / Tablet)
  let touchStartX = 0;
  let touchEndX = 0;

  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 45) {
      if (swipeDistance < 0) {
        nextSlide(); // Swiped left -> Next
      } else {
        prevSlide(); // Swiped right -> Prev
      }
    }
    startAutoplay();
  }, { passive: true });

  // Initialize first slide and start timer
  updateSlide(0);
  startAutoplay();
}

/* --------------------------------------------------------------------------
   4. SYNCHRONIZED PRODUCT SHOWCASE (HOMEPAGE)
   -------------------------------------------------------------------------- */
function initProductShowcase() {
  const tabItems = document.querySelectorAll('.product-tab-item');
  const showcaseImgs = document.querySelectorAll('.product-showcase-img');

  if (!tabItems.length || !showcaseImgs.length) return;

  tabItems.forEach((tab, index) => {
    const activateTab = () => {
      tabItems.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-product-target');
      showcaseImgs.forEach(img => {
        if (img.getAttribute('data-product-id') === targetId) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
    };

    tab.addEventListener('click', activateTab);
    tab.addEventListener('mouseenter', activateTab);
  });
}

/* --------------------------------------------------------------------------
   5. ANIMATED STATISTICS COUNTER
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
   6. RFQ / SAMPLE REQUEST MODAL CONTROLLER
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
   7. INTERACTIVE APPLICATION FILTER MATRIX
   -------------------------------------------------------------------------- */
function initApplicationFilter() {
  const filterButtons = document.querySelectorAll('.app-filter-btn');
  const appCards = document.querySelectorAll('.app-card, .app-matrix-card');

  if (!filterButtons.length || !appCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

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
   8. B2B ENQUIRY & RFQ FORM SUBMISSION HANDLER
   -------------------------------------------------------------------------- */
function initInquiryForms() {
  const forms = document.querySelectorAll('form[data-b2b-form]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit Enquiry';
      const statusBox = form.querySelector('.form-status');

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

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        if (statusBox) {
          statusBox.className = 'form-status success';
          statusBox.innerHTML = '<strong>Enquiry Transmitted Successfully.</strong><br>Our technical formulation team in Jaipur will review your requirements and respond within 24 hours. For direct inquiries, call +91 9314657754.';
        }

        form.reset();
      }, 700);
    });
  });
}

/* --------------------------------------------------------------------------
   9. SMOOTH SCROLL FOR IN-PAGE ANCHORS
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
