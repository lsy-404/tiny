import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const coverWidth = 540;
const raster = /\.(?:png|jpe?g|webp)$/i;

export const escapeHtml = (text) => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const metaTags = (properties) => properties.map(([attribute, key, value]) => `<meta ${attribute}="${key}" content="${escapeHtml(value)}">`);

// Newest first by `released`; the number shown on a card is its age rank, so it stays when newer projects arrive.
export function orderProjects(catalog) {
  const newestFirst = [...catalog].sort((a, b) => b.released.localeCompare(a.released));
  return newestFirst.map((project, index) => ({ project, number: newestFirst.length - index }));
}

// Covers are shown at most ~270 CSS px wide, so a 2x WebP replaces the full-size PNG; SVG covers are kept.
export async function prepareCovers(catalog, output) {
  const covers = new Map();
  for (const project of catalog) {
    if (!project.cover) continue;
    const source = join(output, project.cover);
    if (!raster.test(source)) {
      const { width, height } = await sharp(source).metadata();
      covers.set(project.slug, { src: project.cover, width, height });
      continue;
    }
    const target = join(output, 'assets', 'covers', `${project.slug}.webp`);
    await mkdir(dirname(target), { recursive: true });
    const { width, height } = await sharp(source).resize({ width: coverWidth, withoutEnlargement: true }).webp({ quality: 80 }).toFile(target);
    covers.set(project.slug, { src: `./assets/covers/${project.slug}.webp`, width, height });
  }
  return covers;
}

function renderCard({ project, number }, index, covers) {
  const cover = covers.get(project.slug);
  const image = cover
    ? `<img class="card-cover" src="${escapeHtml(cover.src)}" alt="${escapeHtml(project.coverAlt || `${project.title} 预览图`)}" width="${cover.width}" height="${cover.height}" decoding="async"${index < 2 ? '' : ' loading="lazy"'}>`
    : '';
  const kicker = [String(number).padStart(2, '0'), project.eyebrow].filter(Boolean).join(' · ');
  return `<article class="project-card project-card-${index + 1}${cover ? ' has-cover' : ''}" data-category="${escapeHtml(project.category)}">${image}`
    + `<p class="card-kicker">${escapeHtml(kicker)}</p><h2>${escapeHtml(project.title)}</h2>`
    + `<p class="card-description">${escapeHtml(project.description)}</p><p class="card-credit">${escapeHtml(project.credit)}</p>`
    + `<div class="card-footer"><span>${escapeHtml(project.meta || '')}</span>`
    + `<a href="./${project.path}/" aria-label="${escapeHtml(`${project.action}：${project.title}`)}">${escapeHtml(project.action)}</a></div></article>`;
}

export function renderHome(template, catalog, covers, siteUrl) {
  const ordered = orderProjects(catalog);
  const title = /<title>([^<]*)<\/title>/.exec(template)[1];
  const description = `Tiny Projects 是可直接在浏览器中使用的小工具、游戏与互动作品：${ordered.map(({ project }) => project.title).join('、')}。`;
  const image = catalog.find(({ cover }) => cover && raster.test(cover));
  const seo = [
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<link rel="canonical" href="${siteUrl}/">`,
    ...metaTags([
      ['property', 'og:type', 'website'],
      ['property', 'og:site_name', 'Tiny Projects'],
      ['property', 'og:locale', 'zh_CN'],
      ['property', 'og:title', title],
      ['property', 'og:description', description],
      ['property', 'og:url', `${siteUrl}/`],
      ...(image ? [['property', 'og:image', new URL(image.cover, `${siteUrl}/`).href]] : [])
    ]),
    `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Tiny Projects', url: `${siteUrl}/`, inLanguage: 'zh-Hans' })}</script>`
  ].join('\n    ');
  return template
    .replace('<!--seo-->', seo)
    .replace('<!--project-count-->', `${String(catalog.length).padStart(2, '0')} 个项目`)
    .replace('<!--project-cards-->', ordered.map((entry, index) => renderCard(entry, index, covers)).join('\n'));
}

// Gives a hosted project page a canonical URL, a description and Open Graph tags, and a heading for crawlers when the page renders none itself.
export function patchProjectPage(html, project, siteUrl) {
  const url = `${siteUrl}/${project.path}/`;
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? project.title;
  const image = project.cover && raster.test(project.cover) ? new URL(project.cover, `${siteUrl}/`).href : undefined;
  const seo = [
    `<meta name="description" content="${escapeHtml(project.description)}">`,
    `<link rel="canonical" href="${url}">`,
    ...metaTags([
      ['property', 'og:type', 'website'],
      ['property', 'og:site_name', 'Tiny Projects'],
      ['property', 'og:locale', 'zh_CN'],
      ['property', 'og:title', title],
      ['property', 'og:description', project.description],
      ['property', 'og:url', url],
      ...(image ? [['property', 'og:image', image]] : [])
    ])
  ].join('\n');
  let page = html
    .replace(/<meta\s+name="description"[^>]*>\s*/g, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/g, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/g, '')
    .replace('</head>', `${seo}\n</head>`);
  if (!/<h1[\s>]/.test(page)) {
    page = page.replace(/<body[^>]*>/, (body) => `${body}\n<noscript><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.description)}</p></noscript>`);
  }
  return page;
}

export async function writeCrawlerFiles(output, catalog, siteUrl) {
  const urls = [`${siteUrl}/`, ...orderProjects(catalog).map(({ project }) => `${siteUrl}/${project.path}/`)];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile(join(output, 'sitemap.xml'), sitemap);
  await writeFile(join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
}
