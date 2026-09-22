import { initTheme } from './theme.js';
import { applyContent, showLoadingSkeletons, hideLoadingSkeletons } from './render.js';
import { prefersReducedMotion, handleError, debugLog } from './utils.js';

const NAV_CONFIG = {
  ROOT_MARGIN: '-40% 0px -50% 0px',
  THRESHOLD_STEP: 0.05,
  THRESHOLD_MAX: 1.0,
};

const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');
const yearEl = document.getElementById('year');

function init() {
  initTheme();

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    siteNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (siteNav.classList.contains('open')) {
          siteNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  const supportsHistory = typeof history !== 'undefined' && typeof history.pushState === 'function';

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      scrollToSection(target, { behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      if (supportsHistory) {
        history.pushState({ id }, '', `#${id}`);
      } else {
        window.location.hash = id;
      }
    });
  });

  window.addEventListener('popstate', (event) => {
    const id =
      event && event.state && event.state.id
        ? event.state.id
        : window.location.hash.replace('#', '');
    if (!id) return;
    const target = document.getElementById(id);
    if (target) scrollToSection(target, { behavior: 'auto' });
  });

  showLoadingSkeletons();
  fetchContent();

  initObservers();
  initScrollToTop();
  initSectionAnimations();
}

async function fetchContent() {
  try {
    const res = await fetch('data/content.json', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to load data/content.json: ${res.status}`);
    }
    const data = await res.json();
    debugLog('Portfolio data loaded successfully:', data);
    applyContent(data);
  } catch (err) {
    handleError(err, 'Failed to load portfolio data. Content may not display correctly');
    hideLoadingSkeletons();
  }
}

function scrollToSection(element: HTMLElement, options: { behavior?: ScrollBehavior } = {}) {
  const behavior = options.behavior || 'auto';
  element.scrollIntoView({
    behavior,
    block: 'start',
  });
}

function buildThresholdList() {
  const thresholds = [];
  for (let i = 0; i <= NAV_CONFIG.THRESHOLD_MAX; i += NAV_CONFIG.THRESHOLD_STEP) {
    thresholds.push(i);
  }
  return thresholds;
}

function initObservers() {
  const sections = [
    'about',
    'experience',
    'projects',
    'skills',
    'education',
    'certifications',
    'contact',
  ]
    .map((id) => document.getElementById(id))
    .filter(Boolean) as HTMLElement[];

  const navLinks = new Map<string, Element>();
  document.querySelectorAll('#site-nav a[href^="#"]').forEach((a) => {
    const id = a.getAttribute('href')?.slice(1);
    if (id) navLinks.set(id, a);
  });

  const visibility = new Map<string, number>();
  const fallbackSectionId = sections[0]?.id ?? null;
  const initialSectionId = window.location.hash.replace('#', '');
  let currentActive: string | null = null;

  if (initialSectionId && navLinks.has(initialSectionId)) {
    const link = navLinks.get(initialSectionId);
    link?.classList.add('is-active');
    link?.setAttribute('aria-current', 'page');
    currentActive = initialSectionId;
  } else if (fallbackSectionId && navLinks.has(fallbackSectionId)) {
    const link = navLinks.get(fallbackSectionId);
    link?.classList.add('is-active');
    link?.setAttribute('aria-current', 'page');
    currentActive = fallbackSectionId;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibility.set(entry.target.id, entry.intersectionRatio);
      });

      let activeId: string | null = fallbackSectionId;
      let maxRatio = -1;
      visibility.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          activeId = id;
        }
      });

      if (activeId && activeId !== currentActive) {
        if (currentActive && navLinks.has(currentActive)) {
          const prevLink = navLinks.get(currentActive);
          prevLink?.classList.remove('is-active');
          prevLink?.removeAttribute('aria-current');
        }
        const link = navLinks.get(activeId);
        if (link) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
          currentActive = activeId;
        }
      }
    },
    { rootMargin: NAV_CONFIG.ROOT_MARGIN, threshold: buildThresholdList() }
  );

  sections.forEach((sec) => io.observe(sec));
}

function initScrollToTop() {
  const scrollToTopBtn = document.getElementById('scroll-to-top');

  if (scrollToTopBtn) {
    let scrollTimeout: number;
    window.addEventListener(
      'scroll',
      () => {
        if (scrollTimeout) {
          cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(() => {
          if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
          } else {
            scrollToTopBtn.classList.remove('visible');
          }
        });
      },
      { passive: true }
    );

    scrollToTopBtn.addEventListener('click', () => {
      const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
      window.scrollTo({ top: 0, behavior });
    });
  }
}

function initSectionAnimations() {
  const sections = document.querySelectorAll('.section');
  if (sections.length === 0) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  const checkInitialVisibility = () => {
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        section.classList.add('visible');
      }
    });
  };

  setTimeout(checkInitialVisibility, 100);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
