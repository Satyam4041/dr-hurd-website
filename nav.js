(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  var primaryNav = nav.querySelector('#primary-nav');
  var menuToggle = nav.querySelector('.nav-toggle');
  var dropdowns = Array.prototype.slice.call(nav.querySelectorAll('.nav-dropdown'));
  var currentFile = window.location.pathname.split('/').pop() || 'index.html';

  nav.querySelectorAll('a[href]').forEach(function (link) {
    var linkFile = link.getAttribute('href').split('#')[0].split('/').pop() || 'index.html';
    if (linkFile === currentFile) {
      link.setAttribute('aria-current', 'page');
      var parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown) parentDropdown.classList.add('has-current');
    }
  });

  function closeDropdowns(except) {
    dropdowns.forEach(function (dropdown) {
      if (dropdown !== except) {
        dropdown.classList.remove('open');
        var button = dropdown.querySelector('.nav-dropdown-toggle');
        if (button) button.setAttribute('aria-expanded', 'false');
      }
    });
  }

  dropdowns.forEach(function (dropdown) {
    var button = dropdown.querySelector('.nav-dropdown-toggle');
    if (!button) return;
    button.addEventListener('click', function () {
      var willOpen = !dropdown.classList.contains('open');
      closeDropdowns(dropdown);
      dropdown.classList.toggle('open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
    });
  });

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', function () {
      var willOpen = !primaryNav.classList.contains('is-open');
      primaryNav.classList.toggle('is-open', willOpen);
      menuToggle.setAttribute('aria-expanded', String(willOpen));
      if (!willOpen) closeDropdowns();
    });
  }

  nav.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeDropdowns();
      if (primaryNav) primaryNav.classList.remove('is-open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', function (event) {
    if (!nav.contains(event.target)) closeDropdowns();
  });

  var revealTargets = document.querySelectorAll(
    'main .hero-content > *, main .hero-visual, main .hero-benefits > *, ' +
    'main section:not(.hero) .section-heading, main section:not(.hero) .hero-intro-card, ' +
    'main #our-method .method-preview-copy > *, main #our-method .method-preview-steps > *, ' +
    'main section:not(.hero) .modalities-heading, ' +
    'main section:not(.hero) .population-block, main section:not(.hero) .mission-block, ' +
    'main section:not(.hero) article, main section:not(.hero) .contact-shell, ' +
    'main section:not(.hero) .cta-banner'
  );
  var revealItems = Array.prototype.slice.call(revealTargets);
  if (revealItems.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach(function (item, index) {
      item.classList.add('reveal-item');
      var methodSection = item.closest('#our-method');
      var delay = Math.min(index % 6, 5) * 110;
      if (methodSection) {
        if (item.classList.contains('section-kicker')) delay = 0;
        else if (item.matches('h2')) delay = 180;
        else if (item.matches('.method-preview-copy > p')) delay = 300;
        else if (item.classList.contains('method-badges')) delay = 420;
        else if (item.classList.contains('method-cta')) delay = 580;
        else if (item.classList.contains('method-step')) {
          delay = 150 + (Array.prototype.indexOf.call(item.parentElement.children, item) * 150);
        }
      }
      item.style.setProperty('--reveal-delay', delay + 'ms');
    });

    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
      revealItems.forEach(function (item) { revealObserver.observe(item); });
    } else {
      revealItems.forEach(function (item) { item.classList.add('is-visible'); });
    }
  }
}());
