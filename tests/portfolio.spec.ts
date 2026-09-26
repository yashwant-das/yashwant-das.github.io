import { readFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { PortfolioData } from '../src/types.ts';

// Assert against the content source, not copies of it, so editing content.json
// never breaks a test that is only checking that data reaches the page.
const content = JSON.parse(readFileSync('data/content.json', 'utf8')) as PortfolioData;

const brands = (content.brands?.items ?? []).filter((b) => !b.disabled);
const clients = brands.filter((b) => b.kind === 'client');
const employers = brands.filter((b) => b.kind === 'employer');
const tools = (content.toolbox?.items ?? []).filter((t) => !t.disabled);
const groups = (content.toolbox?.groups ?? []).filter((g) => tools.some((t) => t.group === g.id));
const projects = (content.projects ?? []).filter((p) => !p.disabled);
const articles = (content.articles ?? []).filter((a) => !a.disabled);
const socials = Object.entries(content.contact.socials ?? {});

const SECTIONS = ['brands', 'work', 'toolbox', 'writing', 'contact'];

// Phone, tablet, laptop and wide desktop.
const RESPONSIVE_VIEWPORTS = [
  { name: 'phone', width: 360, height: 800 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'wide', width: 1920, height: 1080 },
];

async function useTheme(page: Page, theme: 'light' | 'dark') {
  await page.addInitScript((t) => localStorage.setItem('yd-theme', t), theme);
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

  test('shows client logos and names the employers', async ({ page }) => {
    const tiles = page.locator('#brands .brand');
    await expect(tiles).toHaveCount(clients.length);
    for (const [i, brand] of clients.entries()) {
      // Logos carry an sr-only name; fallbacks show the name as text.
      await expect(tiles.nth(i)).toContainText(brand.name);
      if (brand.logo) await expect(tiles.nth(i).locator('svg')).toHaveCount(1);
    }
    for (const employer of employers) {
      await expect(page.locator('#brands .brand-note')).toContainText(employer.name);
    }
  });

  test('renders the stack from content data', async ({ page }) => {
    // Current focus: one pill with a logo per focus tool, in data order.
    const pills = page.locator('#toolbox .tool-pill');
    await expect(pills).toHaveText(tools.filter((t) => t.focus).map((t) => t.name));
    await expect(page.locator('#toolbox .tool-pill svg')).toHaveCount(
      tools.filter((t) => t.focus).length
    );

    // One row per group, listing every tool in that group.
    for (const group of groups) {
      const row = page.locator('#toolbox .stack-row', {
        has: page.locator('dt', { hasText: group.label }),
      });
      await expect(row.locator('.inline-list li')).toHaveText(
        tools.filter((t) => t.group === group.id).map((t) => t.name)
      );
    }

    // Platforms tested on.
    const platforms = page.locator('#toolbox .stack-row', {
      has: page.locator('dt', { hasText: 'Platforms' }),
    });
    await expect(platforms.locator('li')).toHaveText((content.surfaces ?? []).map((s) => s.name));
  });

  test('lists selected work with external links and stacks', async ({ page }) => {
    const cards = page.locator('#work .card');
    await expect(cards).toHaveCount(projects.length);
    for (const [i, project] of projects.entries()) {
      const card = cards.nth(i);
      await expect(card).toHaveAttribute('href', project.code);
      await expect(card).toHaveAttribute('target', '_blank');
      await expect(card).toHaveAttribute('rel', 'noopener noreferrer');
      await expect(card).toContainText(project.title);
      await expect(card).toContainText(project.description);
      for (const name of project.stack ?? []) await expect(card).toContainText(name);
    }
  });

  test('lists articles with external links', async ({ page }) => {
    const cards = page.locator('#writing .card');
    await expect(cards).toHaveCount(articles.length);
    for (const [i, article] of articles.entries()) {
      await expect(cards.nth(i)).toHaveAttribute('href', article.url);
      await expect(cards.nth(i)).toHaveAttribute('rel', 'noopener noreferrer');
      await expect(cards.nth(i)).toContainText(article.title);
    }
  });

  test('offers email as a copy action without printing the address', async ({ page }) => {
    const email = content.contact.email ?? '';
    await expect(page.locator('#copy-email-btn')).toHaveAttribute('data-email', email);
    await expect(page.locator('#copy-email-btn .copy-idle')).toBeVisible();
    await expect(page.locator('#copy-email-btn .copy-done')).toBeHidden();
    // The address itself never appears as visible text or a mailto link.
    await expect(page.locator('body')).not.toContainText(email);
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  });

  test('links every social profile', async ({ page }) => {
    for (const [label, url] of socials) {
      const link = page.locator(`#social-list a[href="${url}"]`);
      await expect(link).toHaveText(label);
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    // The hero's social buttons lead with a logo.
    const heroLinks = page.locator('#contact a');
    for (const link of await heroLinks.all()) {
      await expect(link.locator('svg').first()).toBeVisible();
    }
  });

  test('copies the email address', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const button = page.locator('#copy-email-btn');
    const width = (await button.boundingBox())?.width;
    await button.click();
    await expect(button).toHaveClass(/is-done/);
    await expect(button.locator('.copy-done')).toBeVisible();
    await expect(button.locator('.copy-idle')).toBeHidden();
    await expect(page.locator('#copy-email-status')).toHaveText('Email address copied');
    // Swapping the label never changes the button's width.
    expect((await button.boundingBox())?.width).toBe(width);
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe(content.contact.email);
    // It resets, so it can be used again.
    await expect(button.locator('.copy-idle')).toBeVisible({ timeout: 4000 });
  });

  test('marks the nav link for the section in view', async ({ page }) => {
    const link = page.locator('#site-nav a[href="#work"]');
    await link.click();
    await expect(link).toHaveAttribute('aria-current', 'true');
  });

  test('follows the system theme and toggles, remembering the choice', async ({ page }) => {
    const html = page.locator('html');
    const toggle = page.locator('#theme-toggle');

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to light theme');

    // The choice survives a reload, even against the system setting.
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
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
