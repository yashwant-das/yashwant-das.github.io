import { initTheme } from './theme.ts';

// The page is rendered to static HTML at build time (see vite.config.ts); this
// script only adds the few behaviours that need JavaScript.

// The feature windows' sidebars are tab lists: a click or the arrow keys
// select a tab and show its panel (roving tabindex, per the ARIA tabs pattern).
// On a phone the list runs across the top of the window instead of down its
// side, so it takes left and right arrows too, and scrolls the choice into view.
function initWindowTabs() {
  const phone = window.matchMedia('(max-width: 767px)');

  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((win) => {
    const list = win.querySelector<HTMLElement>('[role="tablist"]');
    const tabs = [...win.querySelectorAll<HTMLButtonElement>('[role="tab"]')];

    const orient = () =>
      list?.setAttribute('aria-orientation', phone.matches ? 'horizontal' : 'vertical');
    orient();
    phone.addEventListener('change', orient);

    const select = (next: HTMLButtonElement, focus: boolean) => {
      tabs.forEach((tab) => {
        const on = tab === next;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
        if (panel) panel.hidden = !on;
      });
      if (focus) next.focus({ preventScroll: true });
      // Scroll the list itself, never the page.
      if (list && list.scrollWidth > list.clientWidth) {
        const left = next.offsetLeft - (list.clientWidth - next.offsetWidth) / 2;
        list.scrollTo({ left, behavior: reducedMotion() ? 'auto' : 'smooth' });
      }
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (event) => {
        const last = tabs.length - 1;
        const back = i === 0 ? last : i - 1;
        const forward = i === last ? 0 : i + 1;
        const target = {
          ArrowDown: forward,
          ArrowRight: forward,
          ArrowUp: back,
          ArrowLeft: back,
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

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  initWindowTabs();
  initActiveNav();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
