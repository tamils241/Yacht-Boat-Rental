/* ============================================
   STACKLY - Luxury Yacht & Boat Rental
   Main JavaScript
   ============================================ */

'use strict';

// ============================================
// Loading Screen
// ============================================
function hideLoading() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
    loadingScreen.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(hideLoading, 200);
});

setTimeout(hideLoading, 2000);

// ============================================
// DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // Sticky Navbar
  // ==========================================
  const header = document.getElementById('header');
  const heroSection = document.querySelector('.hero');

  let ticking = false;
  function updateNavbar() {
    if (!header) return;
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  updateNavbar();

  // ==========================================
  // Mobile Menu
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Create overlay element
  const navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);

  function toggleMenu() {
    if (!hamburger || !navMenu) return;
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    if (!hamburger || !navMenu) return;
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // Nav dropdown toggle
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = toggle.closest('.nav-dropdown');
      if (dropdown) {
        dropdown.classList.toggle('open');
      }
    });
  });

  // Close menu on nav link click (exclude dropdown toggle)
  navLinks.forEach(link => {
    if (!link.classList.contains('dropdown-toggle')) {
      link.addEventListener('click', closeMenu);
    }
  });

  // Close menu on overlay click
  navOverlay.addEventListener('click', closeMenu);

  // Close dropdown on outside click (desktop)
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-dropdown.open').forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  });

  // ==========================================
  // Active Menu Highlight
  // ==========================================
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        link.classList.remove('active');
        if (href === `#${id}` &&
            scrollPos >= top && scrollPos < bottom) {
          link.classList.add('active');
        }
      });
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ==========================================
  // Hero Slider
  // ==========================================
  const slides = document.querySelectorAll('.hero-slider .slide');
  let currentSlide = 0;

  function nextSlide() {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  if (slides.length > 1) {
    setInterval(nextSlide, 5000);
  }

  // ==========================================
  // Search Form - Set min date
  // ==========================================
  const checkDate = document.getElementById('check-date');
  if (checkDate) {
    const today = new Date().toISOString().split('T')[0];
    checkDate.setAttribute('min', today);
    checkDate.value = today;
  }

  // ==========================================
  // Counter Animation
  // ==========================================
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length > 0) {
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const suffix = target === 24 ? '+' : '+';
        let current = 0;
        const increment = Math.ceil(target / 60);
        const duration = 2000;
        const stepTime = Math.floor(duration / target);

        function updateCounter() {
          current += increment;
          if (current >= target) {
            current = target;
            counter.textContent = current + suffix;
            return;
          }
          counter.textContent = current + suffix;
          requestAnimationFrame(() => {
            setTimeout(updateCounter, stepTime);
          });
        }

        updateCounter();
      });
    }
  }

  // ==========================================
  // Scroll Reveal (Intersection Observer)
  // ==========================================
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          // Trigger counter animation when stats section is visible
          if (entry.target.closest('.about-stats') || entry.target.classList.contains('about-stats')) {
            animateCounters();
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  initScrollReveal();

  // ==========================================
  // Fleet Filter
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const fleetCards = document.querySelectorAll('.fleet-card');

  if (filterBtns.length > 0 && fleetCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        fleetCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // ==========================================
  // Testimonial Carousel
  // ==========================================
  const testimonialSlider = document.getElementById('testimonial-slider');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentTestimonial = 0;

  if (testimonialSlider && testimonialSlides.length > 0 && dots.length > 0) {
    function showTestimonial(index) {
      testimonialSlides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      testimonialSlides[index].classList.add('active');
      dots[index].classList.add('active');
    }

    function nextTestimonial() {
      currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
      showTestimonial(currentTestimonial);
    }

    function prevTestimonial() {
      currentTestimonial = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
      showTestimonial(currentTestimonial);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', nextTestimonial);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', prevTestimonial);
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
      });
    });

    // Auto slide
    let testimonialInterval;

    function startTestimonialAuto() {
      testimonialInterval = setInterval(nextTestimonial, 5000);
    }

    function stopTestimonialAuto() {
      clearInterval(testimonialInterval);
    }

    if (testimonialSlides.length > 1) {
      startTestimonialAuto();

      const testimonialContainer = document.querySelector('.testimonial-container');
      if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', stopTestimonialAuto);
        testimonialContainer.addEventListener('mouseleave', startTestimonialAuto);
      }
    }
  }

  // ==========================================
  // Scroll To Top Button
  // ==========================================
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (!scrollTopBtn) return;
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }



  // ==========================================
  // Newsletter Form
  // ==========================================
  const newsletterForm = document.getElementById('newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailInput.value.trim() && emailRegex.test(emailInput.value.trim())) {
        const btn = newsletterForm.querySelector('button');
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #2ECC71, #27AE60)';
        emailInput.value = '';

        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
          btn.style.background = '';
        }, 3000);
      } else {
        emailInput.style.borderColor = '#E74C3C';
        setTimeout(() => {
          emailInput.style.borderColor = '';
        }, 2000);
      }
    });
  }

  // ==========================================
  // Search Form
  // ==========================================
  const searchForm = document.getElementById('search-form');

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const boatType = document.getElementById('boat-type');
      const checkDate = document.getElementById('check-date');
      const guests = document.getElementById('guests');

      let isValid = true;

      if (!boatType.value) {
        boatType.style.borderColor = '#E74C3C';
        isValid = false;
      } else {
        boatType.style.borderColor = '';
      }

      if (!checkDate.value) {
        checkDate.style.borderColor = '#E74C3C';
        isValid = false;
      } else {
        checkDate.style.borderColor = '';
      }

      if (!guests.value || parseInt(guests.value) < 1) {
        guests.style.borderColor = '#E74C3C';
        isValid = false;
      } else {
        guests.style.borderColor = '';
      }

      if (isValid) {
        const fleetSection = document.getElementById('fleet');
        if (fleetSection) {
          fleetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // ==========================================
  // Smooth Scroll for Anchor Links
  // ==========================================
  function toggleFaq(el) {
    el.classList.toggle('active');
    const answer = el.nextElementSibling;
    if (answer) answer.classList.toggle('open');
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#login' || href === '#register') return;

      let target;
      try { target = document.querySelector(href); } catch (e) { return; }
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Add this for FAQ functionality on index.html
  document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', function() {
      toggleFaq(this);
    });
  });

  // ==========================================
  // Parallax Effect on Hero
  // ==========================================
  function parallaxHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      if (scrollPos <= hero.offsetHeight) {
        const slides = hero.querySelectorAll('.slide');
        slides.forEach(slide => {
          slide.style.transform = `translateY(${scrollPos * 0.3}px) scale(1.05)`;
        });
      }
    }, { passive: true });
  }

  parallaxHero();

  // ==========================================
  // Responsive Pricing Cards
  // ==========================================
  function handlePricingResponsive() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    if (window.innerWidth <= 1024) {
      pricingCards.forEach(card => {
        card.style.transform = '';
      });
    }
  }

  window.addEventListener('resize', handlePricingResponsive);
  handlePricingResponsive();

  // ==========================================
  // Preloader removal fallback
  // ==========================================
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }, 5000);
});