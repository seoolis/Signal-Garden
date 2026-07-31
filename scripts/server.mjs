import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, value, index, all) => {
  if (value.startsWith('--')) acc.push([value.slice(2), all[index + 1]]);
  return acc;
}, []));
const root = resolve(args.root || '.');
const port = Number(args.port || 5173);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml' };

async function fileFor(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const candidate = join(root, safe === '/' ? 'index.html' : safe);
  try { const info = await stat(candidate); if (info.isFile()) return candidate; } catch {}
  return join(root, 'index.html');
}

http.createServer(async (req, res) => {
  try {
    const file = await fileFor(req.url || '/');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Signal Garden: http://localhost:${port}`));
