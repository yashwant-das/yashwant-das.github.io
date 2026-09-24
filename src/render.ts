// Turns data/content.json into the page's static HTML. Runs at build time (and
// on every dev-server request) from vite.config.ts, so the shipped page is plain
// HTML with no client-side rendering, loading states or layout shift.
import type {
  Article,
  Brand,
  PortfolioData,
  Project,
  SectionId,
  Surface,
  Tool,
  ToolGroup,
} from './types.ts';

export type IconResolver = (name: string | undefined) => string | null;

export interface RenderedPage {
  head: string;
  body: string;
}

const NAV: { id: SectionId; label: string }[] = [
  { id: 'toolbox', label: 'Toolbox' },
  { id: 'work', label: 'Work' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
];

const ARROW = '<span class="arrow" aria-hidden="true">↗</span>';

const SUN_ICON =
  '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>';
const MOON_ICON =
  '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.5 14.1A8.5 8.5 0 1 1 9.9 3.5a6.8 6.8 0 0 0 10.6 10.6Z"/></svg>';

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

function scaleStyle(scale: number | undefined): string {
  return scale && scale !== 1 ? ` style="--scale: ${scale}"` : '';
}

// Logo walls look even when every logo covers roughly the same area, not the
// same height: a wide wordmark gets shorter, a compact mark gets taller.
const LOGO_AREA = 44; // square root of the target area, in px
const LOGO_MAX_W = 116;
const LOGO_MAX_H = 34;

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

// Social links lead with the logo whose slug is the label in lower case
// (LinkedIn -> linkedin), so a new network only needs an icon to get a logo.
function socialLink(label: string, url: string, icon: IconResolver): string {
  const svg = icon(label.toLowerCase());
  return `<a class="link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${
    svg ? `<span class="link-icon">${decorate(svg)}</span>` : ''
  }<span>${escapeHtml(label)}${ARROW}</span></a>`;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function isVisible(data: PortfolioData, id: SectionId, hasContent: boolean): boolean {
  return data.visibility?.[id] !== false && hasContent;
}

function sectionHeader(id: string, title: string, meta = ''): string {
  return `<header class="section-head">
        <h2 class="section-title" id="${id}-title">${escapeHtml(title)}</h2>
        ${meta ? `<p class="section-meta">${escapeHtml(meta)}</p>` : ''}
      </header>`;
}

function renderHeader(data: PortfolioData, visible: Set<SectionId>): string {
  const links = NAV.filter((item) => visible.has(item.id))
    .map((item) => `<a href="#${item.id}">${item.label}</a>`)
    .join('');

  return `<header class="site-header">
  <div class="container header-inner">
    <a class="wordmark" href="#top">${escapeHtml(data.name)}</a>
    <nav class="site-nav" id="site-nav" aria-label="Sections">${links}</nav>
    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to light theme">
      ${SUN_ICON}${MOON_ICON}
    </button>
  </div>
</header>`;
}

function renderHero(data: PortfolioData, icon: IconResolver): string {
  const socials = data.contact.socials ?? {};
  const heroLinks = ['GitHub', 'LinkedIn']
    .filter((label) => socials[label])
    .map((label) => socialLink(label, socials[label] ?? '', icon))
    .join('');
  const role = [data.role, data.location]
    .filter(Boolean)
    .map((s) => `<span>${escapeHtml(s as string)}</span>`);

  return `<section class="hero" id="top" aria-labelledby="hero-name">
    <div class="container">
      <div class="hero-id">
        ${
          data.avatar
            ? `<img class="hero-avatar" src="/${escapeHtml(data.avatar)}" alt="Portrait of ${escapeHtml(data.name)}" width="64" height="64" fetchpriority="high" decoding="async" />`
            : ''
        }
        <div>
          <h1 class="hero-name" id="hero-name">${escapeHtml(data.name)}</h1>
          <p class="hero-role">${role.join('<span class="sep" aria-hidden="true">·</span>')}</p>
        </div>
      </div>
      <p class="hero-statement">${escapeHtml(data.statement)}</p>
      <div class="hero-meta">
        ${
          data.status
            ? `<p class="status"><span class="status-dot" aria-hidden="true"></span>${escapeHtml(data.status)}</p>`
            : ''
        }
        ${heroLinks ? `<div class="hero-links">${heroLinks}</div>` : ''}
      </div>
    </div>
  </section>`;
}

function renderBrand(brand: Brand, icon: IconResolver): string {
  const svg = icon(brand.logo);
  const kind = brand.kind === 'employer' ? 'Employer' : 'Client';
  const inner = svg
    ? `<span class="brand-logo"${logoSize(svg, brand.scale)}>${decorate(svg)}</span><span class="sr-only">${escapeHtml(brand.name)}</span>`
    : `<span class="brand-word">${escapeHtml(brand.name)}</span>`;
  return `<li class="brand" data-kind="${brand.kind}" title="${escapeHtml(brand.name)} · ${kind}">${inner}<span class="sr-only"> (${kind.toLowerCase()})</span></li>`;
}

function renderBrands(data: PortfolioData, icon: IconResolver): string {
  // Employers first, then clients, each in data order.
  const all = (data.brands?.items ?? []).filter((b) => !b.disabled);
  const employers = all.filter((b) => b.kind === 'employer');
  const clients = all.filter((b) => b.kind === 'client');
  const items = [...employers, ...clients];
  const meta = `${employers.length} employers, ${clients.length} clients`;

  return `<section class="section" id="brands" aria-labelledby="brands-title">
    <div class="container">
      <div class="grid-frame">
        ${sectionHeader('brands', 'Worked with', meta)}
        <ul class="brand-grid" role="list">
          ${items.map((b) => renderBrand(b, icon)).join('\n          ')}
        </ul>
        <div class="legend">
          <p class="legend-key"><span class="legend-swatch" aria-hidden="true"></span>Employer</p>
          ${data.brands?.note ? `<p>${escapeHtml(data.brands.note)}</p>` : ''}
        </div>
      </div>
    </div>
  </section>`;
}

function renderElement(tool: Tool, n: number, icon: IconResolver): string {
  const svg = icon(tool.icon);
  return `<li class="el${tool.focus ? ' is-focus' : ''}" title="${escapeHtml(tool.name)}">
            <span class="el-num" aria-hidden="true">${n}</span>
            <span class="el-logo"${scaleStyle(tool.scale)} aria-hidden="true">${decorate(svg)}</span>
            <span class="el-name">${escapeHtml(tool.name)}</span>${
              tool.focus ? '<span class="sr-only"> (current focus)</span>' : ''
            }
          </li>`;
}

function renderToolbox(data: PortfolioData, icon: IconResolver): string {
  const groups: ToolGroup[] = data.toolbox?.groups ?? [];
  const items = (data.toolbox?.items ?? []).filter((t) => !t.disabled);
  let n = 0;

  const columns = groups
    .map((group, g) => {
      const tools = items.filter((t) => t.group === group.id);
      if (tools.length === 0) return '';
      const start = n + 1;
      const cells = tools.map((t) => renderElement(t, ++n, icon)).join('\n          ');
      return `<div class="pgroup" role="group" aria-labelledby="group-${group.id}">
        <h3 class="pgroup-head" id="group-${group.id}"><span class="pgroup-num" aria-hidden="true">${pad(g + 1)}</span>${escapeHtml(group.label)}</h3>
        <ol class="pgroup-cells" start="${start}">
          ${cells}
        </ol>
      </div>`;
    })
    .filter(Boolean);

  return `<section class="section" id="toolbox" aria-labelledby="toolbox-title">
    <div class="container">
      <div class="grid-frame">
        ${sectionHeader('toolbox', 'Toolbox', `${n} elements`)}
        <div class="ptable" style="--groups: ${columns.length}">
      ${columns.join('\n      ')}
        </div>
        <div class="legend">
          <p class="legend-key"><span class="legend-swatch" aria-hidden="true"></span>Current focus</p>
          <p>Logos belong to their owners</p>
        </div>
      </div>
    </div>
  </section>`;
}

function renderSurface(surface: Surface, icon: IconResolver): string {
  const svg = icon(surface.icon);
  return `<li>${svg ? `<span class="surface-icon">${decorate(svg)}</span>` : ''}${escapeHtml(surface.name)}</li>`;
}

function renderSurfaces(data: PortfolioData, icon: IconResolver): string {
  const surfaces = data.surfaces ?? [];
  return `<section class="section section-tight" id="surfaces" aria-labelledby="surfaces-title">
    <div class="container">
      ${sectionHeader('surfaces', 'Tested on', `${surfaces.length} platforms`)}
      <ul class="surfaces" role="list">
        ${surfaces.map((s) => renderSurface(s, icon)).join('\n        ')}
      </ul>
    </div>
  </section>`;
}

function renderRow(title: string, description: string | undefined, url: string): string {
  return `<li>
          <a class="row" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
            <span class="row-title">${escapeHtml(title)}</span>
            ${description ? `<span class="row-desc">${escapeHtml(description)}</span>` : ''}
            ${ARROW}
          </a>
        </li>`;
}

function renderWork(data: PortfolioData): string {
  const projects = (data.projects ?? []).filter((p) => !p.disabled);
  return `<section class="section" id="work" aria-labelledby="work-title">
    <div class="container">
      ${sectionHeader('work', 'Selected work', 'Open source on GitHub')}
      <ol class="row-list" role="list">
        ${projects.map((p: Project) => renderRow(p.title, p.description, p.code)).join('\n        ')}
      </ol>
    </div>
  </section>`;
}

function renderWriting(data: PortfolioData): string {
  const articles = (data.articles ?? []).filter((a) => !a.disabled);
  return `<section class="section" id="writing" aria-labelledby="writing-title">
    <div class="container">
      ${sectionHeader('writing', 'Writing', 'On Medium')}
      <ol class="row-list" role="list">
        ${articles.map((a: Article) => renderRow(a.title, a.description, a.url)).join('\n        ')}
      </ol>
    </div>
  </section>`;
}

// The address is never shown: the Email action copies it, and falls back to
// opening the mail app where the clipboard is unavailable.
function renderEmailAction(email: string, icon: IconResolver): string {
  return `<button class="link copy-email" id="copy-email-btn" type="button" data-email="${escapeHtml(email)}">
          <span class="link-icon">${decorate(icon('ui:mail'))}</span><span class="copy-label"><span class="copy-idle">Copy email<span class="copy-glyph" aria-hidden="true">${decorate(icon('ui:copy'))}</span></span><span class="copy-done">Email copied<span class="copy-glyph" aria-hidden="true">${decorate(icon('ui:check'))}</span></span></span>
        </button>
        <span class="sr-only" id="copy-email-status" role="status"></span>`;
}

function renderContact(data: PortfolioData, icon: IconResolver): string {
  const email = data.contact.email;
  const socials = Object.entries(data.contact.socials ?? {})
    .map(([label, url]) => socialLink(label, url, icon))
    .join('');

  return `<section class="section section-contact" id="contact" aria-labelledby="contact-title">
    <div class="container">
      ${sectionHeader('contact', 'Contact')}
      <div class="contact-actions" id="social-list">
        ${email ? renderEmailAction(email, icon) : ''}
        ${socials}
      </div>
    </div>
  </section>`;
}

function renderFooter(data: PortfolioData): string {
  return `<footer class="site-footer">
  <div class="container footer-inner">
    <p>© ${new Date().getFullYear()} ${escapeHtml(data.name)}</p>
    <p>Static HTML, tested with Playwright</p>
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
    renderHero(data, icon),
    visible.has('brands') ? renderBrands(data, icon) : '',
    visible.has('toolbox') ? renderToolbox(data, icon) : '',
    visible.has('surfaces') ? renderSurfaces(data, icon) : '',
    visible.has('work') ? renderWork(data) : '',
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
