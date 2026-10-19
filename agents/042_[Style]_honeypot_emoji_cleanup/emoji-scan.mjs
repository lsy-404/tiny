// List emoji in a file by line, so they can be sorted into UI labels and game art.
// Usage: node emoji-scan.mjs <file> [--summary]
import fs from 'node:fs';

const [file, flag] = process.argv.slice(2);
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
const re = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator})(?:️|‍(?:\p{Extended_Pictographic})|\p{Emoji_Modifier})*/gu;
const counts = new Map();
lines.forEach((line, i) => {
  const found = line.match(re);
  if (!found) return;
  for (const e of found) counts.set(e, (counts.get(e) || 0) + 1);
  if (flag !== '--summary') console.log(String(i + 1).padStart(5), found.join(''), '|', line.trim().slice(0, 150));
});
if (flag === '--summary') console.log([...counts].sort((a, b) => b[1] - a[1]).map(([e, n]) => e + n).join(' '), '\n', 'distinct', counts.size, 'total', [...counts.values()].reduce((a, b) => a + b, 0));
