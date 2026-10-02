// Renders public/og.png, the 1200 x 630 card LinkedIn, Slack and X show when
// the site's link is shared. It is set like the hero: the mark, the name in
// ink at display size, and the role and statement in grey, on the cream canvas.
// Run after changing the name, role, location or statement:
//   node scripts/og-image.mjs
import fs from 'fs';
import { chromium } from '@playwright/test';

const content = JSON.parse(fs.readFileSync('data/content.json', 'utf8'));
const font = fs
  .readFileSync('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2')
  .toString('base64');
const mark = fs
  .readFileSync('public/favicon.svg', 'utf8')
  .match(/<path[^>]*\/>/g)
  .join('');

// The light theme's tokens from css/style.css.
const CANVAS = '#f7f7f4';
const INK = '#26251e';
const MUTED = '#66655e';

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Non-breaking spaces keep "Bengaluru (IST)" on one line, as in the hero.
const role = content.location
  ? `${content.role} in ${content.location.replace(/ /g, ' ')}.`
  : `${content.role}.`;
const host = 'yashwant-das.github.io';

const html = `<!doctype html><meta charset="utf-8"><style>
  @font-face { font-family: Geist; src: url(data:font/woff2;base64,${font}) format('woff2'); font-weight: 100 900; }
  html, body { margin: 0; }
  .card { box-sizing: border-box; width: 1200px; height: 630px; padding: 80px 88px 72px;
    display: flex; flex-direction: column; background: ${CANVAS}; color: ${INK}; font-family: Geist; }
  h1 { margin: 0; font-size: 80px; font-weight: 400; line-height: 1.1; letter-spacing: -0.03em; }
  p { margin: 28px 0 0; max-width: 940px; color: ${MUTED}; font-size: 32px; line-height: 1.4; text-wrap: pretty; }
  .site { display: flex; align-items: center; gap: 14px; margin-top: auto; color: ${MUTED}; font-size: 26px; }
  .site svg { width: 32px; height: 32px; color: ${INK}; }
</style>
<div class="card">
  <h1>${escape(content.name)}</h1>
  <p>${escape(role)} ${escape(content.statement)}</p>
  <div class="site"><svg viewBox="0 0 24 24" fill="currentColor">${mark}</svg>${escape(host)}</div>
</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate('document.fonts.ready');
await page.locator('.card').screenshot({ path: 'public/og.png' });
await browser.close();
console.log('Wrote public/og.png');
