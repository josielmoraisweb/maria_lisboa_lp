import { links } from './config.js';

const DESIGN_WIDTH = 800;
const DESIGN_HEIGHT = 3882.254;
const shell = document.getElementById('stage-shell');

function fitArtboard() {
  const scale = Math.min(1, window.innerWidth / DESIGN_WIDTH);
  document.documentElement.style.setProperty('--scale', String(scale));
  shell.style.width = `${DESIGN_WIDTH * scale}px`;
  shell.style.height = `${DESIGN_HEIGHT * scale}px`;
}

fitArtboard();
window.addEventListener('resize', fitArtboard, { passive: true });

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
