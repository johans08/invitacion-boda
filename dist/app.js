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

  document.querySelectorAll('.reveal, .stationery, .gallery-grid figure').forEach((element) => observer.observe(element));
}

const journeyStops = [...document.querySelectorAll('.journey-stop')];
const journeyLinks = [...document.querySelectorAll('.journey-stops a')];
const journeyDock = document.getElementById('journey-dock');
const journeyCount = document.getElementById('journey-count');
const journeyName = document.getElementById('journey-name');
const journeyNext = document.getElementById('journey-next');
let activeStopIndex = 0;

function activateStop(index) {
  const safeIndex = Math.max(0, Math.min(index, journeyStops.length - 1));
  activeStopIndex = safeIndex;
  const progress = journeyStops.length > 1 ? safeIndex / (journeyStops.length - 1) : 0;
  journeyDock.style.setProperty('--journey-progress', progress);
  journeyCount.textContent = `PARADA ${safeIndex + 1} DE ${journeyStops.length}`;
  journeyName.textContent = journeyStops[safeIndex].dataset.stopTitle;

  journeyStops.forEach((section, sectionIndex) => section.classList.toggle('chapter-active', sectionIndex === safeIndex));
  journeyLinks.forEach((link, linkIndex) => {
    link.classList.toggle('active', linkIndex === safeIndex);
    link.classList.toggle('visited', linkIndex < safeIndex);
    if (linkIndex === safeIndex) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  });

  const isLast = safeIndex === journeyStops.length - 1;
  journeyNext.classList.toggle('is-finish', isLast);
  journeyNext.firstChild.textContent = isLast ? 'PORTADA ' : 'SIGUIENTE ';
  journeyNext.setAttribute('aria-label', isLast ? 'Volver a la portada' : `Ir a ${journeyStops[safeIndex + 1].dataset.stopTitle}`);
}

let journeyFrame = 0;
function updateJourneyFromViewport() {
  journeyFrame = 0;
  if (invitation.hidden) return;
  const marker = window.innerHeight * 0.42;
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  journeyStops.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const distance = rect.top <= marker && rect.bottom >= marker
      ? 0
      : Math.min(Math.abs(rect.top - marker), Math.abs(rect.bottom - marker));
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  if (bestIndex !== activeStopIndex) activateStop(bestIndex);
}
window.addEventListener('scroll', () => {
  if (journeyFrame) return;
  journeyFrame = requestAnimationFrame(updateJourneyFromViewport);
}, { passive: true });
window.addEventListener('resize', updateJourneyFromViewport);

journeyNext.addEventListener('click', () => {
  if (activeStopIndex === journeyStops.length - 1) {
    showCover();
    return;
  }
  journeyStops[activeStopIndex + 1].scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
});

if (!reducedMotion) {
  let parallaxFrame = 0;
  const updateParallax = () => {
    parallaxFrame = 0;
    const hero = document.querySelector('.couple-hero');
    if (!hero || invitation.hidden) return;
    const rect = hero.getBoundingClientRect();
    const centerOffset = (window.innerHeight / 2) - (rect.top + rect.height / 2);
    const shift = Math.max(-34, Math.min(34, centerOffset * 0.075));
    hero.style.setProperty('--hero-shift', `${shift}px`);
  };
  window.addEventListener('scroll', () => {
    if (parallaxFrame) return;
    parallaxFrame = requestAnimationFrame(updateParallax);
  }, { passive: true });
}

activateStop(0);

function showInvitation() {
  if (opening || !invitation.hidden) return;
  opening = true;
  opener.classList.add('opening');
  entry.classList.add('leaving');

  window.setTimeout(() => {
    entry.hidden = true;
    invitation.hidden = false;
    document.body.classList.remove('locked');
    requestAnimationFrame(() => invitation.classList.add('journey-ready'));
    window.scrollTo({ top: 0, behavior: 'instant' });
    const heading = document.getElementById('welcome-title');
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    updateJourneyFromViewport();
    opening = false;
  }, reducedMotion ? 0 : 720);
}

function showCover() {
  invitation.hidden = true;
  invitation.classList.remove('journey-ready');
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
  const linkedIndex = journeyStops.findIndex((section) => section === linkedSection || section.contains(linkedSection));
  if (linkedIndex >= 0) activateStop(linkedIndex);
  requestAnimationFrame(() => {
    invitation.classList.add('journey-ready');
    linkedSection.scrollIntoView();
    requestAnimationFrame(updateJourneyFromViewport);
  });
} else {
  document.body.classList.add('locked');
}
