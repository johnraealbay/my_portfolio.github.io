/* ============================================================
   PORTFOLIO - script.js
   Features:
     - Typing animation (hero)
     - Navbar scroll behavior + active link highlighting
     - Scroll-to-top button
     - Dark/light theme toggle
     - Reveal-on-scroll animations
     - Contact form validation
   ============================================================ */

'use strict';

/* ---- DOM Ready ---- */
document.addEventListener('DOMContentLoaded', () => {
  initTypingAnimation();
  initThemeToggle();
  initNavbar();
  initScrollToTop();
  initRevealOnScroll();
  initContactForm();
  initSmoothScroll();
});

/* ============================================================
   TYPING ANIMATION
   ============================================================ */
function initTypingAnimation() {
  const el     = document.getElementById('typed-text');
  const cursor = document.querySelector('.cursor');
  if (!el) return;

  const phrases = [
    'Frontend Developer',
    'Web Developer',
    'PHP Developer',
    'Problem Solver',
    'Future Software Engineer',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let delay     = 100;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        delay = 1800;
        deleting = true;
      } else {
        delay = 80 + Math.random() * 40;
      }
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay     = 400;
      } else {
        delay = 40;
      }
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 1200);
}

/* ============================================================
   THEME TOGGLE
   ============================================================ */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const icon = toggle?.querySelector('i');
  if (!toggle || !icon) return;

  const savedTheme = localStorage.getItem('portfolioTheme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const startLight = savedTheme ? savedTheme === 'light' : prefersLight;

  function setTheme(isLight) {
    document.body.classList.toggle('light-theme', isLight);
    icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    localStorage.setItem('portfolioTheme', isLight ? 'light' : 'dark');
  }

  setTheme(startLight);

  toggle.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('light-theme'));
  });
}

/* ============================================================
   NAVBAR — scroll behavior + active section highlighting
   ============================================================ */
function initNavbar() {
  const nav     = document.getElementById('mainNav');
  const links   = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
  const sections = [...document.querySelectorAll('section[id]')];
  const toggler  = document.querySelector('.navbar-toggler');
  const collapse = document.getElementById('navbarCollapse');

  /* Scroll: darken navbar + update active link */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    /* Navbar background */
    nav.classList.toggle('scrolled', scrollY > 60);

    /* Active section */
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (scrollY >= top) currentId = sec.id;
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  /* Close mobile menu on link click */
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (collapse && collapse.classList.contains('show') && toggler) {
        toggler.click();
      }
    });
  });
}

/* ============================================================
   SMOOTH SCROLL (fallback for browsers without CSS support)
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   SCROLL-TO-TOP BUTTON
   ============================================================ */
function initScrollToTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   REVEAL ON SCROLL (IntersectionObserver)
   ============================================================ */
function initRevealOnScroll() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach((el, i) => {
    /* Stagger delay via inline style */
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    observer.observe(el);
  });
}

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('formToast');
  const submitBtn = document.getElementById('contactSubmitBtn');
  if (!form) return;

  const rules = {
    contactName:    { min: 2,   msg: 'Name must be at least 2 characters.' },
    contactEmail:   { email: true, msg: 'Enter a valid email address.' },
    contactSubject: { min: 3,   msg: 'Subject must be at least 3 characters.' },
    contactMessage: { min: 10,  msg: 'Message must be at least 10 characters.' },
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;

    Object.entries(rules).forEach(([id, rule]) => {
      const field   = document.getElementById(id);
      const errEl   = document.getElementById(`${id}Err`);
      const val     = field.value.trim();
      let   fieldOk = true;

      if (rule.email) {
        fieldOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      } else if (rule.min) {
        fieldOk = val.length >= rule.min;
      }

      field.classList.toggle('is-invalid', !fieldOk);
      field.classList.toggle('is-valid',    fieldOk);
      if (errEl) errEl.textContent = fieldOk ? '' : rule.msg;
      if (!fieldOk) valid = false;
    });

    if (!valid) return;

    const accessKey = form.querySelector('[name="access_key"]')?.value;
    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      showToast('Add your Web3Forms access key first.');
      return;
    }

    const originalButtonText = submitBtn?.innerHTML;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form),
      });
      const result = await response.json();

      if (result.success) {
        showToast('Message sent! I\'ll get back to you soon. 🚀');
        form.reset();
        form.querySelectorAll('.is-valid').forEach(f => f.classList.remove('is-valid'));
      } else {
        showToast('Sorry, message failed to send. Please try again.');
      }
    } catch (error) {
      showToast('Network error. Please check your connection and try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonText;
      }
    }
  });

  /* Live validation on input */
  Object.keys(rules).forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid') || field.classList.contains('is-valid')) {
          field.dispatchEvent(new Event('blur'));
        }
      });
    }
  });
}

function showToast(msg) {
  const toast = document.getElementById('formToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
