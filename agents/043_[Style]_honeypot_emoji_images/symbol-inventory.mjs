// List every AP035 symbol in the game's markup and script with its line, so each can be mapped or rewritten.
// Usage: node symbol-inventory.mjs <index.html> [--distinct]
import fs from 'node:fs';

const [file, flag] = process.argv.slice(2);
const SYMBOL = /\p{Regional_Indicator}{2}|[0-9#*]\u{FE0F}?\u{20E3}|(?:\p{Extended_Pictographic}|[\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{25A0}-\u{27BF}\u{27F0}-\u{27FF}\u{2900}-\u{297F}\u{2B00}-\u{2BFF}\u{1F800}-\u{1F8FF}])[\u{FE0E}\u{FE0F}\p{Emoji_Modifier}]?(?:\u{200D}\p{Extended_Pictographic}[\u{FE0F}\p{Emoji_Modifier}]?)*/gu;
const STANDARD = new Set(['\u{A9}', '\u{AE}', '\u{2122}']);
const lines = fs.readFileSync(file, 'utf8').split('\n');
const start = lines.findIndex(line => line.includes('</style>'));
const distinct = new Map();
lines.forEach((line, i) => {
  if (i <= start) return;
  const found = (line.match(SYMBOL) ?? []).filter(s => !STANDARD.has(s));
  if (!found.length) return;
  for (const s of found) distinct.set(s, (distinct.get(s) ?? 0) + 1);
  if (flag !== '--distinct') console.log(String(i + 1).padStart(5), found.join(' '), '|', line.trim().slice(0, 140));
});
if (flag === '--distinct') {
  for (const [s, n] of distinct) console.log([...s].map(c => c.codePointAt(0).toString(16)).join('-'), s, n);
  console.log('distinct', distinct.size, 'total', [...distinct.values()].reduce((a, b) => a + b, 0));
}
