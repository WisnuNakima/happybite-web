const { chromium } = require(process.env.TEMP + '/happybite-preview/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({ channel: 'msedge', headless: true });
 const page = await browser.newPage({ viewport: { width: 1312, height: 950 }, reducedMotion: 'reduce' });
 const errors = []; page.on('pageerror', error => errors.push(error.message));
 page.setDefaultTimeout(10000);
 const base = 'http://127.0.0.1:5185';
 for (const route of ['/', '/login', '/katalog', '/katalog/red-velvet', '/keranjang', '/checkout']) {
  await page.goto(base + route);
  await page.locator('main h1').waitFor();
  assert.equal(new URL(page.url()).pathname, route);
  assert.equal(await page.locator('vite-error-overlay').count(), 0);
  await page.reload(); await page.locator('main h1').waitFor();
  console.log('PASS direct load + refresh: ' + route);
 }
 await page.goto(base + '/pembayaran'); await page.waitForURL('**/checkout');
 await page.goto(base + '/riwayat-pesanan'); await page.waitForURL('**/login');
 await page.goto(base + '/profil'); await page.waitForURL('**/login');
 await page.locator('#login-email').fill('routes@example.com'); await page.locator('#login-password').fill('demo');
 await page.getByRole('button', { name: /Masuk ke Akun HappyBite/ }).click(); await page.waitForURL(base + '/');
 for (const route of ['/riwayat-pesanan', '/profil']) {
  await page.goto(base + route); await page.locator('main h1').waitFor();
  assert.equal(new URL(page.url()).pathname, route);
  await page.reload(); await page.locator('main h1').waitFor();
 }
 await page.goto(base + '/katalog/not-a-product'); await page.getByRole('heading', { name: 'Produk tidak ditemukan', exact: true }).waitFor();
 await page.goto(base + '/pesanan-berhasil'); await page.waitForURL('**/riwayat-pesanan');
 await page.goto(base + '/unknown-route'); await page.waitForURL(base + '/');
 // Seed a valid pending payment session to exercise direct authenticated payment and refresh.
 await page.evaluate(async () => {
  const { orderFingerprint } = await import('/src/data/shopSession.js');
  const cartItems = [{ id: JSON.stringify(['red-velvet', '']), productId: 'red-velvet', variant: '', quantity: 2, selected: true }];
  const checkout = { name: 'Route Check', whatsapp: '081234567890', email: 'routes@example.com', address: 'Jalan Test 1', city: 'Jakarta Selatan - Kitchen Senopati', postalCode: '12730', notes: '' };
  const gift = { enabled: false, message: '' };
  sessionStorage.setItem('happybite-shop-v1', JSON.stringify({ cartItems, checkout, gift, order: { id: 'HB-ROUTE-CHECK', status: 'pending', deadline: Date.now() + 900000, fingerprint: orderFingerprint(cartItems, checkout, gift) } }));
 });
 await page.goto(base + '/pembayaran'); await page.getByRole('heading', { name: 'Pembayaran Instan QRIS', exact: true }).waitFor();
 await page.reload(); await page.getByRole('heading', { name: 'Pembayaran Instan QRIS', exact: true }).waitFor();
 assert.equal(await page.getByLabel('Total tagihan', { exact: true }).innerText(), 'Rp 68.000');
 assert.deepEqual(errors, []);
 console.log('PASS payment direct/refresh, auth and payment guards, profile, legacy/unknown redirects, invalid product; no runtime errors.');
 await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
