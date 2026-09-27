// Turns data/content.json into the page's static HTML. Runs at build time (and
// on every dev-server request) from vite.config.ts, so the shipped page is plain
// HTML with no client-side rendering, loading states or layout shift.
import type { Article, PortfolioData, SectionId, Tool } from './types.ts';

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

// Socials in the hero; the first is the primary button. The closing contact
// carries them all, with Copy email.
const HERO_SOCIALS = ['LinkedIn', 'GitHub'];

const ARROW = '<span class="arrow" aria-hidden="true">↗</span>';
const RIGHT = '<span class="arrow" aria-hidden="true">→</span>';

const SUN_ICON =
  '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>';
const MOON_ICON =
  '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.5 14.1A8.5 8.5 0 1 1 9.9 3.5a6.8 6.8 0 0 0 10.6 10.6Z"/></svg>';

// The wordmark's mark: a run button seen as a faceted pyramid, in the text
// colour, with its three faces in three shades so it reads in either theme.
const MARK =
  '<svg class="wordmark-mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M4 2.5 21 12H9.67Z"/><path d="M4 21.5 21 12H9.67Z" fill-opacity=".55"/><path d="M4 2.5 9.67 12 4 21.5Z" fill-opacity=".28"/></svg>';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// An icon can be inlined several times (a hero pill, a hidden window panel),
// so ids inside it, such as a mask's, get a per-copy suffix. Otherwise every
// copy would point at the first, which may sit in a hidden element and not paint.
let iconCopy = 0;

function decorate(svg: string | null): string {
  if (!svg) return '';
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1] as string);
  let out = svg.replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
  if (ids.length > 0) {
    const n = ++iconCopy;
    for (const id of ids) {
      out = out
        .replaceAll(`id="${id}"`, `id="${id}-${n}"`)
        .replaceAll(`url(#${id})`, `url(#${id}-${n})`)
        .replaceAll(`href="#${id}"`, `href="#${id}-${n}"`);
    }
  }
  return out;
}

// Logo walls look even when every logo covers roughly the same area, not the
// same height: a wide wordmark gets shorter, a compact mark gets taller.
const LOGO_AREA = 50; // square root of the target area, in px
const LOGO_MAX_W = 120;
const LOGO_MAX_H = 40;

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
function socialButton(label: string, url: string, icon: IconResolver, primary = false): string {
  const svg = icon(label.toLowerCase());
  return `<a class="btn ${primary ? 'btn-primary' : 'btn-secondary'}" ${external(url)}>${
    svg ? `<span class="btn-icon">${decorate(svg)}</span>` : ''
  }<span>${escapeHtml(label)}${ARROW}</span></a>`;
}

// The address is never shown: the button copies it, and falls back to opening
// the mail app where the clipboard is unavailable. The hero's button carries
// the id; every copy button reports through one status line.
function emailButton(email: string, id = ''): string {
  return `<button class="btn btn-primary copy-email"${id ? ` id="${id}"` : ''} type="button" data-email="${escapeHtml(email)}">
          <span class="copy-label"><span class="copy-idle">Copy email</span><span class="copy-done">Email copied</span></span>
        </button>`;
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

// The platforms tested on, with their icons: the widest proof of the
// statement, so it sits in the hero.
function renderPlatforms(data: PortfolioData, icon: IconResolver): string {
  const surfaces = data.surfaces ?? [];
  return `<div class="platforms">
        <p class="platforms-label" id="platforms-label">Tested on</p>
        <ul class="platform-list" role="list" aria-labelledby="platforms-label">
          ${surfaces
            .map((s) => {
              const svg = icon(s.icon);
              return `<li>${svg ? `<span class="platform-icon">${decorate(svg)}</span>` : ''}${escapeHtml(s.name)}</li>`;
            })
            .join('')}
        </ul>
      </div>`;
}

function renderHero(data: PortfolioData, icon: IconResolver, visible: Set<SectionId>): string {
  const socials = data.contact.socials ?? {};
  const role = data.location ? `${data.role} in ${data.location}.` : `${data.role}.`;
  const links = HERO_SOCIALS.filter((label) => socials[label]);
  const actions =
    visible.has('contact') && links.length > 0
      ? `<div class="hero-actions">
        ${links.map((label, i) => socialButton(label, socials[label] ?? '', icon, i === 0)).join('\n        ')}
      </div>`
      : '';

  // As on cursor.com, the hero is one two-tone block at headline size: the
  // name in ink, then role, place and statement in grey. The work window
  // right below is the page's focal point.
  return `<section class="hero" id="top" aria-labelledby="hero-name">
    <div class="container">
      ${
        data.avatar
          ? `<img class="hero-avatar" src="/${escapeHtml(data.avatar)}" alt="Portrait of ${escapeHtml(data.name)}" width="48" height="48" fetchpriority="high" decoding="async" />`
          : ''
      }
      <div class="hero-text">
        <h1 class="hero-name" id="hero-name">${escapeHtml(data.name)}</h1>
        <p class="hero-lede"><span class="hero-role">${escapeHtml(role)}</span> <span class="hero-statement">${escapeHtml(data.statement)}</span></p>
      </div>
      ${
        data.status
          ? `<p class="status"><span class="status-dot" aria-hidden="true"></span>${escapeHtml(data.status)}</p>`
          : ''
      }
      ${actions}
      ${visible.has('surfaces') ? renderPlatforms(data, icon) : ''}
    </div>
  </section>`;
}

// Client logos in one row; the employers the work came through are named
// beneath rather than shown as logos.
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
      ? `<p class="brand-note">Through ${escapeHtml(joinList(employers))}.</p>`
      : '';

  // A cursor.com logo band: one small centred caption over a row of tiles.
  return `<section class="section section-brands" id="brands" aria-labelledby="brands-title">
    <div class="container">
      <h2 class="brands-title" id="brands-title">${clients.length > 0 ? 'Shipped for these clients' : 'Worked with'}</h2>
      <ul class="brand-row" role="list" style="--count: ${wall.length}">
        ${tiles}
      </ul>
      ${through}
    </div>
  </section>`;
}

