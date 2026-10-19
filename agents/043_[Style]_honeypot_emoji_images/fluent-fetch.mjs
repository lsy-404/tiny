// Download the mapped Fluent Emoji Color SVGs (named by code point) and the repository LICENSE, then check that
// every SVG is plain vector art: no script, event handler, foreignObject, external reference or data URL.
// Usage: node fluent-fetch.mjs <download dir with map.json>
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
const map = JSON.parse(fs.readFileSync(path.join(dir, 'map.json'), 'utf8'));
const svgDir = path.join(dir, 'svg');
fs.mkdirSync(svgDir, { recursive: true });
const raw = p => 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/' + p.split('/').map(encodeURIComponent).join('/');

const license = await fetch(raw('LICENSE'));
if (!license.ok) throw new Error('LICENSE ' + license.status);
fs.writeFileSync(path.join(dir, 'LICENSE'), await license.text());

const unsafe = /<script|\son[a-z]+\s*=|<foreignObject|(?:href|src)\s*=\s*["'](?!#)|url\(\s*["']?(?!#)|data:/i;
let bytes = 0;
const problems = [];
for (const [emoji, entry] of Object.entries(map)) {
  const res = await fetch(raw('assets/' + entry.folder + '/' + entry.color));
  if (!res.ok) { problems.push(`${emoji} ${res.status}`); continue; }
  const svg = await res.text();
  if (!svg.trimStart().startsWith('<svg') || unsafe.test(svg)) problems.push(`${emoji} ${entry.key}: unexpected content`);
  fs.writeFileSync(path.join(svgDir, entry.key + '.svg'), svg);
  bytes += Buffer.byteLength(svg);
}
console.log(`downloaded ${fs.readdirSync(svgDir).length} SVGs, ${(bytes / 1024).toFixed(0)} KB; LICENSE ${fs.statSync(path.join(dir, 'LICENSE')).size} bytes`);
for (const problem of problems) console.log('PROBLEM', problem);
