import { links } from './config.js';

const MOBILE_BREAKPOINT = 900;
const MOBILE_DESIGN = { width: 800, height: 3882.254 };
const DESKTOP_DESIGN = { width: 1920, height: 3502.266 };
const shell = document.getElementById('stage-shell');

function fitArtboard() {
  const design = window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_DESIGN : DESKTOP_DESIGN;
  const scale = Math.min(1, window.innerWidth / design.width);
  document.documentElement.style.setProperty('--scale', String(scale));
  shell.style.width = `${design.width * scale}px`;
  shell.style.height = `${design.height * scale}px`;
}

fitArtboard();
window.addEventListener('resize', fitArtboard, { passive: true });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cards = [...document.querySelectorAll('.link-card')];
const revealTargets = [
  ...cards,
  document.querySelector('.about-person-wrap'),
  document.querySelector('.about-eyebrow'),
  document.querySelector('.about-title'),
  document.querySelector('.about-copy')
].filter(Boolean);

revealTargets.forEach((element, index) => {
  element.classList.add('reveal');
  if (element.classList.contains('link-card')) {
    element.classList.add(index % 2 === 0 ? 'reveal-left' : 'reveal-right');
  }
});

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });

  revealTargets.forEach((element) => observer.observe(element));
}

requestAnimationFrame(() => document.body.classList.add('page-ready'));

for (const element of document.querySelectorAll('[data-link]')) {
  const key = element.dataset.link;
  const url = links[key]?.trim();
  if (!url) {
    element.removeAttribute('href');
    element.setAttribute('aria-disabled', 'true');
    element.setAttribute('tabindex', '-1');
    continue;
  }
  element.href = url;
  element.target = '_blank';
  element.rel = 'noopener noreferrer';
  element.removeAttribute('aria-disabled');
  element.removeAttribute('tabindex');
}
