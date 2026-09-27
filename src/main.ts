import { initTheme } from './theme.ts';
import { handleError } from './utils.ts';

// The page is rendered to static HTML at build time (see vite.config.ts); this
// script only adds the few behaviours that need JavaScript.

// Every Copy email button (the hero and the footer) shares one status line.
function initCopyEmail() {
  const status = document.getElementById('copy-email-status');
  if (!status) return;

  document.querySelectorAll<HTMLButtonElement>('.copy-email').forEach((button) => {
    const email = button.dataset.email;
    if (!email) return;

    let resetTimer: number | undefined;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(email);
      } catch (err) {
        // No clipboard (an insecure context or a denied permission): hand the
        // address to the mail app instead.
        handleError(err, 'Clipboard unavailable');
        window.location.href = `mailto:${email}`;
        return;
      }
      // Both labels always occupy the button, so swapping them never shifts
      // the links beside it; the status line tells screen readers.
      button.classList.add('is-done');
      status.textContent = 'Email address copied';
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        button.classList.remove('is-done');
        status.textContent = '';
      }, 2000);
    });
  });
}

// The feature windows' sidebars are tab lists: a click or the arrow keys
// select a tab and show its panel (roving tabindex, per the ARIA tabs pattern).
function initWindowTabs() {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((win) => {
    const tabs = [...win.querySelectorAll<HTMLButtonElement>('[role="tab"]')];

    const select = (next: HTMLButtonElement, focus: boolean) => {
      tabs.forEach((tab) => {
        const on = tab === next;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
        if (panel) panel.hidden = !on;
      });
      if (focus) next.focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (event) => {
        const last = tabs.length - 1;
        const target = {
          ArrowDown: i === last ? 0 : i + 1,
          ArrowUp: i === 0 ? last : i - 1,
          Home: 0,
          End: last,
        }[event.key];
        if (target === undefined) return;
        event.preventDefault();
        const next = tabs[target];
        if (next) select(next, true);
      });
    });
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
  initWindowTabs();
  initActiveNav();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
