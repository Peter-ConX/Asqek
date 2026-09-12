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

  // 7. Dark / Light Mode Toggle with Radial Reveal Animation
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

  const handleThemeToggle = (event) => {
    if (isThemeTransitioning) return;
    isThemeTransitioning = true;

    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Calculate click coordinates for radial origin
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

    // End radius to the farthest corner of the viewport
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Check for native View Transitions API support
    if (typeof document.startViewTransition === 'function') {
      const transition = document.startViewTransition(() => {
        applyTheme(nextTheme);
      });

      transition.ready.then(() => {
        const anim = document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 500,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );

        anim.onfinish = () => {
          isThemeTransitioning = false;
        };
      }).catch(() => {
        applyTheme(nextTheme);
        isThemeTransitioning = false;
      });
    } else {
      // Clean fallback for browsers without View Transitions API
      runFallbackReveal(x, y, endRadius, nextTheme);
    }
  };

  const runFallbackReveal = (x, y, endRadius, nextTheme) => {
    let overlay = document.getElementById('themeRevealOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'themeRevealOverlay';
      overlay.className = 'theme-reveal-overlay';
      document.body.appendChild(overlay);
    }

    const targetBg = nextTheme === 'dark' ? '#090d16' : '#ffffff';
    overlay.style.backgroundColor = targetBg;
    overlay.style.opacity = '1';

    const expandAnim = overlay.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
      ],
      {
        duration: 480,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards'
      }
    );

    expandAnim.onfinish = () => {
      applyTheme(nextTheme);

      const fadeAnim = overlay.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 160, easing: 'ease-out' }
      );

      fadeAnim.onfinish = () => {
        overlay.style.opacity = '0';
        overlay.style.clipPath = 'circle(0% at 0 0)';
        isThemeTransitioning = false;
      };
    };
  };

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', handleThemeToggle);
  });
});
