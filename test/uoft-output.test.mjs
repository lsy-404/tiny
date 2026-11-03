import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist/p/uoft');
const origin = 'https://tiny.leisiyu.dev/p/uoft';
const sitemap = await readFile(join(root, 'dist/sitemap.xml'), 'utf8');
for (const page of ['', 'calendar', 'planner', 'faq', 'statement']) {
  const html = await readFile(join(output, page ? page + '.html' : 'index.html'), 'utf8');
  const canonical = origin + (page ? '/' + page : '/');
  assert(html.includes('<link rel="canonical" href="' + canonical + '"'), page + ' canonical');
  assert(sitemap.includes('<loc>' + canonical + '</loc>'), page + ' is discoverable');
  assert.equal((html.match(/name="home-url"/g) || []).length, 1, page + ' return link');
  assert(html.includes('content="/"'), page + ' portal destination');
  for (const [, asset] of html.matchAll(/(?:src|href)="(\/p\/uoft\/assets\/[^"?#]+)"/g)) {
    assert((await stat(join(root, 'dist', asset))).isFile(), asset);
  }
}
let calendars = 0;
let plannerData = 0;
for (const directory of ['calendar', 'planner/data']) {
  const source = join(root, 'apps/uoft/data', directory);
  for (const name of await readdir(source)) {
    if (!/\.(ics|json)$/.test(name)) continue;
    const expected = await readFile(join(source, name), 'utf8');
    const actual = await readFile(join(output, directory, name), 'utf8');
    assert.equal(actual, expected, directory + '/' + name);
    if (name.endsWith('.ics')) {
      assert.match(actual, /BEGIN:VCALENDAR/);
      calendars++;
    } else {
      JSON.parse(actual);
      plannerData++;
    }
  }
}
assert(calendars > 0 && plannerData > 0, 'Calendar and planner data are published');
const notFound = await readFile(join(output, '404.html'), 'utf8');
assert.match(notFound, /noindex/);
console.log('Verified UofT pages, crawler discovery, assets, ' + calendars + ' calendars and ' + plannerData + ' planner data files.');
