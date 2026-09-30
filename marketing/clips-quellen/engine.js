// Mini-Animations-Engine: alles ist eine Funktion der Zeit t (Sekunden) -> deterministisch pro Frame renderbar
const clamp = (x) => Math.min(1, Math.max(0, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = (p) => 1 - Math.pow(1 - p, 3);
const easeInOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

// Wörter eines Elements in <span class="w"> zerlegen (Kind-Elemente wie <em> bleiben erhalten)
function splitWords(el) {
  const walk = (node) => {
    Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains('w')) walk(n);
    });
  };
  walk(el);
  return Array.from(el.querySelectorAll('.w'));
}

// Element sanft einblenden (von unten) und optional wieder ausblenden
function rise(el, t, start, { dur = 0.9, dist = 70, end = null, outDur = 0.5, scale = 0 } = {}) {
  if (!el) return;
  const p = easeOut(prog(t, start, start + dur));
  const o = end == null ? 1 : 1 - easeInOut(prog(t, end, end + outDur));
  el.style.opacity = p * o;
  el.style.transform = `translateY(${(1 - p) * dist - (1 - o) * 30}px) scale(${1 - scale * (1 - p)})`;
}

// Wörter gestaffelt einblenden
function words(el, t, start, opts = {}) {
  if (!el._w) el._w = splitWords(el);
  const stagger = opts.stagger ?? 0.12;
  el._w.forEach((w, i) => rise(w, t, start + i * stagger, { dist: 90, ...opts }));
}

// Szene sichtbar zwischen a und b, mit kreisförmigem Aufdecken am Anfang
function scene(el, t, a, b, { reveal = 0.9, origin = '50% 50%' } = {}) {
  const visible = t >= a && t < b;
  el.style.visibility = visible ? 'visible' : 'hidden';
  if (!visible) return;
  const p = reveal ? easeInOut(prog(t, a, a + reveal)) : 1;
  el.style.clipPath = p < 1 ? `circle(${p * 125}% at ${origin})` : 'none';
}

// Muster langsam driften lassen
function drift(el, t, speed = 18) {
  if (el) el.style.backgroundPosition = `${t * speed}px ${t * speed / 2}px, 0 0`;
}

// Goldlinie aufziehen
function drawLine(el, t, start, dur = 1, width = 520) {
  if (el) el.style.width = `${easeOut(prog(t, start, start + dur)) * width}px`;
}

// SVG-Kreis zeichnen (stroke-dashoffset)
function drawCircle(el, t, start, dur = 1.4) {
  if (!el) return;
  const len = el.getTotalLength();
  el.style.strokeDasharray = len;
  el.style.strokeDashoffset = len * (1 - easeInOut(prog(t, start, start + dur)));
}

// Glanz über den Button laufen lassen (wiederholt)
function shine(el, t, start, every = 2.2) {
  if (!el || t < start) { if (el) el.style.transform = 'translateX(-120%)'; return; }
  const p = ((t - start) % every) / 0.9;
  el.style.transform = `translateX(${-120 + clamp(p) * 240}%)`;
}

window.__ready = document.fonts.ready.then(() => true);
