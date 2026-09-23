// Build-time only (imported from vite.config.ts, never from the browser bundle).
// Resolves an icon name from content.json to inline SVG markup that paints in
// currentColor, so every logo follows the theme's text colour.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as simpleIcons from 'simple-icons';

interface SimpleIcon {
  slug: string;
  path: string;
}

const CUSTOM_DIR = fileURLToPath(new URL('./icons/', import.meta.url));

const bySlug = new Map<string, SimpleIcon>();
for (const value of Object.values(simpleIcons) as unknown[]) {
  if (value && typeof value === 'object' && 'slug' in value && 'path' in value) {
    const icon = value as SimpleIcon;
    bySlug.set(icon.slug, icon);
  }
}

// Stroke icons for things no brand mark represents (a browser, a generic TV).
const UI_ICONS: Record<string, string> = {
  globe:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.25"/><path d="M2.75 12h18.5M12 2.75c2.5 2.6 3.75 5.68 3.75 9.25S14.5 18.65 12 21.25C9.5 18.65 8.25 15.57 8.25 12S9.5 5.35 12 2.75Z"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6.25" y="2.75" width="11.5" height="18.5" rx="2.25"/><path d="M11 18h2"/></svg>',
  tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.75" y="4.75" width="18.5" height="12.5" rx="1.5"/><path d="M8 20.25h8"/></svg>',
  gamepad:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 7.25h9a4.75 4.75 0 0 1 4.6 5.9l-.9 3.6a2.2 2.2 0 0 1-3.8.9L14.9 16H9.1l-1.5 1.65a2.2 2.2 0 0 1-3.8-.9l-.9-3.6a4.75 4.75 0 0 1 4.6-5.9Z"/><path d="M8 10.25v3M6.5 11.75h3M15.5 11h.01M17 12.5h.01"/></svg>',
};

const cache = new Map<string, string | null>();

export function resolveIcon(name: string | undefined): string | null {
  if (!name) return null;
  if (cache.has(name)) return cache.get(name) ?? null;

  let svg: string | null = null;
  if (name.startsWith('ui:')) {
    svg = UI_ICONS[name.slice(3)] ?? null;
  } else {
    const customPath = `${CUSTOM_DIR}${name}.svg`;
    if (existsSync(customPath)) {
      svg = readFileSync(customPath, 'utf8')
        .replace(/<\?xml[^>]*>/g, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .trim();
    } else {
      const icon = bySlug.get(name);
      if (icon) {
        svg = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="${icon.path}"/></svg>`;
      }
    }
  }

  if (!svg && !name.startsWith('ui:')) {
    console.warn(`[icons] No logo found for "${name}"; rendering the text fallback.`);
  }
  cache.set(name, svg);
  return svg;
}
