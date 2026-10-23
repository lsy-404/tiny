import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const catalog = JSON.parse(await readFile(join(root, 'apps', 'portal', 'projects.json'), 'utf8'));
const modules = await readFile(join(root, '.gitmodules'), 'utf8');

// The four kinds of credit classify each project; the credit line itself names people and roles only.
const expectedCategories = {
  'arknights-card': 'personal',
  'honeypot-dessert': 'hosted',
  'vocal-score': 'commissioned',
  cassie: 'personal',
  'cassandri-legend': 'collaboration',
  'ten-light-years': 'collaboration'
};
assert.deepEqual(Object.fromEntries(catalog.map(({ slug, category }) => [slug, category])), expectedCategories);
for (const project of catalog) {
  assert.match(project.released, /^\d{4}-\d{2}-\d{2}$/, `${project.slug} needs a release date`);
  assert.doesNotMatch(project.credit, /独立|受委托|合作|托管/, `${project.slug} credit must not name its category`);
}

// Tiny keeps no project sources of its own: every entry is built from a submodule.
const submodules = [...modules.matchAll(/^\s*path = (.+)$/gm)].map((match) => match[1].trim());
const sourceRoots = { 'projects/cassie': 'apps/cassie', 'projects/vocal-score': 'apps/vocal-score' };
for (const project of catalog) {
  const source = sourceRoots[project.path] ?? project.source ?? project.path;
  assert(submodules.some((path) => source === path || source.startsWith(`${path}/`)), `${project.slug} must come from a submodule`);
}
assert.equal(submodules.length, catalog.length, 'Each project has exactly one submodule');

console.log(`Verified categories, release dates, credits and submodule sources for ${catalog.length} projects.`);
