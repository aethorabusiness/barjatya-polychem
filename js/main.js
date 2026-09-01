/**
 * BARJATYA POLYCHEM (BP) - CORE APPLICATION & MOTION CONTROLLER
 * Homepage V2 Video-First Industrial Experience Engine
 * Fast native scrolling, synchronized 4-scene hero video sequencer,
 * transparent-to-solid header, interactive product presentation,
 * sticky manufacturing storytelling, and horizontal application rail.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Initialize Viewport Reveals
  initScrollReveals();

  // 2. Initialize Full-Screen Hero Video 4-Scene Sequencer
  initHeroVideoSequencer();

  // 3. Initialize Transparent-to-Solid Header & Hero Scroll Depth
  initScrollHeader();

  // 4. Initialize Interactive Product Presentation (Left Nav, Right Sliding Visual)
  initProductShowcase();

  // 5. Initialize Sticky Manufacturing Lifecycle Observer
  initManufacturingObserver();

  // 6. Initialize Horizontal Application Rail (Drag & Touch)
  initAppRail();

  // 7. Initialize Mobile Navigation Drawer
  initMobileNav();

  // 8. Initialize B2B RFQ Modal & Form Handlers
  initRfqModal();
  initInquiryForms();
});

/**
 * Viewport Reveal Observer (Aeronex-Style clip-path & text reveals)
 */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-image, .reveal-text');
  if (!reveals.length) return;

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
 * Hero Video 4-Scene Sequencer (0-4s, 4-8s, 8-12s, 12-16s loop)
 */
function initHeroVideoSequencer() {
  const heroStage = document.querySelector('.hero-video-stage');
  if (!heroStage) return;

  const video = heroStage.querySelector('.hero-video-bg');
  const scenes = heroStage.querySelectorAll('.hero-scene-item');
  const indicators = heroStage.querySelectorAll('.hero-indicator-btn');

  if (!scenes.length) return;

  const SCENE_DURATION = 4; // 4 seconds per scene
  const TOTAL_SCENES = scenes.length; // 4 scenes = 16 seconds total
  let currentSceneIdx = 0;
  let fallbackTimer = null;

  function setActiveScene(idx, progressRatio = 0) {
    currentSceneIdx = idx;

    scenes.forEach((scene, i) => {
      if (i === idx) {
        scene.classList.add('active');
      } else {
        scene.classList.remove('active');
      }
    });

    indicators.forEach((btn, i) => {
      const fillBar = btn.querySelector('.hero-indicator-fill');
      if (i === idx) {
        btn.classList.add('active');
        if (fillBar) fillBar.style.width = `${Math.min(100, Math.max(0, progressRatio * 100))}%`;
      } else if (i < idx) {
        btn.classList.remove('active');
        if (fillBar) fillBar.style.width = '100%';
      } else {
        btn.classList.remove('active');
        if (fillBar) fillBar.style.width = '0%';
      }
    });
  }

  // Video timeupdate handler
  if (video) {
    video.addEventListener('timeupdate', () => {
      const curTime = video.currentTime % (SCENE_DURATION * TOTAL_SCENES);
      const sceneIdx = Math.min(TOTAL_SCENES - 1, Math.floor(curTime / SCENE_DURATION));
      const sceneProgress = (curTime % SCENE_DURATION) / SCENE_DURATION;

      setActiveScene(sceneIdx, sceneProgress);
    });

    // Fallback if autoplay is restricted
    video.play().catch(() => {
      startFallbackTimer();
    });
  } else {
    startFallbackTimer();
  }

  function startFallbackTimer() {
    if (fallbackTimer) clearInterval(fallbackTimer);
    let sec = 0;
    fallbackTimer = setInterval(() => {
      sec = (sec + 1) % (SCENE_DURATION * TOTAL_SCENES);
      const idx = Math.floor(sec / SCENE_DURATION);
      const prog = (sec % SCENE_DURATION) / SCENE_DURATION;
      setActiveScene(idx, prog);
    }, 1000);
  }

  // Click on indicators seeks video / switches scene
  indicators.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetScene = parseInt(btn.dataset.sceneIndex || '0', 10);
      if (video && !isNaN(video.duration)) {
        video.currentTime = targetScene * SCENE_DURATION;
      }
      setActiveScene(targetScene, 0);
    });
  });

  // Initial state
  setActiveScene(0, 0);
}

