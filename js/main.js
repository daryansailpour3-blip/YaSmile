// Scroll-Animationen: Elemente beim Hineinscrollen sanft einblenden
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  document.documentElement.classList.add('js');
  const selectors = '.section-head, .two-col > *, .card, .features li, .location-card, .steps li, .member, .team-text, .emergency, .faq details, .checklist, .campaign-teaser, .highlight, .image-band .container, .form';
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('visible');
        observer.unobserve(el);
        // Nach dem Einblenden aufräumen, damit Hover-Effekte wieder greifen
        setTimeout(() => {
          el.classList.remove('reveal', 'visible');
          el.style.transitionDelay = '';
        }, 1500);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll(selectors).forEach((el) => {
    if (el.closest('.reveal')) return;
    const siblings = Array.from(el.parentElement.children);
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 90}ms`;
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// Header-Schatten und Parallax des Signets in den Musterbändern beim Scrollen
const header = document.querySelector('.site-header');
const bands = document.querySelectorAll('.band-signet');
let ticking = false;
function onScroll() {
  if (header) header.classList.toggle('scrolled', window.scrollY > 10);
  if (!reduceMotion) {
    bands.forEach((img) => {
      const rect = img.parentElement.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const progress = (rect.top + rect.height) / (window.innerHeight + rect.height);
        img.style.transform = `translateY(${(progress - 1) * 16}%)`;
      }
    });
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

// Mobile navigation
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });
  nav.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// Current year in footer
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Appointment form: validates and opens the user's mail client with a prefilled request.
// Replace with a real backend / booking service when available.
const form = document.getElementById('termin-form');
if (form) {
  const status = form.querySelector('.form-status');
  const dateInput = form.querySelector('#date');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((field) => {
      const ok = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
      field.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      status.textContent = 'Bitte füllen Sie alle Pflichtfelder (*) aus.';
      status.className = 'form-status error';
      return;
    }

    const data = new FormData(form);
    const body = [
      `Name: ${data.get('name')}`,
      `Telefon: ${data.get('phone')}`,
      `E-Mail: ${data.get('email') || '-'}`,
      `Wunschdatum: ${data.get('date') || '-'}`,
      `Anliegen: ${data.get('reason')}`,
      '',
      data.get('message') || '',
    ].join('\n');

    window.location.href =
      'mailto:kirn@yasmile.de?subject=' + encodeURIComponent('Terminanfrage – ' + data.get('name')) +
      '&body=' + encodeURIComponent(body);

    status.textContent = 'Vielen Dank! Ihr E-Mail-Programm wird geöffnet, um die Anfrage zu senden.';
    status.className = 'form-status success';
    form.reset();
  });
}
