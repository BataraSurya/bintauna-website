/* ============================================
   bintauna.io — Script
   Scroll animations, nav behavior, mobile menu
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Intersection Observer for fade-in animations ---
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animations for siblings
        const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
        const siblingIndex = Array.from(siblings).indexOf(entry.target);
        const delay = siblingIndex * 80;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    fadeObserver.observe(el);
  });

  // --- Nav scroll behavior ---
  const nav = document.getElementById('nav');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }, { passive: true });

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  // Close mobile nav when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80; // nav height offset
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Parallax grid on hero (subtle mouse follow) ---
  const gridBg = document.querySelector('.grid-bg');
  const hero = document.querySelector('.hero');

  if (gridBg && hero && window.matchMedia('(min-width: 769px)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      requestAnimationFrame(() => {
        gridBg.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
      });
    });

    hero.addEventListener('mouseleave', () => {
      gridBg.style.transform = 'translate(0, 0)';
      gridBg.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        gridBg.style.transition = '';
      }, 500);
    });
  }

  // --- Active nav link highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinkEls.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();
});