/**
 * Transparent-to-Solid Header and Hero Scroll Depth Transition
 */
function initScrollHeader() {
  const header = document.querySelector('.site-header');
  const heroVideoBg = document.querySelector('.hero-video-bg');
  if (!header) return;

  let ticking = false;

  function updateHeader() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header solid/transparent toggle
    if (scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    // Hero video subtle depth scale on scroll (performance-optimized transform)
    if (heroVideoBg && scrollY < window.innerHeight) {
      const factor = scrollY / window.innerHeight;
      const scale = 1.02 - factor * 0.05; // 1.02 -> 0.97
      const opacity = 1 - factor * 0.08;  // 1.0 -> 0.92
      heroVideoBg.style.transform = `scale(${scale})`;
      heroVideoBg.style.opacity = `${opacity}`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // Initial run
  updateHeader();
}

/**
 * Interactive Product Presentation (Left Navigation Tabs, Right Sliding Visual)
 */
function initProductShowcase() {
  const wrapper = document.querySelector('.product-showcase-wrapper');
  if (!wrapper) return;

  const tabs = wrapper.querySelectorAll('.product-tab-item');
  const slides = wrapper.querySelectorAll('.product-showcase-slide');

  if (!tabs.length || !slides.length) return;

  function activateTab(activeTab) {
    const target = activeTab.dataset.productTarget;
    if (!target) return;

    tabs.forEach(t => t.classList.remove('active'));
    activeTab.classList.add('active');

    slides.forEach(slide => {
      if (slide.dataset.productId === target) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('mouseenter', () => activateTab(tab));
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('focus', () => activateTab(tab));
  });

  // Mobile Touch Swipe support for product showcase
  const visual = wrapper.querySelector('.product-showcase-visual');
  if (visual) {
    let touchStartX = 0;
    let touchEndX = 0;

    visual.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    visual.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        let currentIdx = 0;
        tabs.forEach((t, i) => {
          if (t.classList.contains('active')) currentIdx = i;
        });

        if (diff > 0 && currentIdx < tabs.length - 1) {
          activateTab(tabs[currentIdx + 1]);
        } else if (diff < 0 && currentIdx > 0) {
          activateTab(tabs[currentIdx - 1]);
        }
      }
    }, { passive: true });
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
  }, { threshold: 0.5 });

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
    track.classList.add('is-dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.classList.remove('is-dragging');
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('is-dragging');
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
 * Mobile Navigation Drawer Toggle & Accordion Submenus
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle-btn');
  const closeBtn = document.querySelector('.mobile-close-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Accordion toggle in mobile menu
  const accordions = drawer.querySelectorAll('.mobile-accordion-btn');
  accordions.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = btn.parentElement;
      parent.classList.toggle('open');
      const span = btn.querySelector('span');
      if (span) {
        span.textContent = parent.classList.contains('open') ? '−' : '+';
      }
    });
  });

  // Close drawer on link click
  const navLinks = drawer.querySelectorAll('.mobile-sub-link, .mobile-nav-link:not(.mobile-accordion-btn)');
  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * Reusable B2B Request For Quote (RFQ) Modal
 */
function initRfqModal() {
  const modal = document.getElementById('rfqModal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('[data-open-rfq]');
  const closeBtn = modal.querySelector('.modal-close-btn');
  const productSelect = modal.querySelector('#rfqProductSelect');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prefillProduct = btn.dataset.product;
      if (prefillProduct && productSelect) {
        for (let i = 0; i < productSelect.options.length; i++) {
          if (productSelect.options[i].value === prefillProduct) {
            productSelect.selectedIndex = i;
            break;
          }
        }
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * B2B Lead & Inquiry Forms Handler
 */
function initInquiryForms() {
  const forms = document.querySelectorAll('form[data-b2b-form]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusBox = form.closest('.modal-body')
        ? form.closest('.modal-body').querySelector('.form-status')
        : form.parentElement.querySelector('.form-status');

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Transmitting...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        form.reset();
        if (statusBox) {
          statusBox.innerHTML = '<strong>Enquiry Transmitted Successfully.</strong> Our formulation desk in Jaipur will contact you within 24 business hours.';
          statusBox.className = 'form-status success';
          statusBox.style.display = 'block';
        }
      }, 700);
    });
  });
}
