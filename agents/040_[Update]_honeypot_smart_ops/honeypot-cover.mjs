// Stage a busy day in the dessert game (state only, game code untouched) and capture screenshots.
// Usage: node honeypot-cover.mjs <gameDir> <full.png> [cover.png x,y,w,h]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [gameDir, fullPath, coverPath, clip] = process.argv.slice(2);
const { chromium } = await import(pathToFileURL('F:/Development/lsy-404@tiny/apps/cassie/node_modules/.pnpm/playwright@1.63.0/node_modules/playwright/index.mjs').href);
const server = createServer(async (req, res) => {
  try {
    let file = path.join(gameDir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': file.endsWith('.html') ? 'text/html; charset=utf-8' : file.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end(); }
}).listen(4292, '127.0.0.1');

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://127.0.0.1:4292/');
  await page.click('#skipTutorialBtn');
  await page.click('#btnStart');
  await page.evaluate(() => {
    clearInterval(game.gameLoopId);
    game.day = 6; game.money = 1860; game.timeLeft = 52;
    game.decorLevel = { plant: 10, floor: 2, wall: 2 };
    applyDecor();
    game.unlockedFoods = Object.keys(FOOD_DATA).slice(0, 4).concat(Object.keys(FOOD_DATA).slice(11, 15));
    game.tables = [2, 4, 4, 6, 2, 6].map((capacity, id) => ({ id, capacity, guests: [], dirty: false, sharedOnce: false }));
    game.tables[4].dirty = true;
    const mk = (type, count, hearts, extra) => Object.assign({ id: Math.random(), type, count, hearts, status: 'waiting', tableId: null, food: null, order: null, heartTimer: 0, tableHeartTimer: 0, readTimer: 0, eatTimer: 0, eatTotal: 0 }, extra);
    const seat = (tableId, g) => { g.tableId = tableId; game.tables[tableId].guests.push(g); game.seatedGuests.push(g); };
    game.seatedGuests = [];
    seat(0, mk('sweet_tooth', 2, 5, { status: 'eating', food: '云朵香草纸杯蛋糕', order: { food: '云朵香草纸杯蛋糕', count: 2 }, eatTimer: 4, eatTotal: 7 }));
    seat(1, mk('social', 3, 4, { status: 'waiting_order' }));
    seat(2, mk('foodie', 2, 3, { status: 'ordered', food: '天鹅湖慕斯蛋糕', order: { food: '天鹅湖慕斯蛋糕', count: 2 } }));
    seat(2, mk('normal', 1, 5, { status: 'reading', readTimer: 6 }));
    seat(3, mk('influencer', 4, 5, { status: 'waiting_checkout', food: '樱吹雪抹茶拿铁', order: { food: '樱吹雪抹茶拿铁', count: 4 } }));
    seat(5, mk('kid', 2, 4, { status: 'ordered', food: '星芒百香果冰茶', order: { food: '星芒百香果冰茶', count: 2 } }));
    game.waitingGuests = [mk('sweet_tooth', 2, 5), mk('normal', 1, 4), mk('homebody', 1, 5)];
    game.cookingStations = [{ order: { food: '天鹅湖慕斯蛋糕', count: 2 }, progress: 0.62 }, { order: { food: '星芒百香果冰茶', count: 2 }, progress: 1 }];
    game.chefCount = 2;
    game.carryItems = [];
    game.combo = 3; game.dailyChallenge = DAILY_CHALLENGES[1]; game.challengePerfect = 1;
    renderAll(); renderHUD();
    const first = getTablePosition(0);
    game.waiterX = getVerticalWalkways()[2]; game.waiterY = first.y + TABLE_H / 2;
    updateWaiterPosition();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: fullPath });
  if (coverPath) {
    const [x, y, w, h] = clip.split(',').map(Number);
    await page.screenshot({ path: coverPath, clip: { x, y, width: w, height: h } });
  }
  console.log('errors:', errors.length ? errors : 'none');
} finally {
  await browser.close();
  server.close();
}
