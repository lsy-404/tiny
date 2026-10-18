import assert from 'node:assert/strict';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.PROJECTS_BASE_URL || 'http://127.0.0.1:4190/';
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true
});

try {
  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(base, { waitUntil: 'networkidle' });
    const blog = page.getByRole('navigation', { name: '站点导航' }).getByRole('link', { name: 'Blog' });
    assert.equal(await blog.getAttribute('href'), 'https://leisiyu.dev/');
    const cards = page.locator('.project-card');
    await cards.first().waitFor({ state: 'visible' });
    assert.equal(await cards.count(), 5, `Expected five project cards at ${width}px.`);
    assert.deepEqual(await cards.locator('h3').allTextContents(), ['蜜罐甜品屋', '织音机', 'CASSIE PLUS', '卡桑德里传说', '十光年的距离'], `Projects must be listed newest first at ${width}px.`);
    assert.deepEqual((await cards.locator('.card-kicker').allTextContents()).map((text) => text.slice(0, 2)), ['05', '04', '03', '02', '01'], `Card numbers must follow release order at ${width}px.`);
    const cassieCard = page.locator('.project-card').filter({ has: page.getByRole('heading', { name: /CASSIE/i }) });
    const cassieLink = cassieCard.getByRole('link');
    assert.equal(new URL(await cassieLink.getAttribute('href'), base).pathname, '/projects/cassie/');
    await cassieLink.click();
    await page.waitForURL('**/projects/cassie/');
    await returnToHome(page, width);

    const scoreCard = page.locator('.project-card').filter({ has: page.getByRole('heading', { name: /织音机|sound loom/i }) });
    await scoreCard.getByRole('link').click();
    await page.waitForURL('**/projects/vocal-score/');
    await returnToHome(page, width);
    const dessertCard = page.locator('.project-card').filter({ has: page.getByRole('heading', { name: '蜜罐甜品屋' }) });
    await dessertCard.getByRole('link').click();
    await page.waitForURL('**/games/honeypot-dessert/');
    await returnToHome(page, width);
    await page.close();
  }
  console.log('Verified newest-first cards and CASSIE, vocal score and dessert house return links at desktop and mobile widths.');
} finally {
  await browser.close();
}

async function returnToHome(page, width) {
  const link = page.getByRole('link', { name: /Tiny Projects/ });
  await link.waitFor({ state: 'visible' });
  assert.equal(new URL(await link.getAttribute('href'), page.url()).pathname, '/');
  await link.focus();
  await page.keyboard.press('Enter');
  await page.waitForURL((url) => url.pathname === '/');
  assert.equal(new URL(page.url()).pathname, '/', `Return link failed at ${width}px.`);
}
