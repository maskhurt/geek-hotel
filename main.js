/* ==========================================================================
   THE GEED HOTEL — shared front-end behaviour
   No frameworks. Progressively enhances plain HTML.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Active nav link ---------- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href]').forEach(function (a) {
    var href = a.getAttribute('href').split('/').pop();
    if (href === currentPage) a.classList.add('active');
  });

  /* ---------- Page loader ---------- */
  var loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () { loader.classList.add('hide'); }, 250);
    });
    // Fallback in case 'load' already fired
    setTimeout(function () { loader.classList.add('hide'); }, 1800);
  }

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Dark mode toggle (persists via in-memory state only) ---------- */
  var themeToggle = document.querySelector('.theme-toggle');
  var root = document.documentElement;
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', isDark ? 'light' : 'dark');
      themeToggle.setAttribute('aria-pressed', String(!isDark));
    });
  }

  /* ---------- Sticky header shrink shadow ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 40 ? '0 8px 30px -20px rgba(0,0,0,.35)' : 'none';
    });
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('show', window.scrollY > 500);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Testimonial slider ---------- */
  var track = document.querySelector('.testi-track');
  if (track) {
    var cards = track.children.length;
    var perView = window.innerWidth <= 640 ? 1 : (window.innerWidth <= 960 ? 2 : 3);
    var index = 0;
    var maxIndex = Math.max(0, cards - perView);
    function update() {
      perView = window.innerWidth <= 640 ? 1 : (window.innerWidth <= 960 ? 2 : 3);
      maxIndex = Math.max(0, cards - perView);
      if (index > maxIndex) index = maxIndex;
      var cardWidth = track.children[0].getBoundingClientRect().width + 26;
      track.style.transform = 'translateX(-' + (index * cardWidth) + 'px)';
    }
    document.querySelectorAll('[data-testi-next]').forEach(function (btn) {
      btn.addEventListener('click', function () { index = Math.min(index + 1, maxIndex); update(); });
    });
    document.querySelectorAll('[data-testi-prev]').forEach(function (btn) {
      btn.addEventListener('click', function () { index = Math.max(index - 1, 0); update(); });
    });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Gallery filter + lightbox ---------- */
  var filterBtns = document.querySelectorAll('.gallery-filters button');
  var galleryItems = document.querySelectorAll('.gallery-grid .g-item');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      galleryItems.forEach(function (item) {
        var show = filter === 'all' || item.getAttribute('data-category') === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.closest('.lb-close')) lightbox.classList.remove('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') lightbox.classList.remove('open');
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (open) {
        open.classList.remove('open');
        open.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Generic form "submit" simulation (no backend yet) ---------- */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = form.parentElement.querySelector('.form-success') || form.querySelector('.form-success');
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        var original = submitBtn.textContent;
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.textContent = 'Sending…';
        setTimeout(function () {
          submitBtn.removeAttribute('disabled');
          submitBtn.textContent = original;
          if (success) success.classList.add('show');
          form.reset();
        }, 900);
      }
    });
  });

  /* ---------- Booking page: live summary ---------- */
  var bookingForm = document.querySelector('#booking-form');
  if (bookingForm) {
    var checkin = bookingForm.querySelector('#checkin');
    var checkout = bookingForm.querySelector('#checkout');
    var guests = bookingForm.querySelector('#guests');
    var roomType = bookingForm.querySelector('#roomType');
    var sumCheckin = document.querySelector('[data-sum-checkin]');
    var sumCheckout = document.querySelector('[data-sum-checkout]');
    var sumNights = document.querySelector('[data-sum-nights]');
    var sumRoom = document.querySelector('[data-sum-room]');
    var sumGuests = document.querySelector('[data-sum-guests]');
    var sumTotal = document.querySelector('[data-sum-total]');

    var prices = { single: 3500, double: 5000, twin: 5000, executive: 7500 };
    var names = { single: 'Single Room', double: 'Double Room', twin: 'Twin Room', executive: 'Executive Room' };

    // Default check-in to today, check-out tomorrow
    var today = new Date();
    var tomorrow = new Date(today.getTime() + 86400000);
    function fmt(d) { return d.toISOString().split('T')[0]; }
    if (checkin && !checkin.value) checkin.min = fmt(today);
    if (checkout && !checkout.value) checkout.min = fmt(tomorrow);

    function refresh() {
      var nights = 1;
      if (checkin.value && checkout.value) {
        var d1 = new Date(checkin.value), d2 = new Date(checkout.value);
        var diff = Math.round((d2 - d1) / 86400000);
        nights = diff > 0 ? diff : 1;
      }
      var rt = roomType.value || 'double';
      sumCheckin.textContent = checkin.value || '—';
      sumCheckout.textContent = checkout.value || '—';
      sumNights.textContent = nights;
      sumRoom.textContent = names[rt];
      sumGuests.textContent = (guests.value || '1') + ' guest(s)';
      sumTotal.textContent = 'KES ' + (prices[rt] * nights).toLocaleString();
    }
    [checkin, checkout, guests, roomType].forEach(function (el) {
      if (el) el.addEventListener('change', refresh);
    });
    refresh();
  }

  /* ---------- Pre-fill booking room type from Rooms page links ---------- */
  var params = new URLSearchParams(window.location.search);
  var roomParam = params.get('room');
  if (roomParam) {
    var select = document.querySelector('#roomType');
    if (select) {
      select.value = roomParam;
      select.dispatchEvent(new Event('change'));
    }
  }

});
