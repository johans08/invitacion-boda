/*
 * DATOS EDITABLES DE LA BODA
 * Mantener null hasta confirmar día, horarios, lugares, enlaces y receptor RSVP.
 */
const weddingData = Object.freeze({
  bride: 'Jennifer',
  groom: 'Oswaldo',
  month: 'Octubre',
  year: '2027',
  day: null,
  ceremony: { time: null, place: null, mapUrl: null },
  reception: { time: null, place: null, mapUrl: null },
  rsvp: { endpoint: null, contact: null }
});

const entry = document.getElementById('entry');
const invitation = document.getElementById('invitation');
const opener = document.getElementById('open-passport');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let opening = false;

document.title = `Boda de ${weddingData.bride} y ${weddingData.groom} · ${weddingData.month} ${weddingData.year}`;

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

const monthUpper = weddingData.month.toLocaleUpperCase('es');
setText('.passport-names', `${weddingData.bride} & ${weddingData.groom}`);
setText('.passport-date', `${monthUpper} · ${weddingData.year}`);
setText('.date-letter strong', monthUpper);
setText('.letter-year', weddingData.year);
setText('.mini-passport .script', `${weddingData.bride} & ${weddingData.groom}`);
setText('.mini-passport .micro', `${monthUpper.slice(0, 3)} · ${weddingData.year}`);
setText('.date-ticket > div:first-child strong', weddingData.month);
setText('.date-ticket-year strong', weddingData.year);
setText('.hero-date', `${monthUpper} · ${weddingData.year}`);
setText('footer .kicker', `${monthUpper} · ${weddingData.year}`);

const coupleNames = document.querySelectorAll('#couple-title span');
if (coupleNames.length === 2) {
  coupleNames[0].textContent = weddingData.bride;
  coupleNames[1].textContent = weddingData.groom;
}

if (!reducedMotion && 'IntersectionObserver' in window) {
  document.body.classList.add('js-motion');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((item) => {
      if (!item.isIntersecting) return;
      item.target.classList.add('visible');
      observer.unobserve(item.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

  document.querySelectorAll('.reveal, .stationery').forEach((element) => observer.observe(element));
}

function showInvitation() {
  if (opening || !invitation.hidden) return;
  opening = true;
  opener.classList.add('opening');
  entry.classList.add('leaving');

  window.setTimeout(() => {
    entry.hidden = true;
    invitation.hidden = false;
    document.body.classList.remove('locked');
    window.scrollTo({ top: 0, behavior: 'instant' });
    const heading = document.getElementById('welcome-title');
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    opening = false;
  }, reducedMotion ? 0 : 720);
}

function showCover() {
  invitation.hidden = true;
  entry.hidden = false;
  entry.classList.remove('leaving');
  opener.classList.remove('opening');
  document.body.classList.add('locked');
  history.replaceState(null, '', `${location.pathname}${location.search}`);
  window.scrollTo({ top: 0, behavior: 'instant' });
  opener.focus({ preventScroll: true });
}

opener.addEventListener('click', showInvitation);
document.getElementById('open-note').addEventListener('click', showInvitation);
document.getElementById('close-passport').addEventListener('click', showCover);
document.getElementById('return-cover').addEventListener('click', showCover);

const linkedSection = location.hash ? document.getElementById(location.hash.slice(1)) : null;
if (linkedSection && invitation.contains(linkedSection)) {
  entry.hidden = true;
  invitation.hidden = false;
  document.body.classList.remove('locked');
  requestAnimationFrame(() => linkedSection.scrollIntoView());
} else {
  document.body.classList.add('locked');
}
