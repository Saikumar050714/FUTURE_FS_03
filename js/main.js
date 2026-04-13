/* ========================================
   BREW & BEAN CAFÉ — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Mobile Navigation ───
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMobileMenu);
  navOverlay.addEventListener('click', closeMobileMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // ─── Sticky Navbar ───
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ─── Active Nav Link on Scroll ───
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < bottom) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  // ─── Scroll Reveal Animations ───
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── Counter Animation ───
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);

      if (target >= 1000) {
        element.textContent = current.toLocaleString('en-IN');
      } else {
        element.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (target >= 1000) {
          element.textContent = target.toLocaleString('en-IN');
        } else {
          element.textContent = target;
        }
      }
    }

    requestAnimationFrame(update);
  }

  // ─── Menu Tabs ───
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuContents = document.querySelectorAll('.menu-content');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');

      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      menuContents.forEach(content => content.classList.remove('active'));
      const targetContent = document.getElementById(`tab-${tabId}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // ─── Testimonial Carousel ───
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  let currentTestimonial = 0;
  let autoplayInterval;

  // Create dots
  testimonialCards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('testimonial-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToTestimonial(index));
    dotsContainer.appendChild(dot);
  });

  function goToTestimonial(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.testimonial-dot').forEach(dot => dot.classList.remove('active'));

    currentTestimonial = index;
    testimonialCards[currentTestimonial].classList.add('active');
    document.querySelectorAll('.testimonial-dot')[currentTestimonial].classList.add('active');
  }

  function nextSlide() {
    const next = (currentTestimonial + 1) % testimonialCards.length;
    goToTestimonial(next);
  }

  function prevSlide() {
    const prev = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    goToTestimonial(prev);
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  startAutoplay();

  // ─── Back to Top ───
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Reservation Form ───
  const reservationForm = document.getElementById('reservationForm');
  const reservationSuccess = document.getElementById('reservationSuccess');

  if (reservationForm) {
    // Set minimum date to today
    const dateInput = document.getElementById('resDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate form submission
      const submitBtn = reservationForm.querySelector('.form-submit');
      submitBtn.textContent = 'Confirming...';
      submitBtn.disabled = true;

      setTimeout(() => {
        reservationForm.style.display = 'none';
        reservationSuccess.classList.add('show');
        
        // Reset after 5 seconds
        setTimeout(() => {
          reservationForm.style.display = '';
          reservationForm.reset();
          submitBtn.textContent = 'Confirm Reservation';
          submitBtn.disabled = false;
          reservationSuccess.classList.remove('show');
        }, 5000);
      }, 1500);
    });
  }

  // ─── Contact Form ───
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.form-submit');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.style.display = 'none';
        contactSuccess.classList.add('show');

        setTimeout(() => {
          contactForm.style.display = '';
          contactForm.reset();
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
          contactSuccess.classList.remove('show');
        }, 5000);
      }, 1500);
    });
  }

  // ─── Newsletter Form ───
  const newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button');
      const input = newsletterForm.querySelector('input');
      btn.textContent = '✓';
      input.value = '';
      input.placeholder = 'Subscribed! 🎉';
      input.disabled = true;

      setTimeout(() => {
        btn.textContent = '→';
        input.placeholder = 'Your email address';
        input.disabled = false;
      }, 3000);
    });
  }

  // ─── Smooth Scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── Gallery items hover parallax ───
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = item.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      const img = item.querySelector('img');
      if (img) {
        img.style.transform = `scale(1.08) translate(${x * 10}px, ${y * 10}px)`;
      }
    });

    item.addEventListener('mouseleave', () => {
      const img = item.querySelector('img');
      if (img) {
        img.style.transform = '';
      }
    });
  });

  // ─── Page Load Animation ───
  document.body.classList.add('loaded');

});
