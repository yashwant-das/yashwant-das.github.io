import { handleError } from './utils.ts';

// Dark is the default. A choice made with the toggle is remembered; the inline
// script in index.html applies it before first paint.
type Theme = 'light' | 'dark';

const STORAGE_KEY = 'yd-theme';
const THEME_COLOR: Record<Theme, string> = { dark: '#0b0b0b', light: '#fbfbfa' };

const root = document.documentElement;

function currentTheme(): Theme {
  return root.dataset.theme === 'light' ? 'light' : 'dark';
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
    if (theme === 'dark') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  } catch (err) {
    handleError(err, 'Failed to save theme preference');
  }
}

export function initTheme() {
  applyTheme(currentTheme());

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saveTheme(next);
  });
}
