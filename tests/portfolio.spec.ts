import { readFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { PortfolioData } from '../src/types.ts';

// Assert against the content source, not copies of it, so editing content.json
// never breaks a test that is only checking that data reaches the page.
const content = JSON.parse(readFileSync('data/content.json', 'utf8')) as PortfolioData;

const brands = (content.brands?.items ?? []).filter((b) => !b.disabled);
const tools = (content.toolbox?.items ?? []).filter((t) => !t.disabled);
const projects = (content.projects ?? []).filter((p) => !p.disabled);
const socials = Object.entries(content.contact.socials ?? {});

const SECTIONS = ['brands', 'toolbox', 'surfaces', 'work', 'contact'];

// Phone, tablet, laptop and wide desktop.
const RESPONSIVE_VIEWPORTS = [
  { name: 'phone', width: 360, height: 800 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'wide', width: 1920, height: 1080 },
];

async function useTheme(page: Page, theme: 'light' | 'dark') {
  await page.addInitScript((t) => {
    if (t === 'light') localStorage.setItem('yd-theme', 'light');
    else localStorage.removeItem('yd-theme');
  }, theme);
}

test.describe('Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has a descriptive title', async ({ page }) => {
    await expect(page).toHaveTitle(`${content.name} · ${content.role}`);
  });

  test('renders the hero from content data', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(content.name);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('.hero-statement')).toHaveText(content.statement);
    await expect(page.locator('.hero-role')).toContainText(content.role);
    if (content.avatar) {
      await expect(page.locator('.hero-avatar')).toHaveAttribute('src', `/${content.avatar}`);
    }
    if (content.status) {
      await expect(page.locator('.status')).toHaveText(content.status);
    }
  });

  test('shows every section', async ({ page }) => {
    for (const id of SECTIONS) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test('does not render resume sections', async ({ page }) => {
    for (const id of ['experience', 'education', 'certifications', 'about']) {
      await expect(page.locator(`#${id}`)).toHaveCount(0);
    }
  });

  test('renders one tile per brand, with a logo or a wordmark', async ({ page }) => {
    const tiles = page.locator('#brands .brand');
    await expect(tiles).toHaveCount(brands.length);
    for (const [i, brand] of brands.entries()) {
      const tile = tiles.nth(i);
      await expect(tile).toHaveAttribute('data-kind', brand.kind);
      // Logos carry an sr-only name; fallbacks show the name as text.
      await expect(tile).toContainText(brand.name);
      if (brand.logo) await expect(tile.locator('svg')).toHaveCount(1);
    }
  });

  test('renders the periodic table from content data', async ({ page }) => {
    const cells = page.locator('#toolbox .el');
    await expect(cells).toHaveCount(tools.length);

    // Atomic numbers run 1..n in data order, and symbols come from the data.
    const numbers = await page.locator('#toolbox .el-num').allTextContents();
    expect(numbers).toEqual(tools.map((_, i) => String(i + 1)));
    const symbols = await page.locator('#toolbox .el-sym').allTextContents();
    expect(symbols).toEqual(tools.map((t) => t.symbol));

    // Current-focus markers match the focus flags exactly.
    const focused = await page
      .locator('#toolbox .el.is-focus')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-symbol')));
    expect(focused).toEqual(tools.filter((t) => t.focus).map((t) => t.symbol));
  });

  for (const width of [390, 1440]) {
    test(`keeps periodic table cells square and uniform at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const sizes = await page
        .locator('#toolbox .el')
        .evaluateAll((els) => els.map((el) => el.getBoundingClientRect()))
        .then((rects) => rects.map((r) => [r.width, r.height]));

      const [w, h] = sizes[0] ?? [0, 0];
      expect(w).toBeGreaterThan(60);
      // Whole pixels, so hairlines never land on a half pixel.
      expect(Number.isInteger(w)).toBe(true);
      expect(h).toBe(w);
      for (const [cw, ch] of sizes) {
        expect(cw).toBe(w);
        expect(ch).toBe(h);
      }
    });
  }

  test('lists selected work with external links', async ({ page }) => {
    const rows = page.locator('#work .work-row');
    await expect(rows).toHaveCount(projects.length);
    for (const [i, project] of projects.entries()) {
      await expect(rows.nth(i)).toHaveAttribute('href', project.code);
      await expect(rows.nth(i)).toHaveAttribute('target', '_blank');
      await expect(rows.nth(i)).toHaveAttribute('rel', 'noopener noreferrer');
      await expect(rows.nth(i)).toContainText(project.title);
    }
  });

  test('renders contact email and social links', async ({ page }) => {
    const email = content.contact.email ?? '';
    await expect(page.locator('.contact-line a')).toHaveAttribute('href', `mailto:${email}`);
    for (const [label, url] of socials) {
      const link = page.locator(`#social-list a[href="${url}"]`);
      await expect(link).toContainText(label);
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('copies the email address', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const button = page.locator('#copy-email-btn');
    await button.click();
    await expect(button).toContainText('Copied');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe(content.contact.email);
  });

  test('marks the nav link for the section in view', async ({ page }) => {
    const link = page.locator('#site-nav a[href="#work"]');
    await link.click();
    await expect(link).toHaveAttribute('aria-current', 'true');
  });

  test('defaults to dark and toggles to light and back', async ({ page }) => {
    const html = page.locator('html');
    const toggle = page.locator('#theme-toggle');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to dark theme');

    // The choice survives a reload.
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  for (const theme of ['dark', 'light'] as const) {
    test(`has no detectable accessibility issues in ${theme} theme`, async ({ page }) => {
      await useTheme(page, theme);
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  for (const viewport of RESPONSIVE_VIEWPORTS) {
    test(`avoids horizontal overflow at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.reload();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBe(0);
    });
  }
});
