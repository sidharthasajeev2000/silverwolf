import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const expectedBase = process.argv[2] || '/';
const html = readFileSync('dist/index.html', 'utf8');
assert(!html.includes('document.write'), 'Base must not depend on runtime JavaScript');
const baseMatch = /<base href="([^"]+)"/.exec(html);
assert(baseMatch, 'Built HTML must contain a static base');
assert.equal(baseMatch[1], expectedBase);
const refs = [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"[^>]*>/g)]
  .map(m => ({ path: m[1], index: m.index }))
  .filter(ref => /(?:\.js|\.css|favicon\.svg)$/.test(ref.path));
assert(refs.some(ref => ref.path.endsWith('.js')), 'Must check a built script');
assert(refs.some(ref => ref.path.endsWith('.css')), 'Must check a built stylesheet');
assert(refs.some(ref => ref.path.endsWith('favicon.svg')), 'Must check the favicon');
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const routes = [...sitemap.matchAll(/<loc>https:\/\/silverwolf\.in([^<]*)<\/loc>/g)].map(m => m[1]);
assert(routes.length > 1, 'Must check nested sitemap routes');
for (const route of [...routes, '/shop/ember-wolf-figurine/']) {
  const page = new URL(expectedBase + route.replace(/^\//, ''), 'https://test.invalid');
  const base = new URL(baseMatch[1], page);
  for (const ref of refs) {
    assert(baseMatch.index < ref.index, 'Static base must precede all asset references');
    const url = new URL(ref.path, base);
    assert(url.pathname.startsWith(expectedBase));
    const relative = decodeURIComponent(url.pathname.slice(expectedBase.length));
    assert(existsSync(resolve('dist', relative)), `${route}: missing ${url.pathname}`);
    assert(!url.pathname.startsWith(`${expectedBase}shop/assets/`));
  }
}
console.log(`PASS: ${refs.length} assets resolve for ${routes.length} sitemap routes plus trailing-slash product route (base ${expectedBase})`);
