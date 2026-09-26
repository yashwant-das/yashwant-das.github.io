// Turns data/content.json into the page's static HTML. Runs at build time (and
// on every dev-server request) from vite.config.ts, so the shipped page is plain
// HTML with no client-side rendering, loading states or layout shift.
import type { Article, PortfolioData, Project, SectionId, Tool } from './types.ts';

export type IconResolver = (name: string | undefined) => string | null;

export interface RenderedPage {
  head: string;
  body: string;
}

const NAV: { id: SectionId; label: string }[] = [
  { id: 'work', label: 'Work' },
  { id: 'toolbox', label: 'Stack' },
  { id: 'writing', label: 'Writing' },
];

// Socials that sit beside Copy email in the hero. The rest live in the footer.
const HERO_SOCIALS = ['LinkedIn', 'GitHub'];

const ARROW = '<span class="arrow" aria-hidden="true">↗</span>';
const RIGHT = '<span class="arrow" aria-hidden="true">→</span>';

const SUN_ICON =
  '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>';
const MOON_ICON =
  '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.5 14.1A8.5 8.5 0 1 1 9.9 3.5a6.8 6.8 0 0 0 10.6 10.6Z"/></svg>';

// The wordmark's mark: an orange tile with a prompt chevron.
const MARK =
  '<svg class="wordmark-mark" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><rect width="20" height="20" rx="5"/><path d="m6 6.5 3.5 3.5L6 13.5M11 13.5h3.5" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function decorate(svg: string | null): string {
  return svg ? svg.replace('<svg ', '<svg aria-hidden="true" focusable="false" ') : '';
}

// Logo walls look even when every logo covers roughly the same area, not the
// same height: a wide wordmark gets shorter, a compact mark gets taller.
const LOGO_AREA = 40; // square root of the target area, in px
const LOGO_MAX_W = 104;
const LOGO_MAX_H = 30;

function logoSize(svg: string, scale = 1): string {
  const box = svg
    .match(/viewBox="([^"]+)"/)?.[1]
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);
  const ratio = box && box[2] && box[3] ? box[2] / box[3] : 1;
  const height = (LOGO_AREA * scale) / Math.sqrt(ratio);
  const width = height * ratio;
  const fit = Math.min(1, LOGO_MAX_W / width, LOGO_MAX_H / height);
  // Height follows from the aspect ratio, so the CSS max-width can shrink it.
  return ` style="width: ${(width * fit).toFixed(1)}px; aspect-ratio: ${ratio.toFixed(3)}"`;
}

