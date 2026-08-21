import { links } from './config.js';

const MOBILE_BREAKPOINT = 900;
const MOBILE_DESIGN = { width: 800, height: 3791 };
const DESKTOP_DESIGN = { width: 1920, height: 2949 };
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

for (const element of document.querySelectorAll('[data-link]')) {
  const url = links[element.dataset.link]?.trim();
  if (!url) {
    element.removeAttribute('href');
    element.setAttribute('aria-disabled', 'true');
    element.setAttribute('tabindex', '-1');
    continue;
  }
  element.href = url;
  element.target = '_blank';
  element.rel = 'noopener noreferrer';
}

const revealTargets = [...document.querySelectorAll('.reveal')];
const buttonTargets = [...document.querySelectorAll('.hotspot')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.body.classList.add('motion-ready');

if (!reduceMotion) {
  for (const button of buttonTargets) {
    const card = button.closest('.site').querySelector(`.card-effect[data-card="${button.dataset.card}"]`);
    if (!card) continue;

    const triggerCardPop = () => {
      card.classList.remove('card-pop');
      void card.offsetWidth;
      card.classList.add('card-pop');
    };

    button.addEventListener('pointerdown', triggerCardPop);
    button.addEventListener('click', (event) => {
      if (event.detail === 0) triggerCardPop();
    });

    card.addEventListener('animationend', (event) => {
      if (event.animationName === 'card-click-pop') {
        card.classList.remove('card-pop');
      }
    });
  }
}

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
  buttonTargets.forEach((element) => element.classList.add('button-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  revealTargets.forEach((element) => observer.observe(element));

  const buttonObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('button-visible');
      buttonObserver.unobserve(entry.target);
    }
  }, { threshold: 0.65 });
  buttonTargets.forEach((element) => buttonObserver.observe(element));
}
