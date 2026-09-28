const { chromium } = require(process.env.TEMP + '/happybite-preview/node_modules/playwright');
const assert = require('node:assert/strict');
const base = 'http://127.0.0.1:5185';
const key = 'happybite-orders-v1';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1312, height: 950 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const orders = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)).filter(o => o.source === 'checkout'), key);
  const shop = () => page.evaluate(() => JSON.parse(sessionStorage.getItem('happybite-shop-v1')));
  async function login(email) {
    await page.locator('#login-email').fill(email);
    await page.locator('#login-password').fill('demo-password');
    await page.getByRole('button', { name: /Masuk ke Akun HappyBite/ }).click();
  }
  async function logout() {
    await page.getByRole('button', { name: 'Menu akun Amanda Putri', exact: true }).click();
    await page.getByRole('button', { name: 'Keluar', exact: true }).click();
  }
  async function proof() {
    await page.locator('input[type="file"]').setInputFiles({ name: 'bukti-demo.png', mimeType: 'image/png', buffer: Buffer.from('local-test-proof') });
  }
  await page.goto(base + '/katalog');
  await page.locator('article').filter({ has: page.getByRole('heading', { name: 'Red Velvet Cream Cheese Lava', exact: true }) }).getByRole('button', { name: /keranjang/i }).click();
  await page.locator('article').filter({ has: page.getByRole('heading', { name: 'The OG Classic Chocochip NYC', exact: true }) }).getByRole('button', { name: /keranjang/i }).click();
  await page.getByRole('link', { name: /Keranjang/ }).first().click();
  await page.getByRole('button', { name: 'Tambah Red Velvet Cream Cheese Lava', exact: true }).click();
  await page.getByRole('checkbox', { name: /Tulis Kartu Ucapan/ }).check();
  await page.locator('#gift-message').fill('Selamat ulang tahun Rani!');
  await page.getByRole('button', { name: /Lanjut ke Pembayaran/ }).click();
  const recipient = { name: 'Rani Penerima', whatsapp: '081234567890', email: 'rani@example.com', address: 'Jl. Mawar No. 21 RT 02', city: 'Jakarta Selatan - Kitchen Senopati', postalCode: '12730', notes: 'Gerbang hijau, telepon dulu.' };
  for (const [field, value] of Object.entries(recipient)) {
    const input = page.locator('#checkout-' + field);
    if (field === 'city') await input.selectOption(value); else await input.fill(value);
  }
  await page.getByRole('button', { name: 'Lanjut ke Pembayaran', exact: true }).click();
  await page.waitForURL('**/login');
  await login('orders@example.com');
  await page.waitForURL('**/pembayaran');
  assert.equal(await page.locator('#payment-sender').inputValue(), recipient.name);
  assert.equal(await page.getByLabel('Total tagihan', { exact: true }).innerText(), 'Rp 96.000');
  const pending = await shop();
  await proof();
  await page.locator('#payment-sender').fill('Rani Rekening');
  // Failed storage must not lose the cart or navigate away.
  await page.evaluate(() => {
    window.originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) { if (key === 'happybite-orders-v1') throw new DOMException('quota', 'QuotaExceededError'); return window.originalSetItem.call(this, key, value); };
  });
  await page.getByRole('button', { name: 'Konfirmasi Pembayaran Sekarang', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'Pesanan belum tersimpan' }).waitFor();
  assert.equal((await shop()).cartItems.length, 2);
  await page.evaluate(() => { Storage.prototype.setItem = window.originalSetItem; });
  await page.getByRole('button', { name: 'Konfirmasi Pembayaran Sekarang', exact: true }).evaluate(button => { button.click(); button.click(); });
  await page.waitForURL('**/riwayat-pesanan');
  let saved = await orders();
  assert.equal(saved.length, 1);
  const placed = saved[0];
  assert.equal(placed.id, pending.order.id);
  assert.equal(placed.total, 96000);
  assert.equal(placed.items.length, 2);
  assert.deepEqual(placed.items.map(i => [i.name, i.quantity, i.price]), [['Red Velvet Cream Cheese Lava', 2, 34000], ['The OG Classic Chocochip NYC', 1, 28000]]);
  assert.deepEqual(placed.recipient, recipient);
  assert.equal(placed.greeting, 'Selamat ulang tahun Rani!');
  assert.equal(placed.paymentMethod, 'QRIS');
  assert.equal(placed.status, 'processing');
  assert.equal(placed.sender, 'Rani Rekening');
  assert.equal(placed.ownerEmail, 'orders@example.com');
  const alerts = await page.evaluate(() => JSON.parse(localStorage.getItem('happybite-notifications-v1')));
  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].linkedOrderId, placed.id);
  assert.equal(alerts[0].read, false);
  await page.getByRole('button', { name: 'Notifikasi, 1 belum dibaca', exact: true }).waitFor();
  assert.equal((await shop()).cartItems.length, 0);
  assert.deepEqual((await shop()).gift, { enabled: false, message: '' });
  assert.ok(await page.getByRole('button', { name: 'Semua Pesanan (3)', exact: true }).isVisible());
  assert.ok(await page.getByRole('button', { name: 'Diproses Dapur (1)', exact: true }).isVisible());
  assert.equal(await page.locator('main article').first().getByRole('heading', { level: 2 }).innerText(), '#' + placed.id);
  assert.equal(await page.locator('main article').first().getByRole('region', { name: 'Pelacakan pengiriman', exact: true }).count(), 0);
  assert.equal(await page.getByText('Demo · Data contoh', { exact: true }).count(), 2);
  await page.getByRole('button', { name: 'Diproses Dapur (1)', exact: true }).click();
  assert.equal(await page.locator('main article').count(), 1);
  await page.getByRole('button', { name: 'Detail Pesanan', exact: true }).click();
  for (const value of [recipient.name, recipient.whatsapp, recipient.email, placed.address, recipient.notes]) assert.ok(await page.getByRole('dialog').getByText(value, { exact: true }).isVisible());
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Ubah Catatan Alamat', exact: true }).click();
  await page.getByLabel('Catatan untuk kurir', { exact: true }).fill('Catatan diperbarui dan disimpan.');
  await page.getByRole('button', { name: 'Simpan Catatan', exact: true }).click();
  await page.reload();
  assert.equal((await orders())[0].courierNote, 'Catatan diperbarui dan disimpan.');
  await page.getByRole('searchbox', { name: 'Cari invoice / jenis cookie', exact: true }).fill(placed.id);
  assert.equal(await page.locator('main article').count(), 1);
  await page.getByLabel('Rentang tanggal pesanan', { exact: true }).selectOption('7');
  assert.equal(await page.locator('main article').count(), 1);
  for (const width of [320, 375, 768, 1312]) {
    await page.setViewportSize({ width, height: 950 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'overflow at ' + width);
  }
  await page.setViewportSize({ width: 1312, height: 950 });
  await page.screenshot({ path: 'D:/happybite-web/.artifacts/orders-connected.png', fullPage: true });
  console.log('PASS full cart > checkout > guest login > payment > persisted order; snapshot, totals, gift, empty cart, repeated click, storage failure, filters, note edit, responsive');
  // Restore an already confirmed payment session: must not create a duplicate.
  await page.evaluate(pending => sessionStorage.setItem('happybite-shop-v1', JSON.stringify(pending)), pending);
  await page.goto(base + '/pembayaran');
  await proof();
  await page.getByRole('button', { name: 'Konfirmasi Pembayaran Sekarang', exact: true }).click();
  await page.waitForURL('**/riwayat-pesanan');
  assert.equal((await orders()).length, 1);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('happybite-notifications-v1')).length), 1);
  // A fresh browser tab/session still sees localStorage history, without cart sessionStorage.
  const fresh = await browser.newContext({ storageState: await context.storageState() });
  const freshPage = await fresh.newPage();
  await freshPage.goto(base + '/riwayat-pesanan');
  await freshPage.getByRole('heading', { name: '#' + placed.id, exact: true }).waitFor();
  assert.equal(await freshPage.evaluate(() => JSON.parse(sessionStorage.getItem('happybite-shop-v1')).cartItems.length), 0);
  await fresh.close();
  // Different accounts must not see the first account's orders.
  await logout();
  await page.goto(base + '/riwayat-pesanan');
  await page.waitForURL('**/login');
  await login('other@example.com');
  await page.goto(base + '/riwayat-pesanan');
  assert.ok(await page.getByRole('button', { name: 'Semua Pesanan (2)', exact: true }).isVisible());
  assert.equal(await page.getByRole('heading', { name: '#' + placed.id, exact: true }).count(), 0);
  await logout();
  await page.goto(base + '/login');
  await login('ORDERS@example.com');
  await page.goto(base + '/riwayat-pesanan');
  await page.getByRole('heading', { name: '#' + placed.id, exact: true }).waitFor();
  console.log('PASS refresh/new session, account isolation, email normalization, idempotent restored session');
  // Partial checkout keeps unchecked lines; snapshots preserve separate variants.
  const line = (variant, quantity, selected) => ({ id: JSON.stringify(['classic-nyc', variant]), productId: 'classic-nyc', variant, quantity, selected });
  const partial = { ...pending, order: null, gift: { enabled: false, message: 'Must not carry over' }, cartItems: [line('Box A', 2, true), line('Box B', 1, true), line('Keep for later', 4, false)] };
  await page.evaluate(partial => sessionStorage.setItem('happybite-shop-v1', JSON.stringify(partial)), partial);
  await page.goto(base + '/keranjang');
  await page.getByRole('button', { name: /Lanjut ke Pembayaran/ }).click();
  await page.getByRole('button', { name: 'Lanjut ke Pembayaran', exact: true }).click();
  await page.waitForURL('**/pembayaran');
  await proof();
  await page.getByRole('button', { name: 'Konfirmasi Pembayaran Sekarang', exact: true }).click();
  await page.waitForURL('**/riwayat-pesanan');
  saved = await orders();
  assert.equal(saved.length, 2);
  assert.equal(saved[0].total, 84000);
  assert.deepEqual(saved[0].items.map(item => item.variant), ['Box A', 'Box B']);
  assert.equal(saved[0].greeting, '');
  assert.equal((await shop()).cartItems.length, 1);
  assert.equal((await shop()).cartItems[0].variant, 'Keep for later');
  assert.equal((await shop()).cartItems[0].quantity, 4);
  assert.equal(saved[1].total, placed.total);
  await page.getByRole('button', { name: 'Semua Pesanan (4)', exact: true }).waitFor();
  assert.ok(await page.getByRole('button', { name: 'Diproses Dapur (2)', exact: true }).isVisible());
  assert.equal(await page.locator('main article').first().getByRole('heading', { level: 2 }).innerText(), '#' + saved[0].id);
  assert.deepEqual(errors, []);
  console.log('PASS partial checkout, separate variants, no greeting carryover, newest-first order, dynamic counts; no runtime errors');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
