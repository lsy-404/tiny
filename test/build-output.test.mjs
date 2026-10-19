import { access, readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const output = join(root, 'dist');
const catalog = JSON.parse(await readFile(join(root, 'apps', 'portal', 'projects.json'), 'utf8'));
const expectedCredits = new Map([
  ['honeypot-dessert', '作者：槃清'],
  ['vocal-score', '委托：奥莉安多 · 设计、编码：武乙凌薇 · 开源代码 AGPL-3.0'],
  ['cassie', '设计、编码：武乙凌薇 · 开源代码 AGPL-3.0 · 音频改编自 SCP: Secret Laboratory（Northwood Studios，CC BY-SA 3.0）'],
  ['cassandri-legend', '主创：槃清 · 编码：武乙凌薇'],
  ['ten-light-years', '美术、设计、编码：武乙凌薇 · 数据处理：StarryMiko2233']
]);
const repositoryOnly = ['.git', '.gitattributes', '.gitignore', 'node_modules', 'package.json', 'pnpm-lock.yaml', 'reference', 'test'];
const homeUrl = (await readFile(join(root, 'tiny.env'), 'utf8')).match(/^HOME_URL=(.+)$/m)?.[1].trim();
if (!homeUrl) throw new Error('tiny.env must define HOME_URL.');

async function mustExist(path) {
  await access(path);
  return path;
}

await Promise.all([
  mustExist(join(output, 'index.html')),
  mustExist(join(output, 'styles.css')),
  mustExist(join(output, 'app.js')),
  mustExist(join(output, 'projects.json'))
]);

for (const project of catalog) {
  const entry = join(output, project.path, 'index.html');
  await mustExist(entry);
  if (!(await stat(entry)).isFile()) throw new Error(`Expected a file: ${entry}`);
  if (!project.credit) throw new Error(`Catalog entry ${project.slug} is missing its creator credit.`);
  if (project.credit !== expectedCredits.get(project.slug)) {
    throw new Error(`Catalog entry ${project.slug} has an unexpected creator credit.`);
  }
  const sourceReadme = join(root, project.source ?? project.path, 'README.md');
  if (project.path.startsWith('games/') && await access(sourceReadme).then(() => true, () => false)) {
    if (await readFile(sourceReadme, 'utf8') !== await readFile(join(output, project.path, 'README.md'), 'utf8')) {
      throw new Error(`The ${project.slug} README was not preserved in the build output.`);
    }
  }
  if (!(await readFile(entry, 'utf8')).includes(`<meta name="home-url" content="${homeUrl}">\n</head>`)) {
    throw new Error(`${project.slug} must carry the HOME_URL from tiny.env as its home-url meta.`);
  }
  for (const name of repositoryOnly) {
    if (await access(join(output, project.path, name)).then(() => true, () => false)) {
      throw new Error(`Repository file ${name} from ${project.slug} must not be published.`);
    }
  }
}
if (expectedCredits.size !== catalog.length) throw new Error('Every catalog entry needs an expected credit in this test.');

const cassieEntry = catalog.find((project) => project.slug === 'cassie');
if (!cassieEntry || cassieEntry.path !== 'projects/cassie') {
  throw new Error('The CASSIE catalog entry must use the projects/cassie route.');
}
const cassieOutput = join(output, 'projects', 'cassie');
const cassieHtml = await readFile(join(cassieOutput, 'index.html'), 'utf8');
const cassieAssets = [...cassieHtml.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((asset) => asset.startsWith('/projects/cassie/') || asset.startsWith('./'));
if (!cassieAssets.some((asset) => /\.m?js(?:\?|$)/.test(asset))) {
  throw new Error('The CASSIE subpath entry does not reference its emitted application bundle.');
}
for (const asset of cassieAssets) {
  const relative = asset.startsWith('./') ? asset.slice(2) : asset.replace(/^\/projects\/cassie\//, '');
  await mustExist(join(cassieOutput, relative));
}
const cassieFiles = await readdir(cassieOutput, { recursive: true });
if (!cassieFiles.some((file) => /worker/i.test(file) && /\.m?js$/.test(file))) {
  throw new Error('The CASSIE build is missing its emitted worker JavaScript asset.');
}
const headersPath = join(output, '_headers');
const headers = await readFile(headersPath, 'utf8');
const headerRules = headers.split(/\r?\n/).filter((line) => line && !line.startsWith('#') && !/^\s/.test(line));
if (!headerRules.length || headerRules.some((rule) => !rule.startsWith('/projects/cassie/'))) {
  throw new Error('Every root _headers rule must be scoped under /projects/cassie/.');
}
if (!/content-security-policy\s*:/i.test(headers) || !/x-content-type-options\s*:\s*nosniff/i.test(headers)) {
  throw new Error('The CASSIE-scoped headers must include CSP and nosniff.');
}
if (/cross-origin-(?:embedder|opener)-policy/i.test(headers)) {
  throw new Error('The CASSIE deployment must not add cross-origin isolation headers.');
}

await Promise.all([
  mustExist(join(output, 'games', 'cassandri-legend', 'fonts', 'fusion-pixel-12px-proportional-zh_hans.otf.woff2')),
  mustExist(join(output, 'games', 'ten-light-years', 'main.js')),
  mustExist(join(output, 'games', 'ten-light-years', 'vendor', 'three.module.js')),
  mustExist(join(output, 'games', 'ten-light-years', 'data', 'stars.bin')),
  mustExist(join(output, 'games', 'ten-light-years', 'data', 'edges.bin')),
  mustExist(join(output, 'games', 'ten-light-years', 'data', 'edge_weights.bin')),
  mustExist(join(output, 'games', 'ten-light-years', 'data', 'tracks.json')),
  mustExist(join(output, 'games', 'ten-light-years', 'data', 'sizes.json')),
  mustExist(join(output, 'games', 'ten-light-years', 'audio', 'star-lalala.m4a')),
  mustExist(join(output, 'games', 'ten-light-years', 'audio', 'star-wish.m4a'))
]);

for (const asset of ['stars.bin', 'edges.bin', 'edge_weights.bin']) {
  const path = join(output, 'games', 'ten-light-years', 'data', asset);
  if ((await stat(path)).size === 0) throw new Error(`The binary star-map asset is empty: ${asset}`);
}

const cassandriHtml = await readFile(join(output, 'games', 'cassandri-legend', 'index.html'), 'utf8');
const cassandriStyles = await readFile(join(output, 'games', 'cassandri-legend', 'styles.css'), 'utf8');
const cassandriRuntime = await readFile(join(output, 'games', 'cassandri-legend', 'game.js'), 'utf8');
const cassandri = `${cassandriHtml}\n${cassandriStyles}\n${cassandriRuntime}`;
if (!cassandri.includes('fonts/fusion-pixel-12px-proportional-zh_hans.otf.woff2')) {
  throw new Error('The Cassandri Legend entry does not reference its packaged pixel font.');
}
if (!cassandri.includes('@media (max-width:760px)') || !cassandri.includes('#app{--mobile-topbar:68px;min-width:0') || !cassandri.includes('.modal-grid,.loot-grid,.set-grid{grid-template-columns:1fr')) {
  throw new Error('Cassandri Legend is missing its narrow-screen layout rules.');
}
if (!cassandri.includes('.overlay{inset:var(--mobile-topbar) 0 0') || !cassandri.includes('max-height:calc(100dvh - var(--mobile-topbar) - 24px)')) {
  throw new Error('Cassandri Legend mobile overlays must reserve the top bar area.');
}
if (!cassandri.includes('id="difficultyOverlay"') || !cassandri.includes('function showDifficultyInfo()') || !cassandri.includes('id="btnDifficultyPrev"') || !cassandri.includes('id="btnDifficultyNext"') || !cassandri.includes('id="difficultyMultiplier"') || !cassandri.includes('id="difficultyTraits"') || !cassandri.includes('id="difficultyEffects"')) {
  throw new Error('Cassandri Legend is missing its focus-based difficulty selection panel.');
}
if (!cassandri.includes('function getNextEnemyForecast()') || !cassandri.includes('function getExpectedCrit20xMultFor(slots)') || !cassandri.includes('function getComparisonTarget()') || !cassandri.includes('function rememberLastBattle()') || !cassandri.includes('lastBattleSnapshot')) {
  throw new Error('Cassandri Legend must retain the forecast and critical-hit recommendation while adding battle snapshots.');
}

const tenLightYears = await readFile(join(output, 'games', 'ten-light-years', 'index.html'), 'utf8');
if (!tenLightYears.includes('viewport-fit=cover') || !tenLightYears.includes('@media (pointer: coarse)')) {
  throw new Error('Ten Light Years is missing its touch-screen viewport and control rules.');
}
if (cassandri.includes('archive-exit') || tenLightYears.includes('archive-exit')) {
  throw new Error('A game exit control must be located in its settings menu, not fixed to the page.');
}
if (!cassandri.includes('id="btnExitToPortal"') || !cassandri.includes('href="../../"') || !cassandri.includes('返回 Tiny Projects')) {
  throw new Error('Cassandri Legend is missing its settings-menu exit control.');
}
if (!tenLightYears.includes('id="exit-game"') || !tenLightYears.includes('href="../../"') || !tenLightYears.includes('返回 Tiny Projects')) {
  throw new Error('Ten Light Years is missing its settings-menu exit control.');
}
if (!cassandriHtml.includes('href="./styles.css"') || !cassandriHtml.includes('src="./game.js"')) {
  throw new Error('Built Cassandri HTML has invalid asset references.');
}
const honeypot = await readFile(join(output, 'games', 'honeypot-dessert', 'index.html'), 'utf8');
await mustExist(join(output, 'games', 'honeypot-dessert', 'icon.svg'));
if (!honeypot.includes('<title>蜜罐甜品屋 | Tiny Projects</title>') || !honeypot.includes('id="btnExit" href="../../"') || !honeypot.includes('返回 Tiny Projects')) {
  throw new Error('The Honeypot Dessert House is missing its title or exit control.');
}
if (/cheat|修改器/i.test(honeypot)) throw new Error('The hosted Honeypot Dessert House must not ship the test cheat tool.');
if (honeypot.includes('只展示下一次升级带来的变化')) throw new Error('The Honeypot Dessert House shop still shows a leaked design note.');
await mustExist(join(output, 'games', 'honeypot-dessert', 'assets', 'emoji', 'LICENSE'));
if (/[→✓★☆]/u.test(honeypot)) throw new Error('The Honeypot Dessert House must draw arrows, checks and stars without text symbols.');
const cassandriMenu = [
  cassandri.indexOf('id="btnContinue"'),
  cassandri.indexOf('id="btnNewGame"'),
  cassandri.indexOf('id="btnHomeSave"'),
  cassandri.indexOf('id="btnChangelog"'),
  cassandri.indexOf('id="btnHomeShop"'),
  cassandri.indexOf('id="btnHomeExitToPortal"')
];
if (cassandriMenu.some((index) => index < 0) || !cassandriMenu.every((index, position) => position === 0 || cassandriMenu[position - 1] < index)) {
  throw new Error('Cassandri Legend must order home actions as Continue, New Game, save, updates, shop, then exit.');
}
if (!cassandri.includes('id="btnHomeExitToPortal"') || !cassandri.includes('function requestReset()') || !cassandri.includes('function confirmReset()') || !cassandri.includes('确认施放') || !cassandri.includes('取消')) {
  throw new Error('Cassandri Legend is missing the home exit or explicit reset confirmation controls.');
}
if (cassandri.includes('<h3>难度装备位</h3>')) {
  throw new Error('Difficulty-unlocked equipment slots must not be shown as a shop item.');
}
if (!/<h3>潘多拉之盒<\/h3>[\s\S]*<h3>大记忆消失术<\/h3>/.test(cassandri)) {
  throw new Error('The manually triggered reset must be the final shop item.');
}

const home = await readFile(join(output, 'index.html'), 'utf8');
if (!home.includes('project-grid') || !home.includes('app.js') || !home.includes('Tiny Projects') || !home.includes('id="about"') || !home.includes('本站作者：Siyu Lei')) {
  throw new Error('The portal home page is missing its project list or concise about information.');
}
if (home.includes('收录') || home.includes('静态发布') || home.includes('关于本站')) {
  throw new Error('The portal home page contains content outside the project list.');
}

const portalScript = await readFile(join(output, 'app.js'), 'utf8');
if (portalScript.includes('收录') || !portalScript.includes('个项目')) {
  throw new Error('The portal project count does not match the simplified wording.');
}
const portalStyles = await readFile(join(output, 'styles.css'), 'utf8');
if (!portalStyles.includes('min-height: 44px') || !portalStyles.includes('@media (max-width: 680px)')) {
  throw new Error('The portal is missing its mobile card layout or tap-target sizing.');
}

console.log(`Verified ${catalog.length} project entries and the portal shell.`);
