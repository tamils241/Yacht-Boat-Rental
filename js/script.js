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

  function updateNavbar() {
    if (!header) return;
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar);
  updateNavbar();

  // ==========================================
  // Mobile Menu
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    if (!hamburger || !navMenu) return;
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  const navClose = document.getElementById('nav-close');

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  if (navClose) {
    navClose.addEventListener('click', closeMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        hamburger && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  // ==========================================
  // Active Menu Highlight
  // ==========================================
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}` &&
            scrollPos >= top && scrollPos < bottom) {
          link.classList.add('active');
        }
      });
    });
  }

  window.addEventListener('scroll', updateActiveLink);

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

  // ==========================================
  // Gallery Lightbox
  // ==========================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // ==========================================
  // Testimonial Carousel
  // ==========================================
  const testimonialSlider = document.getElementById('testimonial-slider');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentTestimonial = 0;

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
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // Contact Form Validation
  // ==========================================
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const message = document.getElementById('message');

      let isValid = true;

      // Check if all fields are empty
      if (!name.value.trim() && !email.value.trim() && !phone.value.trim() && !message.value.trim()) {
        alert('Please fill all fields');
        return;
      }

      // Name validation
      const nameVal = name.value.trim();
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameVal || nameVal.length < 2 || nameVal.length > 16 || !nameRegex.test(nameVal)) {
        showError(name, 'Name must be 2-16 letters only');
        isValid = false;
      } else {
        clearError(name);
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      } else if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        alert('Please enter valid email ID');
        isValid = false;
      } else {
        clearError(email);
      }

      // Phone validation
      const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
      if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
        showError(phone, 'Please enter a valid phone number');
        isValid = false;
      } else {
        clearError(phone);
      }

      // Message validation
      if (!message.value.trim() || message.value.trim().length < 10) {
        showError(message, 'Please enter a message (at least 10 characters)');
        isValid = false;
      } else {
        clearError(message);
      }

      if (isValid) {
        submitForm(contactForm);
      }
    });
  }

  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorEl = formGroup.querySelector('.error-message');

    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      errorEl.style.cssText = 'color: #E74C3C; font-size: 0.8rem; margin-top: 4px; display: block;';
      formGroup.appendChild(errorEl);
    }

    errorEl.textContent = message;
    input.style.borderColor = '#E74C3C';
  }

  function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorEl = formGroup.querySelector('.error-message');
    if (errorEl) {
      errorEl.remove();
    }
    input.style.borderColor = '';
  }

  function submitForm(form) {
    const btn = form.querySelector('.btn');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #2ECC71, #27AE60)';

      form.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
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
    });
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