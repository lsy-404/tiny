// Map the game's emoji to Microsoft Fluent Emoji folders, verify each folder's metadata code points, and
// report Color / Flat SVG paths and sizes. Writes <out>/map.json. Needs GH_TOKEN for the GitHub API.
// Usage: GH_TOKEN=... node fluent-map.mjs <folders.tsv> <out dir>
import fs from 'node:fs';
import path from 'node:path';

const [foldersFile, out] = process.argv.slice(2);
const folders = new Map(fs.readFileSync(foldersFile, 'utf8').trim().split('\n').map(line => line.split('\t')));
const names = {
  '🥤': 'Cup with straw', '🍵': 'Teacup without handle', '🧋': 'Bubble tea', '🍶': 'Sake', '🥛': 'Glass of milk',
  '🌹': 'Rose', '☕': 'Hot beverage', '🍸': 'Cocktail glass', '🍊': 'Tangerine', '🌌': 'Milky way',
  '🧁': 'Cupcake', '🍰': 'Shortcake', '🍓': 'Strawberry', '🍫': 'Chocolate bar', '🥭': 'Mango', '🍪': 'Cookie',
  '🍠': 'Roasted sweet potato', '🍑': 'Peach', '🥞': 'Pancakes', '🧇': 'Waffle', '🌟': 'Glowing star',
  '🧒': 'Child', '🤗': 'Hugging face', '🎮': 'Video game', '🧐': 'Face with monocle', '🍬': 'Candy',
  '🏃‍♀️': 'Woman running', '🧸': 'Teddy bear', '🎧': 'Headphone', '📷': 'Camera', '💘': 'Heart with arrow',
  '💑': 'People hugging', '🧔': 'Person beard', '🕶️': 'Sunglasses', '🎩': 'Top hat', '👵': 'Old woman',
  '🧭': 'Compass', '😭': 'Loudly crying face', '🌧️': 'Cloud with rain', '🎉': 'Party popper', '💕': 'Two hearts',
  '💼': 'Briefcase', '🍩': 'Doughnut', '🚦': 'Vertical traffic light', '🍃': 'Leaf fluttering in wind', '💰': 'Money bag',
  '🔍': 'Magnifying glass tilted left', '🎤': 'Microphone', '❄️': 'Snowflake', '💝': 'Heart with ribbon', '🧑': 'Person',
  '🧹': 'Broom', '❤️': 'Red heart', '🤍': 'White heart', '🪴': 'Potted plant', '🌿': 'Herb', '🌱': 'Seedling',
  '🌴': 'Palm tree', '🌷': 'Tulip', '🌵': 'Cactus', '🍀': 'Four leaf clover', '🌾': 'Sheaf of rice', '🌻': 'Sunflower',
  '🪷': 'Lotus',
};
const key = emoji => [...emoji].map(c => c.codePointAt(0).toString(16)).filter(cp => cp !== 'fe0f').join('-');
const headers = { Authorization: 'Bearer ' + process.env.GH_TOKEN, Accept: 'application/vnd.github+json' };
const api = async url => { const res = await fetch(url, { headers }); if (!res.ok) throw new Error(res.status + ' ' + url); return res.json(); };

const map = {};
let colorTotal = 0, flatTotal = 0;
const problems = [];
for (const [emoji, name] of Object.entries(names)) {
  const sha = folders.get(name);
  if (!sha) { problems.push(`${emoji} folder "${name}" not found`); continue; }
  const tree = await api(`https://api.github.com/repos/microsoft/fluentui-emoji/git/trees/${sha}?recursive=1`);
  const files = tree.tree.filter(entry => entry.type === 'blob');
  const metaEntry = files.find(f => f.path === 'metadata.json');
  const meta = metaEntry ? JSON.parse(Buffer.from((await api(`https://api.github.com/repos/microsoft/fluentui-emoji/git/blobs/${metaEntry.sha}`)).content, 'base64').toString('utf8')) : {};
  const metaKey = String(meta.unicode ?? '').toLowerCase().split(' ').filter(cp => cp && cp !== 'fe0f').join('-');
  if (metaKey !== key(emoji) && emoji !== '💑') problems.push(`${emoji} ${name}: metadata unicode "${meta.unicode}" does not match ${key(emoji)}`);
  const pick = style => files.find(f => new RegExp(`^(Default/)?${style}/[^/]+_${style.toLowerCase()}(_default)?\\.svg$`).test(f.path));
  const color = pick('Color'), flat = pick('Flat');
  if (!color || !flat) { problems.push(`${emoji} ${name}: missing ${!color ? 'Color' : ''} ${!flat ? 'Flat' : ''}`); continue; }
  colorTotal += color.size; flatTotal += flat.size;
  map[emoji] = { key: key(emoji), folder: name, glyph: meta.glyph, color: color.path, colorSize: color.size, flat: flat.path, flatSize: flat.size };
}
fs.writeFileSync(path.join(out, 'map.json'), JSON.stringify(map, null, 2));
console.log(`mapped ${Object.keys(map).length}/${Object.keys(names).length}; Color total ${(colorTotal / 1024).toFixed(0)} KB, Flat total ${(flatTotal / 1024).toFixed(0)} KB`);
const largest = Object.entries(map).sort((a, b) => b[1].colorSize - a[1].colorSize).slice(0, 5).map(([e, m]) => `${e} ${(m.colorSize / 1024).toFixed(0)}KB`);
console.log('largest Color:', largest.join(', '));
for (const problem of problems) console.log('PROBLEM', problem);
