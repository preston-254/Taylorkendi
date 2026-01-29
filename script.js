(function () {
  'use strict';

  var DURATION = 2000;
  var EASING = function (t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  function formatNum(n, suffix) {
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' + (suffix || '');
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K' + (suffix || '');
    return String(Math.round(n)) + (suffix || '');
  }

  function animateValue(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / DURATION, 1);
      var eased = EASING(progress);
      var current = Math.round(start + (target - start) * eased);
      el.textContent = formatNum(current, suffix);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNum(target, suffix);
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('.stat-value[data-target]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          if (el.dataset.animated === 'yes') return;
          el.dataset.animated = 'yes';
          observer.unobserve(el);
          animateValue(el);
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -40px 0px' }
    );

    counters.forEach(function (c) {
      observer.observe(c);
    });
  }

  function initNav() {
    var header = document.querySelector('.header');
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.nav-menu');

    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });
    }

    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open);
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });

      document.querySelectorAll('.nav-menu a').forEach(function (link) {
        link.addEventListener('click', function () {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Open menu');
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Open menu');
        }
      });
    }
  }

  function initCardVisibility() {
    var cards = document.querySelectorAll('.analytics-card, .card');
    if (!cards.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  function initForm() {
    var form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';
      setTimeout(function () {
        btn.textContent = 'Message sent';
        btn.disabled = false;
        form.reset();
        setTimeout(function () {
          btn.textContent = originalText;
        }, 3000);
      }, 800);
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  function run() {
    initNav();
    initCounters();
    initCardVisibility();
    initForm();
    initSmoothScroll();
  }
})();
