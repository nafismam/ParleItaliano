import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('apps/preview/out');
const base = process.env.NEXT_PUBLIC_BASE_PATH || '/ParleItaliano';
const portIndex = process.argv.indexOf('--port');
const port = portIndex === -1 ? 4300 : Number(process.argv[portIndex + 1]);
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
};
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith(`${base}/`)) {
      response.writeHead(404);
      response.end();
      return;
    }
    let path = resolve(root, `.${pathname.slice(base.length)}`);
    if (path !== root && !path.startsWith(root + sep)) {
      response.writeHead(404);
      response.end();
      return;
    }
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' });
    response.end(await readFile(path));
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Preview server listening on port ${port}`));
