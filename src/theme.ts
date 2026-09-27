import { handleError } from './utils.ts';

// The theme follows the system setting until the toggle is used; that choice
// is remembered, and the inline script in index.html applies it before first
// paint.
type Theme = 'light' | 'dark';

const STORAGE_KEY = 'yd-theme';
const THEME_COLOR: Record<Theme, string> = { dark: '#14120b', light: '#f7f7f4' };

const root = document.documentElement;
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function currentTheme(): Theme {
  return root.dataset.theme === 'dark' ? 'dark' : 'light';
}

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);

  const toggle = document.getElementById('theme-toggle');
  toggle?.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
  );
}

function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (err) {
    handleError(err, 'Failed to save theme preference');
  }
}

export function initTheme() {
  applyTheme(currentTheme());

  // Track the system setting until the visitor picks a theme themselves.
  systemDark.addEventListener('change', (event) => {
    if (!savedTheme()) applyTheme(event.matches ? 'dark' : 'light');
  });

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saveTheme(next);
  });
}