/* --------------------------------------------------------------------------
   Feature blocks, after cursor.com: two-tone text on one side and an app
   window on a tinted panel on the other. The window is a real control: its
   sidebar is a tab list (click or arrow keys, see src/main.ts) that swaps the
   main pane. On a phone the sidebar becomes a row of tabs above the pane.
   -------------------------------------------------------------------------- */

interface WindowTab {
  title: string;
  sub?: string;
  count?: number;
  panel: string;
}

function renderWindow(id: string, name: string, label: string, tabs: WindowTab[]): string {
  const list = tabs
    .map(
      (
        tab,
        i
      ) => `<button class="window-tab" type="button" role="tab" id="${id}-tab-${i}" aria-controls="${id}-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
              <span class="window-tab-title">${escapeHtml(tab.title)}</span>${
                tab.sub ? `<span class="window-tab-sub">${escapeHtml(tab.sub)}</span>` : ''
              }${
                tab.count !== undefined
                  ? `<span class="window-tab-count"><span class="sr-only">, </span>${tab.count}<span class="sr-only"> tools</span></span>`
                  : ''
              }
            </button>`
    )
    .join('\n            ');
  const panels = tabs
    .map(
      (
        tab,
        i
      ) => `<div class="window-panel" role="tabpanel" id="${id}-panel-${i}" aria-labelledby="${id}-tab-${i}" tabindex="0"${i === 0 ? '' : ' hidden'}>
            ${tab.panel}
          </div>`
    )
    .join('\n          ');

  return `<div class="window" data-tabs>
        <div class="window-bar"><span class="window-dots" aria-hidden="true"><span></span><span></span><span></span></span><span class="window-name">${escapeHtml(name)}</span></div>
        <div class="window-body">
          <div class="window-side">
            <p class="window-label" id="${id}-label">${escapeHtml(label)}<span>${tabs.length}</span></p>
            <div class="window-tabs" role="tablist" aria-orientation="vertical" aria-labelledby="${id}-label">
            ${list}
            </div>
          </div>
          <div class="window-main">
          ${panels}
          </div>
        </div>
      </div>`;
}

// One file tab and a breadcrumb, like the top of an editor pane.
function editorHead(file: string, crumb: string): string {
  return `<div class="editor-tabs"><span class="editor-tab">${escapeHtml(file)}</span></div>
            <p class="editor-crumb">${escapeHtml(crumb)}<span aria-hidden="true">›</span>${escapeHtml(file)}</p>`;
}

function toolList(names: string[], tools: Map<string, Tool>, icon: IconResolver): string {
  return `<ul class="doc-tools" role="list">${names
    .map((name) => {
      const svg = icon(tools.get(name)?.icon);
      return `<li>${svg ? `<span class="doc-tool-icon">${decorate(svg)}</span>` : ''}${escapeHtml(name)}</li>`;
    })
    .join('')}</ul>`;
}

function featureBlock(
  id: string,
  title: string,
  lede: string,
  media: string,
  reverse = false
): string {
  return `<section class="section" id="${id}" aria-labelledby="${id}-title">
    <div class="container">
      <div class="feature${reverse ? ' feature-reverse' : ''}">
        <div class="feature-text">
          <h2 class="feature-title" id="${id}-title">${escapeHtml(title)}</h2>
          <p class="feature-lede">${escapeHtml(lede)}</p>
        </div>
        <div class="feature-media">
      ${media}
        </div>
      </div>
    </div>
  </section>`;
}

