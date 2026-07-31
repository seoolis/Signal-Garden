import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
await rm(dist, { recursive:true, force:true });
await mkdir(dist, { recursive:true });
await cp(join(root, 'src'), join(dist, 'src'), { recursive:true });
let html = await readFile(join(root, 'index.html'), 'utf8');
html = html.replace('<title>Signal Garden</title>', '<title>Signal Garden — Idea OS</title>');
await writeFile(join(dist, 'index.html'), html);
await writeFile(join(dist, 'build-info.json'), JSON.stringify({ builtAt:new Date().toISOString(), mode:'production-static' }, null, 2));
console.log('Built dist/ with SPA fallback-compatible assets.');
