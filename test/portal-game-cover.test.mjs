import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const catalog = JSON.parse(await readFile(join(root, 'apps', 'portal', 'projects.json'), 'utf8'));
const styles = await readFile(join(root, 'apps', 'portal', 'styles.css'), 'utf8');
const legend = catalog.find(({ slug }) => slug === 'cassandri-legend');
const tenLightYears = catalog.find(({ slug }) => slug === 'ten-light-years');
const honeypot = catalog.find(({ slug }) => slug === 'honeypot-dessert');

assert.equal(legend?.cover, './games/cassandri-legend/assets/cover.png');
assert.equal(legend?.coverAlt, '卡桑德里传说船上银发人物马赛克封面');
assert.equal(tenLightYears?.cover, './games/ten-light-years/assets/preview.png');
assert.equal(tenLightYears?.coverAlt, '十光年的距离实际星图预览');
assert.equal(honeypot?.cover, './games/honeypot-dessert/assets/preview.png');
assert.equal(honeypot?.coverAlt, '蜜罐甜品屋营业中的用餐区');
assert.match(styles, /\.card-cover\s*\{/);
assert.match(styles, /mask-image:\s*linear-gradient/);

await access(join(root, 'dist', 'games', 'cassandri-legend', 'assets', 'cover.png'));
await access(join(root, 'dist', 'games', 'ten-light-years', 'assets', 'preview.png'));
await access(join(root, 'dist', 'games', 'honeypot-dessert', 'assets', 'preview.png'));

console.log('Verified the three game previews in the catalog, card rendering, and build output.');
