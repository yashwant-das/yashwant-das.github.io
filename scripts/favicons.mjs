// Renders public/favicon.svg's mark to the PNG icons Safari needs: it ignores
// SVG favicons and shows a monogram of the title instead. One PNG per theme,
// since a PNG can't follow the system setting the way the SVG does.
// Run after changing the mark: node scripts/favicons.mjs
import fs from 'fs';
import { chromium } from '@playwright/test';

const INK = '#26251e';
const PAPER = '#edecec';
const CANVAS = '#f7f7f4';

// The mark's paths from favicon.svg, without its theme-aware <style>.
const paths = fs
  .readFileSync('public/favicon.svg', 'utf8')
  .match(/<path[^>]*\/>/g)
  .join('');

// inset: the share of the 24-unit mark left free on each side.
function icon(size, fill, inset = 0, background = '') {
  const pad = 24 * inset;
  const box = 24 + pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-pad} ${-pad} ${box} ${box}">${
    background
      ? `<rect x="${-pad}" y="${-pad}" width="${box}" height="${box}" fill="${background}"/>`
      : ''
  }<g fill="${fill}">${paths}</g></svg>`;
}

const icons = [
  { file: 'public/favicon.png', svg: icon(64, INK) },
  { file: 'public/favicon-dark.png', svg: icon(64, PAPER) },
  // iOS rounds the corners and fills transparency with black, so it gets a canvas.
  { file: 'public/apple-touch-icon.png', svg: icon(180, INK, 0.3, CANVAS) },
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const { file, svg } of icons) {
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block}</style>${svg}`
  );
  await page.locator('svg').screenshot({ path: file, omitBackground: true });
  console.log(`Wrote ${file}`);
}
await browser.close();
