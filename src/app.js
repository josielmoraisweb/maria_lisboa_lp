import { links } from './config.js';

document.documentElement.classList.add('js');

document.querySelectorAll('[data-link]').forEach((element) => {
  const key = element.dataset.link;
  const url = links[key]?.trim();

  if (!url) {
    element.removeAttribute('href');
    element.setAttribute('aria-disabled', 'true');
    element.setAttribute('tabindex', '-1');
    return;
  }

  element.href = url;
  element.target = '_blank';
  element.rel = 'noopener noreferrer';
  element.removeAttribute('aria-disabled');
  element.removeAttribute('tabindex');
});

const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
