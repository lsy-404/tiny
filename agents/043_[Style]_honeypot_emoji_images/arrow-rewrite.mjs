// Rewrite the dessert game's → arrows as plain wording. Every edit must match exactly once.
// Usage: node arrow-rewrite.mjs <index.html>
import fs from 'node:fs';

const file = process.argv[2];
let html = fs.readFileSync(file, 'utf8');
const edits = [
  ['desc:"延长每日营业模拟时长（90→135→180秒）"', 'desc:"延长每日营业模拟时长（90 秒，逐级增至 135、180 秒）"'],
  ['name:"升级1张双人桌→四人桌"', 'name:"将1张双人桌升级为四人桌"'],
  ['name:"升级1张四人桌→六人桌"', 'name:"将1张四人桌升级为六人桌"'],
  ['desc:"客人看菜单更快（10-20秒 → 6-12秒 → 3-6秒）"', 'desc:"客人看菜单更快（10–20 秒，逐级缩短至 6–12、3–6 秒）"'],
  ['desc:"服务员记录订单更快（3秒 → 2秒 → 0秒）"', 'desc:"服务员记录订单更快（3 秒，逐级缩短至 2、0 秒）"'],
  ['desc:"服务员一次可携带更多物品（2→3→4→5，订单和餐品都占位）"', 'desc:"服务员一次可携带更多物品（2 件，逐级增至 3、4、5 件，订单和餐品都占位）"'],
  ['再走一遍同样的流程（选客→落座→点单→制作→上菜→结账）', '再走一遍同样的流程：选客、落座、点单、制作、上菜、结账'],
];
for (const [find, replacement] of edits) {
  const count = html.split(find).length - 1;
  if (count !== 1) throw new Error(`expected 1 of ${find}, found ${count}`);
  html = html.replace(find, replacement);
}
if (html.includes('→')) throw new Error('an arrow is left');
fs.writeFileSync(file, html);
console.log(`rewrote ${edits.length} arrow passages`);
