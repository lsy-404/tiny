// Apply the Tiny Projects hosting changes to a new upstream build of 蜜罐甜品屋.
// Usage: node port-honeypot.mjs <upstream.html> <out index.html>
import fs from 'node:fs';

const [src, out] = process.argv.slice(2);
let html = fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n');

function replaceOnce(label, find, replacement) {
  const count = typeof find === 'string' ? html.split(find).length - 1 : (html.match(new RegExp(find.source, find.flags.replace('g', '') + 'g')) || []).length;
  if (count !== 1) throw new Error(`${label}: expected 1 match, found ${count}`);
  html = html.replace(find, replacement);
}

// Title and icon.
replaceOnce('title', /<title>[^<]*<\/title>/,
  '<title>蜜罐甜品屋 | Tiny Projects</title>\n<link rel="icon" href="./icon.svg" type="image/svg+xml">');

// Test cheat tool: styles, night styles, menu entry, modal, bindings and code.
replaceOnce('cheat css', /\n  \.cheat-btn \{[^\n]*\n  \.cheat-action \{[^\n]*/, '');
replaceOnce('cheat night css', /\n  \/\* 夜间模式：作弊器输入框与文字 \*\/\n(  body\.night #cheat[^\n]*\n){3}/, '\n');
replaceOnce('cheat menu item', /\n *<button class="opt-item" id="cheatBtn">[^\n]*/, '');
replaceOnce('cheat modal', /<div class="modal" id="cheatModal">[\s\S]*?\n<\/div>\n\n/, '');
replaceOnce('cheat bindings',
  /  document\.getElementById\("cheatBtn"\)\.onclick = openCheat;\n  initCheatBindings\(\);\n  document\.addEventListener\("keydown", function\(e\) \{\n    if\(e\.key === "F1"\) openCheat\(\);\n  \}\);\n/,
  `  document.getElementById("btnExit").onclick = function(e) {
    if(game.status === "idle" && game.day === 1) return;
    e.preventDefault();
    const href = this.href;
    showConfirm("返回 Tiny Projects 主菜单？<br>未存档的进度会丢失。", function() { location.href = href; }, "退出游戏");
  };
`);
replaceOnce('cheat code', /\/\/ =+ 测试修改器 =+\n[\s\S]*?\n(?=window\.onload = init;)/,
  `// The hosting site passes its main menu as <meta name="home-url">; without it there is nothing to return to.
(function() {
  const homeUrl = document.querySelector('meta[name="home-url"]')?.content;
  if(homeUrl) {
    document.getElementById("btnExit").href = homeUrl;
  } else {
    document.documentElement.classList.add("standalone");
    document.title = document.title.replace(/ \\| Tiny Projects$/, "");
  }
})();

`);

// Exit button: last item in the top bar, styled like the other secondary buttons.
replaceOnce('exit button', /(\n  <div class="options-wrap">[\s\S]*?\n  <\/div>\n)(<\/div>)/,
  '$1  <a class="top-btn btn-exit" id="btnExit" href="../../" aria-label="退出游戏并返回 Tiny Projects">退出游戏</a>\n$2');
replaceOnce('exit css', /\n<\/style>/,
  `
  .btn-exit { display:inline-flex; align-items:center; background:#f0e7e1; color:#705347; text-decoration:none; }
  body.night .btn-exit { background:#233348; color:#fff; }
  html.standalone .btn-exit { display:none; }
</style>`);

for (const leftover of ['cheat', 'Cheat', '修改器', '秘钥', 'F1']) {
  if (html.includes(leftover)) throw new Error(`leftover "${leftover}"`);
}
fs.writeFileSync(out, html);
console.log(`wrote ${out}: ${html.split('\n').length} lines`);
