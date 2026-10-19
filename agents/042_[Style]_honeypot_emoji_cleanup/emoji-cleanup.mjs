// Remove emoji from the dessert game's interface text (game art stays) and move the
// remaining old-palette pieces onto the redesign's colors. Every edit must match exactly.
// Usage: node emoji-cleanup.mjs <index.html>
import fs from 'node:fs';

const file = process.argv[2];
let html = fs.readFileSync(file, 'utf8');

const edits = [
  // Top bar, options menu, HUD, shop, startup and encyclopedia markup.
  ['<div class="brand"><span>🍯</span><div>', '<div class="brand"><img class="brand-icon" src="./icon.svg" alt=""><div>', 1],
  ['>⚙ 选项<', '>选项<', 1],
  ['>🌙 夜间模式<', '>夜间模式<', 1],
  ['>💾 存档<', '>存档<', 1],
  ['>📂 读档<', '>读档<', 1],
  ['>⏹ 提前结束今天<', '>提前结束今天<', 1],
  ['>🔄 重新开始<', '>重新开始<', 1],
  ['>🔥 连击 <span', '>连击 <span', 1],
  ['☕ 咖啡机<br>未购买', '咖啡机<br>未购买', 3],
  ['<h2>🏪 升级商店</h2>', '<h2>升级商店</h2>', 1],
  ['<h3>✨ 推荐购买</h3>', '<h3>推荐购买</h3>', 1],
  ['>🥤 饮品<', '>饮品<', 2],
  ['>🍰 甜品<', '>甜品<', 2],
  ['<h2>🍯 蜜罐甜品屋</h2>', '<h2>蜜罐甜品屋</h2>', 1],
  ['<h2>📖 图鉴</h2>', '<h2>图鉴</h2>', 1],
  ['>🍰 食品图鉴<', '>食品图鉴<', 1],
  ['>🧑 客人图鉴<', '>客人图鉴<', 1],
  ['>🌟 事件图鉴<', '>事件图鉴<', 1],
  ['<p style="text-align:center; color:#8b003a; margin-bottom:10px;">当前金币：', '<p style="text-align:center; color:#765347; margin-bottom:10px;">当前金币：', 1],

  // Tutorial, toggles, toasts and dialog titles.
  ['{text:"🎉 第一单完成！', '{text:"第一单完成！', 1],
  ["'🤖 聪明的服务员'", "'聪明的服务员'", 1],
  ["'🪑 聪明的顾客'", "'聪明的顾客'", 1],
  ['"🌙 已切换到夜间模式" : "☀️ 已切换到日间模式"', '"已切换到夜间模式" : "已切换到日间模式"', 1],
  ['"☀️ 日间模式" : "🌙 夜间模式"', '"日间模式" : "夜间模式"', 1],
  ['"💾 选择存档位（保存）" : "📂 选择存档位（读取）"', '"选择存档位（保存）" : "选择存档位（读取）"', 1],
  ['showToast("💾 已保存到存档位 "', 'showToast("已保存到存档位 "', 1],
  ['showToast("📂 读档成功！第 "', 'showToast("读档成功！第 "', 1],
  ['showToast("🔄 已重新开始，新的甜品屋旅程！")', 'showToast("已重新开始，新的甜品屋旅程！")', 1],
  ['<div class="gt-title">✨ 出现新客人了！</div>', '<div class="gt-title">出现新客人了！</div>', 1],
  ['text: "📋 点了："', 'text: "点了："', 3],
  ['showToast("📋 已提交 "', 'showToast("已提交 "', 1],
  ['showToast("🍽️ 已拾起 "', 'showToast("已拾起 "', 1],
  ["showToast('☕ 已为'", "showToast('已为'", 1],
  ['showToast("🎯 每日挑战完成！奖励 "', 'showToast("每日挑战完成！奖励 "', 1],

  // Waiter tray: an order is marked with a "单" slip instead of the clipboard emoji.
  ['icon=item.isOrder?"📋":food.icon', 'icon=item.isOrder?"单":food.icon', 1],
  ['badge.className="carry-icon";', 'badge.className="carry-icon"+(item.isOrder?" order-slip":"");', 1],
  ['picture.className="carry-picture";', 'picture.className="carry-picture"+(item.isOrder?" order-slip":"");', 1],

  // Kitchen, coffee machine and HUD labels.
  ['"📝 记录中 "', '"记录中 "', 1],
  ['txt.innerHTML = "✅ " + food.icon', 'txt.innerHTML = food.icon', 1],
  [": ready ? '✅ ' + FOOD_DATA[st.order.food].icon", ': ready ? FOOD_DATA[st.order.food].icon', 1],
  ["'☕ 已选中 · 剩余 '", "'已选中 · 剩余 '", 1],
  ["'☕ 卡布奇诺 '", "'卡布奇诺 '", 1],
  ["'☕ 制作中…<br>本批 '", "'制作中…<br>本批 '", 1],
  ["'<h4>👨‍🍳 厨师'", "'<h4>厨师'", 1],
  ['"😭 小屁孩在店 · ', '"小屁孩在店 · ', 1],
  ['<span>⏳ 今日预告 · ', '<span>今日预告 · ', 1],
  ['<span>🍯 今日营业</span>', '<span>今日营业</span>', 1],
  ['chEl.textContent = "📋 " + c.desc', 'chEl.textContent = c.desc', 1],
  ['hint.innerHTML = "🧹 正在清理中…";', 'hint.innerHTML = "正在清理中…";', 1],

  // Table statuses: classes instead of inline colors, so day and night each get palette colors.
  ['\'<div style="font-size:10px;color:#666;">📖 看菜单中…</div>\'', '\'<div class="guest-status">看菜单中…</div>\'', 1],
  ['\'<div style="font-size:10px;color:#666;">🙋 等待点单</div>\'', '\'<div class="guest-status">等待点单</div>\'', 1],
  ['\'<div style="font-size:10px;color:#c0392b;font-weight:bold;">📝 记录订单中…</div>\'', '\'<div class="guest-status busy">记录订单中…</div>\'', 1],
  ['\'<div style="font-size:10px;color:#666;">⏳ 等待上菜</div>\'', '\'<div class="guest-status">等待上菜</div>\'', 1],
  ['\'<div style="font-size:10px;color:#e67e22;font-weight:bold;">🍽️ 正在用餐</div>\'', '\'<div class="guest-status eating">正在用餐</div>\'', 1],
  ['\'<div style="width:70px;height:5px;background:#eee;border-radius:3px;margin:2px auto 0;overflow:hidden;">\'', '\'<div class="eat-progress">\'', 1],
  ['\'<div style="height:100%;width:\' + pct + \'%;background:#ff9f43;transition:width 0.3s linear;"></div>\'', '\'<div style="width:\' + pct + \'%"></div>\'', 1],
  ['\'<div style="font-size:10px;color:#2e8b57;font-weight:bold;">💰 等待结账</div>\'', '\'<div class="guest-status pay">等待结账</div>\'', 1],
  ['\'<div style="font-size:9px;color:#c0392b;">😰 有点紧张</div>\'', '\'<div class="guest-mood">有点紧张</div>\'', 1],
  ['\'<div style="font-size:9px;color:#c0392b;">😠 警惕</div>\'', '\'<div class="guest-mood">警惕</div>\'', 1],
  ['\'<div style="font-size:9px;color:#27ae60;">😊 放松</div>\'', '\'<div class="guest-mood calm">放松</div>\'', 1],

  // Encyclopedia: locked entries get a "?" badge and spelled-out status instead of 🔒 / ❓.
  ['(unlocked ? f.icon : "🔒")', '(unlocked ? f.icon : \'<span class="bc-lock">?</span>\')', 1],
  ['(unlocked ? g.icon : "❓")', '(unlocked ? g.icon : \'<span class="bc-lock">?</span>\')', 1],
  ['(unlocked ? ev.icon : "❓")', '(unlocked ? ev.icon : \'<span class="bc-lock">?</span>\')', 1],
  ['\'<div class="bc-row">🔒 商店解锁价：\'', '\'<div class="bc-row">未解锁 · 商店解锁价：\'', 1],
  ['\'<div class="bc-row">🔒 还有 \'', '\'<div class="bc-row">未解锁 · 还有 \'', 1],
  ['\'<div class="bc-row">🔒 第 3 天起随机触发</div>\'', '\'<div class="bc-row">未解锁 · 第 3 天起随机触发</div>\'', 1],

  // Styles for the pieces above, plus the combo bar and modal subheadings.
  ['  body.night .hud-challenge.done { background:#3f6b55; border-color:#3f6b55; color:#fff; }\n</style>',
   `  body.night .hud-challenge.done { background:#3f6b55; border-color:#3f6b55; color:#fff; }

  /* 托管版：界面文字不用 emoji；品牌图标、未解锁占位、托盘订单与桌面状态改用样式，连击条与弹窗小标题换新版色板。 */
  .brand-icon { width:36px; height:36px; flex:none; }
  .bc-lock { display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:50%; background:#f2ebe6; color:#a08a7c; font-size:18px; font-weight:700; }
  .carry-icon.order-slip { font-size:14px; font-weight:700; color:#7a5a46; background:#f6f0e7; }
  .carry-picture.order-slip { display:inline-flex; align-items:center; justify-content:center; width:32px; height:32px; border:1px solid #dfd1be; border-radius:8px; background:#fffaf0; font-size:14px; font-weight:700; color:#7a5a46; }
  .guest-status { font-size:10px; color:#8c7b70; }
  .guest-status.busy { color:#a8574a; font-weight:bold; }
  .guest-status.eating { color:#b7782f; font-weight:bold; }
  .guest-status.pay { color:#507c66; font-weight:bold; }
  .guest-mood { font-size:9px; color:#a8574a; } .guest-mood.calm { color:#507c66; }
  .eat-progress { width:70px; height:5px; margin:2px auto 0; border-radius:3px; background:#eadfd3; overflow:hidden; }
  .eat-progress div { height:100%; background:#c78c33; transition:width .3s linear; }
  .hud-combo { background:#fff3d8; border:1px solid #dba44d; color:#87531b; }
  .modal-content h3 { color:#765347; }
  body.night .bc-lock { background:#233348; }
  body.night .carry-icon.order-slip, body.night .carry-picture.order-slip { background:#28384b; border-color:#657481; color:#fff; }
  body.night .guest-status { color:#c9d6e6; }
  body.night .guest-status.busy, body.night .guest-mood { color:#f0a59a; }
  body.night .guest-status.eating { color:#edbd72; }
  body.night .guest-status.pay, body.night .guest-mood.calm { color:#9fd0b0; }
  body.night .eat-progress { background:#39485d; } body.night .eat-progress div { background:#edbd72; }
  body.night .hud-combo { background:#263448; border-color:#c69b5e; color:#fff; }
</style>`, 1],
];

for (const [find, replacement, expected] of edits) {
  const count = html.split(find).length - 1;
  if (count !== expected) throw new Error(`expected ${expected} of ${JSON.stringify(find)}, found ${count}`);
  html = html.split(find).join(replacement);
}
fs.writeFileSync(file, html);
console.log(`applied ${edits.length} edits to ${file}`);
