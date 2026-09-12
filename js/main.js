/**
 * Asqek Landing Page JavaScript
 * Handles sticky navigation, mobile menu toggle, smooth scrolling, and link states
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // 1. Sticky Navigation Scroll Effect
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check on initial load

  // 2. Mobile Menu Toggle
  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    mobileNavDrawer.classList.toggle('open', isMenuOpen);
    mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen.toString());
    
    // Toggle hamburger icon between bars and close icon
    if (isMenuOpen) {
      mobileMenuBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else {
      mobileMenuBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
    }
  };

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close mobile menu when clicking any nav link
    const mobileLinks = mobileNavDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMenuOpen) toggleMenu();
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (isMenuOpen && !header.contains(e.target) && !mobileNavDrawer.contains(e.target)) {
        toggleMenu();
      }
    });
  }

  // 3. Active Link Highlighting with Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else if (link.getAttribute('href')?.startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // 4. Smooth Anchor Scrolling with dynamic offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (navHeight + 15);
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 5. Toast Helper function (reusable for copying contacts or interaction feedback)
  window.showToast = function(message) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#17b978" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  };

  // 6. Contact Form Submission Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const businessName = document.getElementById('businessName')?.value.trim() || '';
      const businessAbout = document.getElementById('businessAbout')?.value.trim() || '';
      const websiteNeeds = document.getElementById('websiteNeeds')?.value.trim() || '';
      const callTiming = document.getElementById('callTiming')?.value.trim() || '';

      const subject = encodeURIComponent(`Website Inquiry from ${businessName}`);
      const body = encodeURIComponent(
        `Business Name: ${businessName}\n\n` +
        `What I do / what my business is about:\n${businessAbout}\n\n` +
        `Short description of what I need for the website:\n${websiteNeeds}\n\n` +
        `Best days/times for a quick call:\n${callTiming}\n`
      );

      window.location.href = `mailto:asqekcompany@gmail.com?subject=${subject}&body=${body}`;

      if (window.showToast) {
        window.showToast("Opening your email client to send details to Asqek...");
      }
    });
  }

  // 7. Dark / Light Mode Toggle with Slow Rippling Reveal Animation
  let currentTheme = 'light';
  let isThemeTransitioning = false;

  const applyTheme = (theme) => {
    currentTheme = theme;
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      const nextLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      btn.setAttribute('aria-label', nextLabel);
      btn.setAttribute('title', nextLabel);
    });
  };

  const runSlowRippleTransition = (x, y) => {
    if (isThemeTransitioning) return;
    isThemeTransitioning = true;

    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

    // 1. Calculate maximum distance from (x, y) to the farthest viewport corner
    const maxCornerDist = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    // Expand to 135% to ensure full corner submersion and comfortable overlap
    const endRadius = Math.ceil(maxCornerDist * 1.35);

    // 2. Get or create the ripple overlay container
    let overlay = document.getElementById('themeRippleOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'themeRippleOverlay';
      overlay.className = 'theme-ripple-overlay';
      overlay.innerHTML = `
        <div class="ripple-wave ripple-leading" id="rippleLeading"></div>
        <div class="ripple-wave ripple-trailing-1" id="rippleTrailing1"></div>
        <div class="ripple-wave ripple-main" id="rippleMain"></div>
        <div class="ripple-ring-crest ripple-ring-crest-1" id="rippleCrest1"></div>
        <div class="ripple-ring-crest ripple-ring-crest-2" id="rippleCrest2"></div>
      `;
      document.body.appendChild(overlay);
    }

    const leadingLayer = overlay.querySelector('#rippleLeading');
    const trailingLayer = overlay.querySelector('#rippleTrailing1');
    const mainLayer = overlay.querySelector('#rippleMain');
    const crest1 = overlay.querySelector('#rippleCrest1');
    const crest2 = overlay.querySelector('#rippleCrest2');

    // Colors tailored to the incoming theme
    const targetBg = nextTheme === 'dark' ? '#090d16' : '#ffffff';
    const crestColor1 = nextTheme === 'dark' ? 'rgba(96, 165, 250, 0.75)' : 'rgba(245, 158, 11, 0.75)';
    const crestGlow1 = nextTheme === 'dark' ? 'rgba(59, 130, 246, 0.45)' : 'rgba(245, 158, 11, 0.45)';
    const crestColor2 = nextTheme === 'dark' ? 'rgba(59, 130, 246, 0.6)' : 'rgba(22, 82, 240, 0.5)';

    // Configure layer backgrounds and concentric opacities
    leadingLayer.style.backgroundColor = targetBg;
    leadingLayer.style.opacity = '0.35';

    trailingLayer.style.backgroundColor = targetBg;
    trailingLayer.style.opacity = '0.68';

    mainLayer.style.backgroundColor = targetBg;
    mainLayer.style.opacity = '1.0';

    if (crest1) {
      crest1.style.left = `${x}px`;
      crest1.style.top = `${y}px`;
      crest1.style.border = `2px solid ${crestColor1}`;
      crest1.style.boxShadow = `0 0 20px ${crestGlow1}, inset 0 0 12px ${crestGlow1}`;
    }

    if (crest2) {
      crest2.style.left = `${x}px`;
      crest2.style.top = `${y}px`;
      crest2.style.border = `1.5px solid ${crestColor2}`;
      crest2.style.boxShadow = `0 0 16px ${crestColor2}`;
    }

    overlay.classList.add('active');

    // Organic water ripple deceleration curve
    const rippleEasing = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const rippleDuration = 1350; // 1.35s slow, organic duration (1.2s - 1.5s range)

    // Ring 1: Leading Wavefront (starts at 0ms)
    leadingLayer.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
      ],
      {
        duration: rippleDuration,
        easing: rippleEasing,
        fill: 'forwards'
      }
    );

    // Ring 2: Trailing Wave 1 (delayed 90ms, creating a trailing concentric ripple ring)
    trailingLayer.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
      ],
      {
        duration: rippleDuration,
        delay: 90,
        easing: rippleEasing,
        fill: 'forwards'
      }
    );

    // Ring 3: Main Solid Theme Reveal (delayed 180ms, smoothly expanding behind the ripples)
    const animMain = mainLayer.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
      ],
      {
        duration: rippleDuration,
        delay: 180,
        easing: rippleEasing,
        fill: 'forwards'
      }
    );

    // Luminous leading wave crest
    if (crest1) {
      crest1.animate(
        [
          { width: '0px', height: '0px', opacity: 0.85 },
          { width: `${endRadius * 1.6}px`, height: `${endRadius * 1.6}px`, opacity: 0 }
        ],
        {
          duration: rippleDuration + 50,
          easing: rippleEasing,
          fill: 'forwards'
        }
      );
    }

    // Luminous trailing wave crest
    if (crest2) {
      crest2.animate(
        [
          { width: '0px', height: '0px', opacity: 0.7 },
          { width: `${endRadius * 1.4}px`, height: `${endRadius * 1.4}px`, opacity: 0 }
        ],
        {
          duration: rippleDuration,
          delay: 100,
          easing: rippleEasing,
          fill: 'forwards'
        }
      );
    }

    // When the solid main layer finishes, page is 100% covered by new theme
    animMain.onfinish = () => {
      // 1. Fully swap theme state in-memory
      applyTheme(nextTheme);

      // 2. Cleanly hide overlay
      overlay.classList.remove('active');
      leadingLayer.style.clipPath = 'circle(0% at 0 0)';
      trailingLayer.style.clipPath = 'circle(0% at 0 0)';
      mainLayer.style.clipPath = 'circle(0% at 0 0)';

      isThemeTransitioning = false;
    };
  };

  const handleThemeToggle = (event) => {
    let x, y;
    if (event && (event.clientX !== undefined && event.clientY !== undefined) && (event.clientX !== 0 || event.clientY !== 0)) {
      x = event.clientX;
      y = event.clientY;
    } else {
      const target = event?.currentTarget || document.getElementById('themeToggleBtn');
      if (target) {
        const rect = target.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else {
        x = window.innerWidth / 2;
        y = 0;
      }
    }
    runSlowRippleTransition(x, y);
  };

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', handleThemeToggle);
  });

  // Expose test helper to trigger ripple animation from any screen coordinate
  window.testRippleAt = (x, y) => {
    runSlowRippleTransition(x, y);
  };
});
