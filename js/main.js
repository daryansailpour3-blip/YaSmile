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
      'mailto:info@yasmile.de?subject=' + encodeURIComponent('Terminanfrage – ' + data.get('name')) +
      '&body=' + encodeURIComponent(body);

    status.textContent = 'Vielen Dank! Ihr E-Mail-Programm wird geöffnet, um die Anfrage zu senden.';
    status.className = 'form-status success';
    form.reset();
  });
}
