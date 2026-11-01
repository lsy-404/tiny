import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative, resolve, sep } from 'node:path';
import { patchProjectPage, prepareCovers, renderHome, writeCrawlerFiles } from './seo.mjs';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const portal = join(root, 'apps', 'portal');
const output = join(root, 'dist');
const catalog = JSON.parse(await readFile(join(portal, 'projects.json'), 'utf8'));

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function fileCount(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const counts = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? fileCount(path) : 1;
  }));
  return counts.reduce((total, count) => total + count, 0);
}

assert(Array.isArray(catalog) && catalog.length > 0, 'The project catalog must contain at least one entry.');
assert(new Set(catalog.map(({ slug }) => slug)).size === catalog.length, 'Every project slug must be unique.');
assert(new Set(catalog.map(({ path }) => path)).size === catalog.length, 'Every project path must be unique.');

// Every project lives in a submodule; its repository files are not part of the site.
const repositoryOnly = new Set(['.git', '.gitattributes', '.gitignore', 'node_modules', 'package.json', 'pnpm-lock.yaml', 'reference', 'test']);
const categories = new Set(['personal', 'commissioned', 'collaboration', 'hosted']);
const projectPath = /^(?:[a-z0-9-]+\/)*[a-z0-9-]+$/;
// HOME_URL (tiny.env, overridable by the environment) is where every project's return link points.
// It reaches the projects as <meta name="home-url">; a project built or hosted without it shows no return link.
const homeUrl = process.env.HOME_URL?.trim() ?? '';
const siteUrl = process.env.SITE_URL?.trim().replace(/\/$/, '') ?? '';
assert(/^https:\/\/[^/]+$/.test(siteUrl), 'SITE_URL must be an https origin without a path.');
const homeMeta = homeUrl && `<meta name="home-url" content="${homeUrl.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}">`;

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(portal, output, { recursive: true });

for (const project of catalog) {
  assert(/^[a-z0-9-]+$/.test(project.slug), `Invalid project slug: ${project.slug}`);
  assert(typeof project.path === 'string' && projectPath.test(project.path), `Invalid project path: ${project.path}`);
  assert(project.source === undefined || projectPath.test(project.source), `Invalid project source: ${project.source}`);
  assert(project.title && project.description && project.credit && project.action, `Catalog entry ${project.slug} is incomplete.`);
  assert(categories.has(project.category), `Catalog entry ${project.slug} needs a category: ${[...categories].join(', ')}.`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(project.released ?? ''), `Catalog entry ${project.slug} needs a YYYY-MM-DD release date.`);

  const source = join(root, project.source ?? project.path);
  const entry = join(source, 'index.html');
  const destination = join(output, project.path);
  assert((await stat(entry)).isFile(), `Missing entry file: ${project.source ?? project.path}/index.html`);
  await mkdir(destination, { recursive: true });
  await cp(source, destination, { recursive: true, filter: (file) => !repositoryOnly.has(relative(source, file).split(sep)[0]) });

  const page = join(destination, 'index.html');
  const html = await readFile(page, 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));
  assert(html.includes('</head>') && !/<meta\s+name="home-url"/.test(head), `${project.slug} needs a </head> and no home-url meta of its own.`);
  const patched = patchProjectPage(html, project, siteUrl);
  await writeFile(page, homeMeta ? patched.replace('</head>', `${homeMeta}\n</head>`) : patched);
}

const covers = await prepareCovers(catalog, output);
const home = join(output, 'index.html');
await writeFile(home, renderHome(await readFile(home, 'utf8'), catalog, covers, siteUrl));
await writeCrawlerFiles(output, catalog, siteUrl);

const cassieHeaders = await readFile(join(root, 'projects/cassie/_headers'), 'utf8');
await writeFile(join(output, '_headers'), cassieHeaders.replace(/^\//gm, '/projects/cassie/'));

console.log(`Built ${catalog.length} entries and ${await fileCount(output)} static files in dist/; ${homeUrl ? `return links point to ${homeUrl}` : 'HOME_URL is not set, so projects show no return link'}.`);
