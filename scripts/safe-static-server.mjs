import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

export function safeRequestPath(requestTarget) {
  return new URL(requestTarget, 'http://localhost').pathname;
}

export function startStaticServer({ root = process.cwd(), port = 5002, host = '127.0.0.1' } = {}) {
  const publicRoot = resolve(root);
  const server = createServer((request, response) => {
    const pathname = safeRequestPath(request.url || '/');
    let relative;
    try {
      relative = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, '');
    } catch {
      response.writeHead(400).end('Bad request');
      return;
    }
    let target = resolve(publicRoot, relative);
    if (target !== publicRoot && !target.startsWith(`${publicRoot}${sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    const status = existsSync(target) && statSync(target).isFile() ? 200 : 404;
    process.stdout.write(`${request.method || 'GET'} ${pathname} ${status}\n`);
    if (status === 404) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, {
      'Content-Type': types[extname(target).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    createReadStream(target).pipe(response);
  });
  server.listen(port, host, () => {
    process.stdout.write(`Virtcruise static server listening on http://${host}:${port}\n`);
  });
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number.parseInt(process.argv[2] || '5002', 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('Port must be an integer from 1 to 65535');
  }
  startStaticServer({ port });
}
