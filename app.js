/* ═══════════════════════════════════════════════════════
   MINDFUL FAMILY GUIDE — Interactive Behaviors
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Dark/Light Mode Toggle ── */
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let currentTheme = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', currentTheme);

  function updateToggleIcon() {
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-label', 'Switch to ' + (currentTheme === 'dark' ? 'light' : 'dark') + ' mode');
    themeToggle.innerHTML = currentTheme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  updateToggleIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      updateToggleIcon();
    });
  }


  /* ── Header Scroll Behavior ── */
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ── Mobile Menu Toggle ── */
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }


  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      // Toggle this one
      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });


  /* ── Splitting.js — Hero Text Character Reveal ── */
  function initSplitting() {
    if (typeof Splitting === 'undefined') return;
    const heroTitle = document.querySelector('.hero-title[data-splitting]');
    if (!heroTitle) return;

    Splitting({ target: heroTitle, by: 'chars' });

    // Add staggered reveal animation
    const style = document.createElement('style');
    style.textContent = `
      .hero-title .char {
        opacity: 0;
        animation: char-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @keyframes char-reveal {
        from { opacity: 0; filter: blur(4px); }
        to { opacity: 1; filter: blur(0); }
      }
    `;
    document.head.appendChild(style);

    // Set stagger delays
    heroTitle.querySelectorAll('.char').forEach((char, i) => {
      char.style.animationDelay = `${0.3 + i * 0.025}s`;
    });
  }


  /* ── Rough Notation — Highlight Key Phrases ── */
  function initAnnotations() {
    if (typeof RoughNotation === 'undefined') return;

    const target = document.getElementById('annotate-another');
    if (!target) return;

    const annotation = RoughNotation.annotate(target, {
      type: 'highlight',
      color: 'oklch(0.85 0.12 55)',
      animate: true,
      animationDuration: 1200,
      padding: [2, 4],
      multiline: true,
    });

    // Show when element is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => annotation.show(), 400);
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(target);
  }


  /* ── Fallback: IntersectionObserver for browsers without scroll-timeline ── */
  function initScrollRevealFallback() {
    if (CSS.supports && CSS.supports('animation-timeline', 'scroll()')) return;

    const fadeElements = document.querySelectorAll('.fade-in, .reveal-up');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.clipPath = 'inset(0 0 0 0)';
          entry.target.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px',
    });

    fadeElements.forEach(el => {
      el.style.opacity = '0';
      if (el.classList.contains('reveal-up')) {
        el.style.clipPath = 'inset(100% 0 0 0)';
      }
      observer.observe(el);
    });
  }


  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── Initialize Lucide Icons ── */
  function initLucide() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }


  /* ── Counter Animation for Transform Cards ── */
  function initCounterAnimation() {
    const numbers = document.querySelectorAll('.card-number');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    numbers.forEach(num => observer.observe(num));
  }


  /* ── Init Everything on DOM Ready ── */
  function init() {
    initLucide();
    initSplitting();
    initAnnotations();
    initScrollRevealFallback();
    initCounterAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Small delay to ensure deferred scripts have loaded
    setTimeout(init, 100);
  }

})();
