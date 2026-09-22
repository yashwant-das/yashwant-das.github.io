/**
 * Static file server for local preview and the Playwright suite.
 *
 * Replaces `python3 -m http.server`, which resets connections under the
 * concurrency Playwright produces: a browser context opens several sockets per
 * page, and with parallel workers that was enough to make page loads fail with
 * net::ERR_CONNECTION_RESET. That surfaced as random test failures — an empty
 * `#hero-name`, because `fetch('data/content.json')` never completed.
 *
 * Usage: node scripts/serve.mjs [port]     (default 8000, or $PORT)
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 8000);

const TYPES = new Map(
  Object.entries({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8',
    '.pdf': 'application/pdf',
  })
);

/** Resolve a URL path inside ROOT, or null if it escapes (path traversal). */
function resolveInRoot(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const candidate = resolve(join(ROOT, normalize(decoded)));
  return candidate === ROOT || candidate.startsWith(ROOT + sep) ? candidate : null;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers });
  res.end(body);
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'Method Not Allowed', { Allow: 'GET, HEAD' });
  }

  let path = resolveInRoot(req.url || '/');
  if (!path) return send(res, 403, 'Forbidden');

  try {
    let info = await stat(path);
    if (info.isDirectory()) {
      path = join(path, 'index.html');
      info = await stat(path);
    }

    res.writeHead(200, {
      'Content-Type': TYPES.get(extname(path).toLowerCase()) ?? 'application/octet-stream',
      'Content-Length': info.size,
      // The page fetches content.json with cache: 'no-store'; keep the rest
      // uncached too so a rebuild is always what the browser sees.
      'Cache-Control': 'no-store',
    });
    if (req.method === 'HEAD') return res.end();
    createReadStream(path).pipe(res);
  } catch {
    send(res, 404, 'Not Found');
  }
});

// Browsers hold connections open; keep them alive rather than resetting.
server.keepAliveTimeout = 30_000;
server.headersTimeout = 35_000;
server.on('clientError', (_err, socket) => {
  if (socket.writable) socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(PORT, () => {
  process.stdout.write(`serving ${ROOT} on http://localhost:${PORT}\n`);
});
