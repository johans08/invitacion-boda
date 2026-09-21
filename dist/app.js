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
const journeyMarkers = [...document.querySelectorAll('.journey-stops > span')];
const journeyDock = document.getElementById('journey-dock');
const journeyCount = document.getElementById('journey-count');
const journeyName = document.getElementById('journey-name');
const scrollPlane = document.getElementById('scroll-plane');
const flightRoute = document.getElementById('flight-route-path');
const hero = document.querySelector('.couple-hero');
const scrollDecorations = [
  { element: document.querySelector('.scroll-heart-one'), center: .16, x: .16, y: .28, rotation: -12 },
  { element: document.querySelector('.scroll-heart-two'), center: .30, x: .81, y: .23, rotation: 13 },
  { element: document.querySelector('.scroll-ring'), center: .43, x: .15, y: .67, rotation: -9 },
  { element: document.querySelector('.scroll-heart-three'), center: .58, x: .84, y: .58, rotation: 10 },
  { element: document.querySelector('.scroll-bouquet'), center: .73, x: .13, y: .33, rotation: -8 },
  { element: document.querySelector('.scroll-heart-four'), center: .87, x: .80, y: .73, rotation: 16 }
];
let activeStopIndex = 0;

function activateStop(index) {
  const safeIndex = Math.max(0, Math.min(index, journeyStops.length - 1));
  activeStopIndex = safeIndex;
  journeyCount.textContent = `PARADA ${safeIndex + 1} DE ${journeyStops.length}`;
  journeyName.textContent = journeyStops[safeIndex].dataset.stopTitle;

  journeyStops.forEach((section, sectionIndex) => section.classList.toggle('chapter-active', sectionIndex === safeIndex));
  journeyMarkers.forEach((marker, markerIndex) => {
    marker.classList.toggle('active', markerIndex === safeIndex);
    marker.classList.toggle('visited', markerIndex < safeIndex);
  });
}

function clamp(value, minimum = 0, maximum = 1) {
  return Math.max(minimum, Math.min(maximum, value));
}

function updateScrollDecorations(progress) {
  if (reducedMotion) return;
  const width = Math.min(window.innerWidth, 860);
  const height = window.innerHeight;
  const orbit = progress * Math.PI * 5.2;
  const x = width * (.5 + Math.sin(orbit) * .37);
  const y = height * (.47 + Math.sin(orbit * .54 - .7) * .31);
  const dx = Math.cos(orbit) * width * .37;
  const dy = Math.cos(orbit * .54 - .7) * height * .167;
  const rotation = Math.atan2(dy, dx) * 180 / Math.PI;
  const edgeFade = clamp(progress / .035) * clamp((1 - progress) / .035);
  scrollPlane.style.transform = `translate3d(${x}px, ${y - 58}px, 0) translate(-50%, -50%) rotate(${rotation}deg)`;
  scrollPlane.style.opacity = String(.82 * edgeFade);
  flightRoute.style.strokeDashoffset = String(-progress * .32);

  scrollDecorations.forEach(({ element, center, x: xRatio, y: yRatio, rotation: baseRotation }, index) => {
    const visibility = clamp(1 - Math.abs(progress - center) / .105);
    const drift = Math.sin(progress * 18 + index) * 10;
    element.style.opacity = String(visibility * .8);
    element.style.transform = `translate3d(${width * xRatio}px, ${height * yRatio - 58 + drift}px, 0) translate(-50%, -50%) rotate(${baseRotation + drift * .35}deg) scale(${.76 + visibility * .24})`;
  });
}

let journeyFrame = 0;
function updateJourneyFromViewport() {
  journeyFrame = 0;
  if (invitation.hidden) return;
  const marker = window.innerHeight * 0.42;
  const start = journeyStops[0].offsetTop;
  const end = journeyStops[journeyStops.length - 1].offsetTop + journeyStops[journeyStops.length - 1].offsetHeight - window.innerHeight * .58;
  const progress = clamp((window.scrollY + marker - start) / Math.max(1, end - start));
  journeyDock.style.setProperty('--journey-progress', progress);
  updateScrollDecorations(progress);

  if (!reducedMotion && hero) {
    const heroRect = hero.getBoundingClientRect();
    const centerOffset = (window.innerHeight / 2) - (heroRect.top + heroRect.height / 2);
    hero.style.setProperty('--hero-shift', `${clamp(centerOffset * .075, -34, 34)}px`);
  }

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