// "A, B and C"
function joinList(items: string[]): string {
  if (items.length < 2) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function isVisible(data: PortfolioData, id: SectionId, hasContent: boolean): boolean {
  return data.visibility?.[id] !== false && hasContent;
}

function external(url: string): string {
  return `href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"`;
}

// Social links lead with the logo whose slug is the label in lower case
// (LinkedIn -> linkedin), so a new network only needs an icon to get a logo.
function socialButton(label: string, url: string, icon: IconResolver): string {
  const svg = icon(label.toLowerCase());
  return `<a class="btn btn-secondary" ${external(url)}>${
    svg ? `<span class="btn-icon">${decorate(svg)}</span>` : ''
  }<span>${escapeHtml(label)}${ARROW}</span></a>`;
}

function sectionHeader(id: string, title: string): string {
  return `<h2 class="section-title" id="${id}-title">${escapeHtml(title)}</h2>`;
}

function renderHeader(data: PortfolioData, visible: Set<SectionId>): string {
  const links = NAV.filter((item) => visible.has(item.id))
    .map((item) => `<a href="#${item.id}">${item.label}</a>`)
    .join('');

  return `<header class="site-header">
  <div class="container header-inner">
    <a class="wordmark" href="#top">${MARK}<span>${escapeHtml(data.name)}</span></a>
    <nav class="site-nav" id="site-nav" aria-label="Sections">${links}</nav>
    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch theme">
      ${SUN_ICON}${MOON_ICON}
    </button>
  </div>
</header>`;
}

// The address is never shown: the button copies it, and falls back to opening
// the mail app where the clipboard is unavailable.
function renderEmailAction(email: string, icon: IconResolver): string {
  return `<button class="btn btn-primary copy-email" id="copy-email-btn" type="button" data-email="${escapeHtml(email)}">
          <span class="copy-label"><span class="copy-idle">Copy email</span><span class="copy-done">Email copied<span class="copy-glyph" aria-hidden="true">${decorate(icon('ui:check'))}</span></span></span>
        </button>
        <span class="sr-only" id="copy-email-status" role="status"></span>`;
}

function renderHero(data: PortfolioData, icon: IconResolver, visible: Set<SectionId>): string {
  const socials = data.contact.socials ?? {};
  const role = [data.role, data.location]
    .filter(Boolean)
    .map((s) => `<span>${escapeHtml(s as string)}</span>`);
  const actions = visible.has('contact')
    ? `<div class="hero-actions" id="contact">
        ${data.contact.email ? renderEmailAction(data.contact.email, icon) : ''}
        ${HERO_SOCIALS.filter((label) => socials[label])
          .map((label) => socialButton(label, socials[label] ?? '', icon))
          .join('\n        ')}
      </div>`
    : '';

  return `<section class="hero" id="top" aria-labelledby="hero-name">
    <div class="container">
      <div class="hero-meta">
        ${
          data.avatar
            ? `<img class="hero-avatar" src="/${escapeHtml(data.avatar)}" alt="Portrait of ${escapeHtml(data.name)}" width="32" height="32" fetchpriority="high" decoding="async" />`
            : ''
        }
        <p class="hero-role">${role.join('<span class="sep" aria-hidden="true">·</span>')}</p>
        ${
          data.status
            ? `<p class="status"><span class="status-dot" aria-hidden="true"></span>${escapeHtml(data.status)}</p>`
            : ''
        }
      </div>
      <h1 class="hero-name" id="hero-name">${escapeHtml(data.name)}</h1>
      <p class="hero-statement">${escapeHtml(data.statement)}</p>
      ${actions}
    </div>
  </section>`;
}

// Client logos in one row. Employers, whose logos are the weakest marks and
// matter least to a reader, are named in a line beneath.
function renderBrands(data: PortfolioData, icon: IconResolver): string {
  const all = (data.brands?.items ?? []).filter((b) => !b.disabled);
  const clients = all.filter((b) => b.kind === 'client');
  const employers = all.filter((b) => b.kind === 'employer').map((b) => b.name);
  const wall = clients.length > 0 ? clients : all;

  const tiles = wall
    .map((brand) => {
      const svg = icon(brand.logo);
      const inner = svg
        ? `<span class="brand-logo"${logoSize(svg, brand.scale)}>${decorate(svg)}</span><span class="sr-only">${escapeHtml(brand.name)}</span>`
        : `<span class="brand-word">${escapeHtml(brand.name)}</span>`;
      return `<li class="brand" data-kind="${brand.kind}" title="${escapeHtml(brand.name)}">${inner}</li>`;
    })
    .join('\n        ');

  const through =
    clients.length > 0 && employers.length > 0
      ? `<p class="brand-note">Delivered through ${escapeHtml(joinList(employers))}.</p>`
      : '';

  return `<section class="section section-brands" id="brands" aria-labelledby="brands-title">
    <div class="container">
      <h2 class="brands-title" id="brands-title">Shipped for</h2>
      <ul class="brand-row" role="list" style="--count: ${wall.length}">
        ${tiles}
      </ul>
      ${through}
    </div>
  </section>`;
}

function renderProject(project: Project): string {
  const stack = project.stack?.length
    ? `<span class="card-meta">${project.stack.map(escapeHtml).join(' · ')}</span>`
    : '';
  return `<li>
          <a class="card" ${external(project.code)}>
            <span class="card-kicker">${escapeHtml(project.title)}${ARROW}</span>
            <span class="card-title">${escapeHtml(project.description)}</span>
            ${stack}
          </a>
        </li>`;
}

function renderWork(data: PortfolioData): string {
  const projects = (data.projects ?? []).filter((p) => !p.disabled);
  const github = data.contact.socials?.GitHub;
  return `<section class="section" id="work" aria-labelledby="work-title">
    <div class="container">
      ${sectionHeader('work', 'Selected work')}
      <ol class="cards" role="list">
        ${projects.map(renderProject).join('\n        ')}
      </ol>
      ${github ? `<a class="text-link" ${external(github)}>All repositories on GitHub${RIGHT}</a>` : ''}
    </div>
  </section>`;
}

function renderFocus(tool: Tool, icon: IconResolver): string {
  const svg = icon(tool.icon);
  return `<li class="tool-pill">${svg ? `<span class="tool-icon">${decorate(svg)}</span>` : ''}${escapeHtml(tool.name)}</li>`;
}

function stackRow(label: string, body: string): string {
  return `<div class="stack-row">
          <dt>${escapeHtml(label)}</dt>
          <dd>${body}</dd>
        </div>`;
}

function inlineList(names: string[]): string {
  return `<ul class="inline-list" role="list">${names.map((n) => `<li>${escapeHtml(n)}</li>`).join('')}</ul>`;
}

// The stack as text: current focus first, with logos, then one line per group
// and the platforms tested on.
function renderStack(data: PortfolioData, icon: IconResolver, visible: Set<SectionId>): string {
  const items = (data.toolbox?.items ?? []).filter((t) => !t.disabled);
  const focus = items.filter((t) => t.focus);
  const rows: string[] = [];

  if (focus.length > 0) {
    rows.push(
      stackRow(
        'Current focus',
        `<ul class="focus-list" role="list">${focus.map((t) => renderFocus(t, icon)).join('')}</ul>`
      )
    );
  }
  for (const group of data.toolbox?.groups ?? []) {
    const names = items.filter((t) => t.group === group.id).map((t) => t.name);
    if (names.length > 0) rows.push(stackRow(group.label, inlineList(names)));
  }
  if (visible.has('surfaces')) {
    rows.push(stackRow('Platforms', inlineList((data.surfaces ?? []).map((s) => s.name))));
  }

  return `<section class="section" id="toolbox" aria-labelledby="toolbox-title">
    <div class="container">
      ${sectionHeader('toolbox', 'Stack')}
      <dl class="stack">
        ${rows.join('\n        ')}
      </dl>
    </div>
  </section>`;
}

function renderArticle(article: Article): string {
  return `<li>
          <a class="card" ${external(article.url)}>
            <span class="card-kicker">Medium${ARROW}</span>
            <span class="card-title">${escapeHtml(article.title)}</span>
            ${article.description ? `<span class="card-desc">${escapeHtml(article.description)}</span>` : ''}
          </a>
        </li>`;
}

function renderWriting(data: PortfolioData): string {
  const articles = (data.articles ?? []).filter((a) => !a.disabled);
  const medium = data.contact.socials?.Medium;
  return `<section class="section" id="writing" aria-labelledby="writing-title">
    <div class="container">
      ${sectionHeader('writing', 'Writing')}
      <ol class="cards" role="list">
        ${articles.map(renderArticle).join('\n        ')}
      </ol>
      ${medium ? `<a class="text-link" ${external(medium)}>More on Medium${RIGHT}</a>` : ''}
    </div>
  </section>`;
}

function renderFooter(data: PortfolioData, visible: Set<SectionId>): string {
  const sections = NAV.filter((item) => visible.has(item.id))
    .map((item) => `<li><a href="#${item.id}">${item.label}</a></li>`)
    .join('');
  const socials = Object.entries(data.contact.socials ?? {})
    .map(([label, url]) => `<li><a ${external(url)}>${escapeHtml(label)}</a></li>`)
    .join('');

  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-cols">
      <nav class="footer-col" aria-label="Footer">
        <p class="footer-head">Sections</p>
        <ul role="list">${sections}</ul>
      </nav>
      ${
        visible.has('contact') && socials
          ? `<div class="footer-col" id="social-list"><p class="footer-head">Connect</p><ul role="list">${socials}</ul></div>`
          : ''
      }
      <div class="footer-col">
        <p class="footer-head">Colophon</p>
        <ul role="list"><li>Static HTML</li><li>Tested with Playwright</li><li>Inter and JetBrains Mono</li></ul>
      </div>
    </div>
    <p class="footer-base">© ${new Date().getFullYear()} ${escapeHtml(data.name)}</p>
  </div>
</footer>`;
}

function renderHead(data: PortfolioData): string {
  const title = `${data.name} · ${data.role}`;
  const description = data.description ?? data.statement;
  const sameAs = Object.values(data.contact.socials ?? {});
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.role,
    url: 'https://yashwant-das.github.io/',
    sameAs,
  };

  return `<title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`;
}

export function renderPage(data: PortfolioData, icon: IconResolver): RenderedPage {
  const hasBrands = (data.brands?.items ?? []).some((b) => !b.disabled);
  const hasTools = (data.toolbox?.items ?? []).some((t) => !t.disabled);
  const hasWork = (data.projects ?? []).some((p) => !p.disabled);
  const hasWriting = (data.articles ?? []).some((a) => !a.disabled);
  const hasContact = !!data.contact.email || Object.keys(data.contact.socials ?? {}).length > 0;

  const visible = new Set<SectionId>();
  if (isVisible(data, 'brands', hasBrands)) visible.add('brands');
  if (isVisible(data, 'toolbox', hasTools)) visible.add('toolbox');
  if (isVisible(data, 'surfaces', (data.surfaces ?? []).length > 0)) visible.add('surfaces');
  if (isVisible(data, 'work', hasWork)) visible.add('work');
  if (isVisible(data, 'writing', hasWriting)) visible.add('writing');
  if (isVisible(data, 'contact', hasContact)) visible.add('contact');

  const sections = [
    renderHero(data, icon, visible),
    visible.has('brands') ? renderBrands(data, icon) : '',
    visible.has('work') ? renderWork(data) : '',
    visible.has('toolbox') ? renderStack(data, icon, visible) : '',
    visible.has('writing') ? renderWriting(data) : '',
  ].filter(Boolean);

  const body = `${renderHeader(data, visible)}
<main id="main">
  ${sections.join('\n\n  ')}
</main>
${renderFooter(data, visible)}`;

  return { head: renderHead(data), body };
}
