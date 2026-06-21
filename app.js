/*
  =========================================
  NayePankh Foundation - Interactive JS
  =========================================
  Description: Controls theme toggle, counter animations,
  scroll reveal system, responsive menu, and form validation.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ================= MOBILE NAVIGATION MENU =================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('mobile-active')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
      }
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // ================= DARK MODE TOGGLE & PERSISTENCE =================
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  // Check user preferences or local storage
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', defaultTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // ================= SCROLL SPY FOR NAV HIGHLIGHTING =================
  const sections = document.querySelectorAll('section[id]');
  
  function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll', scrollActive);

  // ================= SCROLL REVEAL / FADE-IN SYSTEM =================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, we don't need to observe it again
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ================= METRICS COUNT-UP ANIMATION =================
  const metricsSection = document.querySelector('.metrics');
  const metricNums = document.querySelectorAll('.metric-num');
  let countTriggered = false;

  const runCountUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 1800; // 1.8 seconds count up
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing: easeOutQuad
      const easeVal = percentage * (2 - percentage);
      const currentVal = Math.floor(easeVal * target);

      if (target >= 1000) {
        element.textContent = currentVal.toLocaleString() + '+';
      } else {
        element.textContent = currentVal + '+';
      }

      if (percentage < 1) {
        requestAnimationFrame(animate);
      } else {
        if (target >= 1000) {
          element.textContent = target.toLocaleString() + '+';
        } else {
          element.textContent = target + '+';
        }
      }
    };
    requestAnimationFrame(animate);
  };

  if (metricsSection && metricNums.length > 0) {
    const metricsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countTriggered) {
          countTriggered = true;
          metricNums.forEach(num => runCountUp(num));
          metricsObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    metricsObserver.observe(metricsSection);
  }

  // ================= FORM VALIDATION & SUBMISSION =================
  const form = document.getElementById('registration-form');
  const successOverlay = document.getElementById('success-overlay');
  const successMessage = document.getElementById('success-message');
  const resetBtn = document.getElementById('reset-form-btn');

  // Input elements
  const fields = {
    name: {
      input: document.getElementById('name'),
      group: document.getElementById('group-name'),
      validate: (val) => val.trim().length >= 3
    },
    email: {
      input: document.getElementById('email'),
      group: document.getElementById('group-email'),
      validate: (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val.trim());
      }
    },
    phone: {
      input: document.getElementById('phone'),
      group: document.getElementById('group-phone'),
      validate: (val) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(val.replace(/[^0-9]/g, ''));
      }
    },
    role: {
      input: document.getElementById('role'),
      group: document.getElementById('group-role'),
      validate: (val) => val !== ''
    },
    cover: {
      input: document.getElementById('cover'),
      group: document.getElementById('group-cover'),
      validate: (val) => val.trim().length >= 30
    },
    assignment: {
      input: document.getElementById('assignment'),
      group: document.getElementById('group-assignment'),
      validate: (val) => {
        try {
          const url = new URL(val.trim());
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
          return false;
        }
      }
    }
  };

  // Helper to check validation styling
  const showValidation = (field, isValid) => {
    if (isValid) {
      field.group.classList.remove('invalid');
      field.group.classList.add('valid');
    } else {
      field.group.classList.remove('valid');
      field.group.classList.add('invalid');
    }
  };

  // Attach blur and input event listeners for dynamic feedback
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    
    // Validate on input changes or select updates
    field.input.addEventListener('input', () => {
      if (field.group.classList.contains('invalid') || field.group.classList.contains('valid')) {
        const isValid = field.validate(field.input.value);
        showValidation(field, isValid);
      }
    });

    field.input.addEventListener('change', () => {
      const isValid = field.validate(field.input.value);
      showValidation(field, isValid);
    });

    // Validate on blur
    field.input.addEventListener('blur', () => {
      const isValid = field.validate(field.input.value);
      showValidation(field, isValid);
    });
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let formIsValid = true;

      // Validate all fields
      Object.keys(fields).forEach(key => {
        const field = fields[key];
        const isValid = field.validate(field.input.value);
        showValidation(field, isValid);
        if (!isValid) {
          formIsValid = false;
        }
      });

      if (formIsValid) {
        // Collect Form Data
        const nameVal = fields.name.input.value.trim();
        const roleSelect = fields.role.input;
        const roleText = roleSelect.options[roleSelect.selectedIndex].text;

        // Custom transition to Success Overlay
        form.style.display = 'none';
        
        // Update success text
        if (successMessage) {
          successMessage.innerHTML = `Thank you, <strong>${nameVal}</strong>! We have received your application for the <strong>${roleText}</strong> role. Our team will review your application details and assignment link and contact you via email shortly.`;
        }
        
        if (successOverlay) {
          successOverlay.style.display = 'flex';
          successOverlay.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        // Scroll to the first invalid element
        const firstInvalid = document.querySelector('.form-group.invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  // Handle Reset Form Button
  if (resetBtn && form && successOverlay) {
    resetBtn.addEventListener('click', () => {
      // Clear all inputs
      form.reset();
      
      // Remove valid/invalid classes
      Object.keys(fields).forEach(key => {
        fields[key].group.classList.remove('valid', 'invalid');
      });

      // Show form again and hide overlay
      successOverlay.style.display = 'none';
      form.style.display = 'block';
    });
  }
});
