import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import type { PortfolioData } from './src/types.ts';

type RenderModule = typeof import('./src/render.ts');
type IconsModule = typeof import('./src/icons.ts');

// Renders data/content.json into index.html. In dev the modules are loaded
// through Vite's SSR loader so edits to the templates or icons apply on reload.
function prerender(): Plugin {
  let server: ViteDevServer | undefined;

  async function load(): Promise<[RenderModule, IconsModule]> {
    if (server) {
      return Promise.all([
        server.ssrLoadModule('/src/render.ts') as Promise<RenderModule>,
        server.ssrLoadModule('/src/icons.ts') as Promise<IconsModule>,
      ]);
    }
    return Promise.all([import('./src/render.ts'), import('./src/icons.ts')]);
  }

  return {
    name: 'portfolio-prerender',
    configureServer(s) {
      server = s;
      s.watcher.add(['data/content.json', 'src/icons']);
      s.watcher.on('change', (file) => {
        if (file.endsWith('content.json') || file.includes('/src/icons/')) {
          s.ws.send({ type: 'full-reload' });
        }
      });
    },
    async transformIndexHtml(html) {
      const data = JSON.parse(readFileSync('data/content.json', 'utf8')) as PortfolioData;
      const [{ renderPage }, { resolveIcon }] = await load();
      const page = renderPage(data, resolveIcon);
      return html.replace('<!--app-head-->', page.head).replace('<!--app-body-->', page.body);
    },
  };
}

export default defineConfig({
  plugins: [prerender()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  preview: {
    port: 8000,
    strictPort: true,
  },
});
