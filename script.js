// Set to the PDF path (e.g. 'Milan_Saric_CV.pdf') once the CV is in the repo.
var CV_URL = 'Milan_Saric_CV.pdf';

(function () {
  var root = document.documentElement;
  var titles = {
    en: 'Milan Saric | AI & Cloud Engineer',
    nl: 'Milan Saric | AI- & Cloud Engineer'
  };

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  // Language
  function setLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    document.title = titles[lang];
    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.setLang === lang));
    });
  }

  document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.dataset.setLang);
      store('lang', btn.dataset.setLang);
    });
  });

  setLang(root.getAttribute('data-lang'));

  // Theme
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  document.querySelector('.theme-toggle').addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store('theme', next);
  });

  // CV button
  var cvBtn = document.querySelector('.cv-btn');
  if (CV_URL) {
    cvBtn.href = CV_URL;
    cvBtn.setAttribute('download', '');
    cvBtn.removeAttribute('aria-disabled');
    cvBtn.removeAttribute('role');
    cvBtn.querySelector('.cv-soon').remove();
  }

  // Copy email
  var toast = document.querySelector('.toast');
  var toastTimer;
  document.querySelectorAll('.copy-email').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(btn.dataset.email).then(function () {
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
      });
    });
  });

  // Top bar border on scroll
  var topbar = document.querySelector('.topbar');
  function onScroll() { topbar.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal sections and highlight the current nav link
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(function (el) { revealObs.observe(el); });

    var links = document.querySelectorAll('.nav-links a');
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { navObs.observe(s); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
})();
