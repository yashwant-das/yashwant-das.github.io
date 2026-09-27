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

// Small and large phones, tablet, laptop and wide desktop.
const RESPONSIVE_VIEWPORTS = [
  { name: 'phone', width: 360, height: 800 },
  { name: 'large phone', width: 440, height: 956 },
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
    // Current focus leads, one logo per tool, then one panel per group listing
    // every tool in it. Hidden panels still hold their content; toContainText,
    // since some logos carry a <style> block in their text.
    const panels = page.locator('#toolbox [role="tabpanel"]');
    const focus = tools.filter((t) => t.focus);
    await expect(panels).toHaveCount(groups.length + (focus.length > 0 ? 1 : 0));
    const offset = focus.length > 0 ? 1 : 0;
    if (focus.length > 0) {
      await expect(panels.first().locator('li')).toContainText(focus.map((t) => t.name));
      await expect(panels.first().locator('li svg')).toHaveCount(focus.length);
    }
    for (const [i, group] of groups.entries()) {
      await expect(panels.nth(i + offset).locator('li')).toContainText(
        tools.filter((t) => t.group === group.id).map((t) => t.name)
      );
    }
  });

  test('the work window switches repositories by click and arrow keys', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const tabs = page.locator('#work [role="tab"]');
    await expect(tabs).toHaveCount(projects.length);
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');

    const second = projects[1];
    if (!second) return;
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    const panel = page.locator('#work [role="tabpanel"]:visible');
    await expect(panel).toHaveCount(1);
    await expect(panel).toContainText(second.description);
    await expect(panel.locator('a')).toHaveAttribute('href', second.code);

    // Arrow keys move the selection, and focus, along the list.
    await tabs.nth(1).press('ArrowDown');
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(2)).toBeFocused();
    await tabs.nth(2).press('Home');
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  });

  test('the stack window lists current focus and every group', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const tabs = page.locator('#toolbox [role="tab"] .window-tab-title');
    await expect(tabs).toHaveText(['Current focus', ...groups.map((g) => g.label)]);
    const lastGroup = groups[groups.length - 1];
    if (!lastGroup) return;
    await page.locator('#toolbox [role="tab"]').last().click();
    await expect(page.locator('#toolbox [role="tabpanel"]:visible li')).toHaveText(
      tools.filter((t) => t.group === lastGroup.id).map((t) => t.name)
    );
  });

  test('shows the platforms tested on in the hero', async ({ page }) => {
    await expect(page.locator('.hero .platform-list li')).toHaveText(
      (content.surfaces ?? []).map((s) => s.name)
    );
  });

  test('lists selected work with external links and stacks', async ({ page }) => {
    const panels = page.locator('#work [role="tabpanel"]');
    await expect(panels).toHaveCount(projects.length);
    for (const [i, project] of projects.entries()) {
      const panel = panels.nth(i);
      await expect(panel).toContainText(project.title);
      await expect(panel).toContainText(project.description);
      for (const name of project.stack ?? []) await expect(panel).toContainText(name);
      const link = panel.locator('a');
      await expect(link).toHaveAttribute('href', project.code);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('keeps the windows on a phone, with tabs across the top', async ({ page }) => {
    // iPhone 16 Pro Max.
    await page.setViewportSize({ width: 440, height: 956 });
    await page.reload();
    const list = page.locator('#work [role="tablist"]');
    const tabs = page.locator('#work [role="tab"]');
    await expect(page.locator('#work .window')).toBeVisible();
    await expect(list).toHaveAttribute('aria-orientation', 'horizontal');

    // Every tab is a full touch target, laid out in one row.
    const first = await tabs.first().boundingBox();
    const second = await tabs.nth(1).boundingBox();
    expect(first?.height).toBeGreaterThanOrEqual(44);
    expect(second?.y).toBe(first?.y);

    // Tapping a tab off the edge scrolls it into view and swaps the pane.
    const last = projects[projects.length - 1];
    if (!last) return;
    await tabs.last().click();
    await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.last()).toBeInViewport();
    await expect(page.locator('#work [role="tabpanel"]:visible')).toContainText(last.description);

    // Left and right arrows move along the row.
    await tabs.last().press('ArrowRight');
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    await tabs.first().press('ArrowLeft');
    await expect(tabs.last()).toBeFocused();

    // Switching panels never changes the window's height.
    const height = (await page.locator('#work .window').boundingBox())?.height;
    await tabs.nth(1).click();
    expect((await page.locator('#work .window').boundingBox())?.height).toBe(height);
  });

  test('lists articles with external links', async ({ page }) => {
    const cards = page.locator('#writing .row');
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

  test('ends with contact: Copy email and every social profile', async ({ page }) => {
    await expect(page.locator('#social-list .copy-email')).toHaveAttribute(
      'data-email',
      content.contact.email ?? ''
    );
    for (const [label, url] of socials) {
      const link = page.locator(`#social-list a[href="${url}"]`);
      await expect(link).toContainText(label);
      await expect(link.locator('svg').first()).toBeVisible();
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
