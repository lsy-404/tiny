import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { patchProjectPage, renderHome, writeCrawlerFiles } from '../scripts/seo.mjs';

const root = await mkdtemp(join(tmpdir(), 'tiny-seo-routes-'));
const siteUrl = 'https://tiny.leisiyu.dev';
const catalog = [
  { slug: 'arknights-card', path: 'p/arknights-card', title: '博士扩列档案', description: '项目简介', released: '2026-10-23', credits: [{ name: 'Sayoko.', role: '原作' }] },
  { slug: 'uoft', path: 'p/uoft', title: 'UofT Tools', description: 'Student tools', released: '2026-11-03', credits: [{ name: '武乙凌薇', role: '设计、编码' }] },
  { slug: 'honeypot-dessert', path: 'games/honeypot-dessert', title: '蜜罐甜品屋', description: '游戏简介', released: '2026-10-17', credits: [{ name: '槃清', role: '作者' }] }
];

try {
  const home = '<!doctype html><html><head><title>Tiny</title></head><body><!--project-cards--></body></html>';
  const renderedHome = renderHome(home, catalog, new Map(), siteUrl);
  assert(renderedHome.includes('href="./p/arknights-card/"'));
  assert(renderedHome.includes('href="./p/uoft/"'));

  const projectHtml = patchProjectPage('<html><head><title>Project</title></head><body><h1>Project</h1></body></html>', catalog[0], siteUrl);
  assert(projectHtml.includes(`<link rel="canonical" href="${siteUrl}/p/arknights-card/">`));

  for (const project of catalog) await mkdir(join(root, project.path), { recursive: true });
  await writeFile(join(root, 'p/uoft/calendar.html'), '<html><head><title>Calendar</title></head><body></body></html>');
  await writeFile(join(root, 'p/uoft/sitemap.xml'), [
    '<urlset>',
    '<url><loc>https://tiny.leisiyu.dev/p/uoft/</loc></url>',
    '<url><loc>https://tiny.leisiyu.dev/p/uoft/calendar</loc></url>',
    '<url><loc>https://tiny.leisiyu.dev/p/uoft/planner</loc></url>',
    '<url><loc>https://tiny.leisiyu.dev/p/uoft/404</loc></url>',
    '<url><loc>https://tiny.leisiyu.dev/p/other/not-in-this-project</loc></url>',
    '<url><loc>https://external.example/p/uoft/external</loc></url>',
    '</urlset>'
  ].join(''));

  await writeCrawlerFiles(root, catalog, siteUrl);
  const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
  const redirects = await readFile(join(root, '_redirects'), 'utf8');
  assert(sitemap.includes(`${siteUrl}/p/uoft/`));
  assert(sitemap.includes(`${siteUrl}/p/uoft/calendar`));
  assert(sitemap.includes(`${siteUrl}/p/uoft/planner`));
  assert(!sitemap.includes('/p/uoft/404'));
  assert(!sitemap.includes('/p/other/'));
  assert(!sitemap.includes('external.example'));
  assert(sitemap.includes(`${siteUrl}/games/honeypot-dessert/`));
  assert(redirects.includes('/projects/arknights-card /p/arknights-card/ 301'));
  assert(redirects.includes('/projects/arknights-card/ /p/arknights-card/ 301'));
  assert(redirects.includes('/projects/* /p/:splat 301'));
  assert(redirects.includes('/projects/ /p/ 301'));
  assert(redirects.includes('/p/ / 301'));
} finally {
  await rm(root, { recursive: true, force: true });
}

console.log('Verified short project routes, canonical links, legacy redirects and subproject sitemap merging.');
