/* ===== LaborPro Animations =====
 * Counter animation, scroll-reveal, and micro-interactions.
 * Include this script on any tool page that needs these features.
 * Respects prefers-reduced-motion automatically.
 */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ───────────────────────────────────────────
  // 1. Number Counter Animation
  // ───────────────────────────────────────────
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function formatWithCommas(n) {
    var parts = n.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  /**
   * Animate a number counter from 0 to target.
   * @param {HTMLElement} element  - The DOM element whose textContent will be updated
   * @param {number}      target   - The target number to count up to
   * @param {number}      duration - Animation duration in ms (default 800)
   */
  function animateCounter(element, target, duration) {
    if (!element) return;
    duration = duration || 800;

    if (prefersReduced) {
      element.textContent = 'NT$ ' + formatWithCommas(target);
      return;
    }

    var startTime = null;
    var isNegative = target < 0;
    var absTarget = Math.abs(target);

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutExpo(progress);
      var current = Math.round(absTarget * easedProgress);
      var display = (isNegative ? '-' : '') + 'NT$ ' + formatWithCommas(current);
      element.textContent = display;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * Auto-detect and animate .result-hero-amount elements.
   * Parses NT$ amounts from textContent, then counts up from 0.
   */
  function autoAnimateCounters() {
    var elements = document.querySelectorAll('.result-hero-amount');
    for (var i = 0; i < elements.length; i++) {
      (function (el) {
        var text = el.textContent || '';
        // Extract numeric value: handle "NT$ 118,937" or "NT$118,937" or "-NT$ 5,000"
        var cleaned = text.replace(/[^0-9,.\-]/g, '').replace(/,/g, '');
        var value = parseFloat(cleaned);
        if (!isNaN(value) && value !== 0) {
          animateCounter(el, value, 800);
        }
      })(elements[i]);
    }
  }

  // ───────────────────────────────────────────
  // 2. Scroll Reveal (Intersection Observer)
  // ───────────────────────────────────────────
  function initScrollReveal() {
    if (prefersReduced) {
      // Show everything immediately
      var items = document.querySelectorAll('.scroll-reveal');
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add('scroll-revealed');
      }
      return;
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      var fallbackItems = document.querySelectorAll('.scroll-reveal');
      for (var j = 0; j < fallbackItems.length; j++) {
        fallbackItems[j].classList.add('scroll-revealed');
      }
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // Apply stagger delay based on data attribute
          var delay = el.getAttribute('data-reveal-delay');
          if (delay) {
            el.style.transitionDelay = delay + 'ms';
          }
          el.classList.add('scroll-revealed');
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    var revealItems = document.querySelectorAll('.scroll-reveal');
    for (var k = 0; k < revealItems.length; k++) {
      observer.observe(revealItems[k]);
    }
  }

  // ───────────────────────────────────────────
  // 3. Auto-tag result elements for scroll reveal
  // ───────────────────────────────────────────
  function autoTagResultElements() {
    var selectors = [
      '.result-hero',
      '.result-card',
      '.notice-card',
      '.action-card',
      '.info-box',
      '.warn-box',
      '.danger-box',
      '.law-note',
      '.case-law-panel',
      '.data-table',
      '.score-meter'
    ];

    var staggerDelay = 0;
    var staggerStep = 80;

    for (var s = 0; s < selectors.length; s++) {
      var elements = document.querySelectorAll(selectors[s]);
      for (var i = 0; i < elements.length; i++) {
        if (!elements[i].classList.contains('scroll-reveal')) {
          elements[i].classList.add('scroll-reveal');
          elements[i].setAttribute('data-reveal-delay', staggerDelay);
          staggerDelay += staggerStep;
        }
      }
    }
  }

  // ───────────────────────────────────────────
  // 4. Init on DOM Ready
  // ───────────────────────────────────────────
  function init() {
    autoTagResultElements();
    initScrollReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose globally for tool pages to call after rendering results
  window.LaborProAnimations = {
    animateCounter: animateCounter,
    autoAnimateCounters: autoAnimateCounters,
    initScrollReveal: initScrollReveal,
    autoTagResultElements: autoTagResultElements,
    /** Call after dynamically rendering result content */
    refreshResults: function () {
      autoTagResultElements();
      initScrollReveal();
      autoAnimateCounters();
    }
  };
})();