function renderWork(data: PortfolioData, icon: IconResolver): string {
  const projects = (data.projects ?? []).filter((p) => !p.disabled);
  const tools = new Map((data.toolbox?.items ?? []).map((t) => [t.name, t]));

  const tabs = projects.map((p) => ({
    title: p.title,
    sub: p.stack?.join(', '),
    panel: `${editorHead('README.md', p.title)}
            <div class="doc">
              <h3 class="doc-title">${escapeHtml(p.title)}</h3>
              <p class="doc-text">${escapeHtml(p.description)}</p>
              ${p.stack?.length ? `<p class="doc-head">Built with</p>${toolList(p.stack, tools, icon)}` : ''}
              <a class="text-link doc-link" ${external(p.code)}>View on GitHub${RIGHT}</a>
            </div>`,
  }));

  return featureBlock(
    'work',
    'Selected work',
    `${projects.length} open-source projects on GitHub. Pick one to see what it does and what it is built with.`,
    renderWindow('work', 'yashwant-das', 'Repositories', tabs)
  );
}

// Current focus leads the window's tabs, then every toolbox group.
function renderStack(data: PortfolioData, icon: IconResolver): string {
  const items = (data.toolbox?.items ?? []).filter((t) => !t.disabled);
  const tools = new Map(items.map((t) => [t.name, t]));
  const focus = items.filter((t) => t.focus);
  const groups = (data.toolbox?.groups ?? [])
    .map((group) => ({
      label: group.label,
      names: items.filter((t) => t.group === group.id).map((t) => t.name),
    }))
    .filter((g) => g.names.length > 0);
  const all = [
    ...(focus.length > 0 ? [{ label: 'Current focus', names: focus.map((t) => t.name) }] : []),
    ...groups,
  ];

  const tabs = all.map((g) => ({
    title: g.label,
    count: g.names.length,
    panel: `${editorHead('toolbox.json', 'Stack')}
            <div class="doc">
              <h3 class="doc-title">${escapeHtml(g.label)}</h3>
              ${toolList(g.names, tools, icon)}
            </div>`,
  }));

  return featureBlock(
    'toolbox',
    'Stack',
    `What I work with most right now, and the full toolbox of ${items.length} tools.`,
    renderWindow('stack', 'toolbox.json', 'Groups', tabs),
    true
  );
}

function renderArticle(article: Article): string {
  return `<li>
          <a class="row" ${external(article.url)}>
            <span class="row-main">
              <span class="row-title">${escapeHtml(article.title)}</span>
              ${article.description ? `<span class="row-desc">${escapeHtml(article.description)}</span>` : ''}
            </span>
            <span class="row-meta">${ARROW}</span>
          </a>
        </li>`;
}

function renderWriting(data: PortfolioData): string {
  const articles = (data.articles ?? []).filter((a) => !a.disabled);
  const medium = data.contact.socials?.Medium;
  return `<section class="section" id="writing" aria-labelledby="writing-title">
    <div class="container">
      ${sectionHeader('writing', 'Writing')}
      <ol class="rows" role="list">
        ${articles.map(renderArticle).join('\n        ')}
      </ol>
      ${medium ? `<a class="text-link" ${external(medium)}>More on Medium${RIGHT}</a>` : ''}
    </div>
  </section>`;
}

// The page ends where a reader who got this far wants to act: on contact.
// The page closes the way cursor.com's does: one large line and the action.
function renderContact(data: PortfolioData, icon: IconResolver): string {
  const socials = Object.entries(data.contact.socials ?? {})
    .map(([label, url]) => socialButton(label, url, icon))
    .join('\n        ');

  return `<section class="closing" id="contact" aria-labelledby="contact-title">
    <div class="container">
      <h2 class="closing-title" id="contact-title">Get in touch.</h2>
      <div class="closing-actions" id="social-list">
        ${data.contact.email ? emailButton(data.contact.email, 'copy-email-btn') : ''}
        ${socials}
      </div>
    </div>
  </section>`;
}

function renderFooter(data: PortfolioData): string {
  return `<footer class="site-footer">
  <div class="container">
    <p class="footer-base">© ${new Date().getFullYear()} ${escapeHtml(data.name)}</p>
  </div>
</footer>
<span class="sr-only" id="copy-email-status" role="status"></span>`;
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
    visible.has('work') ? renderWork(data, icon) : '',
    visible.has('brands') ? renderBrands(data, icon) : '',
    visible.has('toolbox') ? renderStack(data, icon) : '',
    visible.has('writing') ? renderWriting(data) : '',
    visible.has('contact') ? renderContact(data, icon) : '',
  ].filter(Boolean);

  const body = `${renderHeader(data, visible)}
<main id="main">
  ${sections.join('\n\n  ')}
</main>
${renderFooter(data)}`;

  return { head: renderHead(data), body };
}
