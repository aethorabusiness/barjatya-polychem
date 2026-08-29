/**
 * BARJATYA POLYCHEM (BP) - CORE APPLICATION & MOTION CONTROLLER
 * High-performance, uninhibited native scrolling, IntersectionObserver reveals,
 * Editorial Hero Slider, Synchronized Product Showcase, Sticky Manufacturing Story,
 * and Application Rail.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Initialize Aeronex-Style Viewport Reveals
  initScrollReveals();

  // 2. Initialize Editorial Hero Image Slider
  initHeroSlider();

  // 3. Initialize Synchronized Product Showcase (Homepage)
  initProductShowcase();

  // 4. Initialize Sticky Manufacturing Process Observer
  initManufacturingObserver();

  // 5. Initialize Horizontal Application Rail (Drag & Touch)
  initAppRail();

  // 6. Initialize Mobile Drawer & Navigation
  initMobileNav();

  // 7. Initialize RFQ Modal & B2B Inquiry Handlers
  initRfqModal();
  initInquiryForms();
});

/**
 * Viewport Reveal Observer (Aeronex-Style clip-path & text reveals)
 */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-image, .reveal-text');
  if (!reveals.length) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => revealObserver.observe(el));
}

/**
 * Editorial Hero Slider Engine (Stable text, rotating industrial visual)
 */
function initHeroSlider() {
  const stage = document.querySelector('.hero-slider-stage');
  if (!stage) return;

  const slides = stage.querySelectorAll('.hero-slide');
  const currentCount = document.getElementById('heroSlideCurrent');
  const totalCount = document.getElementById('heroSlideTotal');
  const prevBtn = document.getElementById('heroSliderPrev');
  const nextBtn = document.getElementById('heroSliderNext');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const slideCount = slides.length;
  const AUTOPLAY_INTERVAL = 6000;

  if (totalCount) {
    totalCount.textContent = String(slideCount).padStart(2, '0');
  }

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    currentIndex = (index + slideCount) % slideCount;
    slides[currentIndex].classList.add('active');

    if (currentCount) {
      currentCount.textContent = String(currentIndex + 1).padStart(2, '0');
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Event Listeners
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

  stage.addEventListener('mouseenter', stopAutoplay);
  stage.addEventListener('mouseleave', startAutoplay);
  stage.addEventListener('focusin', stopAutoplay);
  stage.addEventListener('focusout', startAutoplay);

  // Keyboard navigation
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { nextSlide(); startAutoplay(); }
    if (e.key === 'ArrowLeft') { prevSlide(); startAutoplay(); }
  });

  // Mobile Touch Swipe
  let touchStartX = 0;
  let touchEndX = 0;

  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAutoplay();
  }, { passive: true });

  startAutoplay();
}

/**
 * Synchronized Product Showcase (Homepage Tab-to-Image Controller)
 */
function initProductShowcase() {
  const wrapper = document.querySelector('.product-showcase-wrapper');
  if (!wrapper) return;

  const tabs = wrapper.querySelectorAll('.product-tab-item');
  const images = wrapper.querySelectorAll('.product-showcase-img');

  tabs.forEach(tab => {
    tab.addEventListener('mouseenter', () => activateTab(tab));
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('focus', () => activateTab(tab));
  });

  function activateTab(activeTab) {
    const target = activeTab.dataset.productTarget;
    if (!target) return;

    tabs.forEach(t => t.classList.remove('active'));
    activeTab.classList.add('active');

    images.forEach(img => {
      if (img.dataset.productId === target) {
        img.classList.add('active');
      } else {
        img.classList.remove('active');
      }
    });
  }
}

/**
 * Sticky Manufacturing Step Observer (Homepage / Manufacturing Page)
 */
function initManufacturingObserver() {
  const steps = document.querySelectorAll('.mfg-step-card');
  const stickyMediaImg = document.querySelector('.manufacturing-sticky-media img');
  if (!steps.length || !stickyMediaImg) return;

  const stepImages = [
    'assets/images/plant_extrusion.jpg',
    'assets/images/plant_extrusion.jpg',
    'assets/images/plant_extrusion.jpg',
    'assets/images/colour_masterbatch.jpg',
    'assets/images/quality_laboratory.jpg',
    'assets/images/white_masterbatch.jpg'
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        steps.forEach(s => s.classList.remove('active'));
        entry.target.classList.add('active');

        const stepIndex = parseInt(entry.target.dataset.stepIndex || '0', 10);
        if (stepImages[stepIndex]) {
          stickyMediaImg.src = stepImages[stepIndex];
        }
      }
    });
  }, { threshold: 0.6 });

  steps.forEach(step => observer.observe(step));
}

/**
 * Horizontal Application Rail with Mouse Drag and Touch Scroll
 */
function initAppRail() {
  const track = document.querySelector('.app-rail-track');
  if (!track) return;

  const prevBtn = document.getElementById('appRailPrev');
  const nextBtn = document.getElementById('appRailNext');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -340, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 340, behavior: 'smooth' });
    });
  }

  // Mouse Drag support
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
}

/**
 * Mobile Navigation Drawer
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle-btn');
  const closeBtn = document.querySelector('.mobile-close-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Accordion inside mobile drawer
  const accordions = drawer.querySelectorAll('.mobile-accordion-btn');
  accordions.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const subMenu = btn.nextElementSibling;
      if (subMenu) {
        subMenu.classList.toggle('open');
      }
    });
  });
}

/**
 * RFQ Modal Dialog Handlers
 */
function initRfqModal() {
  const modal = document.getElementById('rfqModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const openButtons = document.querySelectorAll('[data-open-rfq]');
  const productSelect = document.getElementById('rfqProductSelect');

  function openModal(prefillProduct = '') {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (productSelect && prefillProduct) {
      productSelect.value = prefillProduct;
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prod = btn.getAttribute('data-product') || '';
      openModal(prod);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * B2B RFQ Form Submission Simulator
 */
function initInquiryForms() {
  const forms = document.querySelectorAll('[data-b2b-form]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusBox = form.closest('.modal-body, .section')?.querySelector('.form-status') || form.querySelector('.form-status');
      
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting Inquiry...';
      }

      setTimeout(() => {
        if (statusBox) {
          statusBox.textContent = 'Thank you. Your technical requirement has been submitted to the Barjatya Polychem formulation desk. Our engineering team will review and contact you with specifications and sample availability.';
          statusBox.className = 'form-status success';
          statusBox.style.display = 'block';
        }
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Transmit Enquiry';
        }
      }, 700);
    });
  });
}
