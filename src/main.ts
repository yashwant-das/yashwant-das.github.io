import { initTheme } from './theme.ts';
import { handleError } from './utils.ts';

// The page is rendered to static HTML at build time (see vite.config.ts); this
// script only adds the few behaviours that need JavaScript.

function initCopyEmail() {
  const button = document.getElementById('copy-email-btn');
  const label = button?.querySelector('.copy-label');
  const email = button?.dataset.email;
  if (!button || !label || !email) return;

  let resetTimer: number | undefined;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      label.textContent = 'Copied';
    } catch (err) {
      handleError(err, 'Clipboard unavailable');
      label.textContent = 'Press Ctrl+C';
      const selection = window.getSelection();
      const link = document.querySelector('.contact-line a');
      if (selection && link) {
        selection.selectAllChildren(link);
      }
    }
    button.classList.add('is-done');
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      label.textContent = 'Copy email';
      button.classList.remove('is-done');
    }, 2000);
  });
}

// Marks the nav link for the section currently in view.
function initActiveNav() {
  const links = new Map<string, HTMLAnchorElement>();
  document.querySelectorAll<HTMLAnchorElement>('#site-nav a[href^="#"]').forEach((a) => {
    links.set(a.hash.slice(1), a);
  });
  const sections = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  if (sections.length === 0 || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = links.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        } else if (link.hasAttribute('aria-current')) {
          link.removeAttribute('aria-current');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((section) => observer.observe(section));
}

function init() {
  initTheme();
  initCopyEmail();
  initActiveNav();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
