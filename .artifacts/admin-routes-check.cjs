const { chromium } = require(process.env.TEMP + '/happybite-preview/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  page.setDefaultTimeout(15000);
  const base = 'http://127.0.0.1:5185';
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const routes = [['/admin', 'Ringkasan Bisnis'], ['/admin/produk', 'Manajemen Produk'], ['/admin/pesanan', 'Kelola Pesanan'], ['/admin/laporan', 'Laporan Penjualan']];
  const auth = () => page.evaluate(() => JSON.parse(localStorage.getItem('happybite-auth-v1')));
  async function loginScreen() {
    await page.waitForURL('**/admin/login');
    await page.getByRole('heading', { name: 'Login Admin', exact: true }).waitFor();
    assert.equal(await page.getByRole('navigation', { name: 'Navigasi admin', exact: true }).count(), 0);
    assert.equal(await page.getByRole('navigation', { name: 'Navigasi utama', exact: true }).count(), 0);
    assert.equal(await page.locator('footer').count(), 0);
  }
  for (const [route] of routes) {
    await page.goto(base + route);
    await loginScreen();
  }
  await page.locator('#admin-email').fill('admin@happybite.com');
  await page.locator('#admin-password').fill('wrong-password');
  await page.getByRole('button', { name: 'Masuk Admin', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'Email atau kata sandi admin salah.' }).waitFor();
  assert.equal(await auth(), null);
  await page.locator('#admin-password').fill('admin123');
  await page.getByRole('button', { name: 'Masuk Admin', exact: true }).click();
  await page.waitForURL(base + '/admin');
  assert.deepEqual(await auth(), { isLoggedIn: true, user: { name: 'Dhea Ardiansyah', jobTitle: 'Head Baker & Owner', email: 'admin@happybite.com', role: 'admin' } });
  await page.evaluate(() => { window.sidebarBefore = document.querySelector('aside'); });
  for (const [route, heading] of routes) {
    const nav = page.getByRole('navigation', { name: 'Navigasi admin', exact: true });
    await nav.getByRole('link', { name: heading, exact: true }).click();
    await page.waitForURL(base + route);
    await page.getByRole('heading', { name: route === '/admin/pesanan' ? 'Kelola Pesanan & Distribusi Pengiriman' : route === '/admin/laporan' ? 'Laporan Penjualan & Analisis Finansial' : heading, exact: true }).waitFor();
    if (!['/admin/produk', '/admin/pesanan', '/admin/laporan'].includes(route)) assert.equal(await page.locator('main').innerText(), heading);
    assert.equal(await nav.getByRole('link', { name: heading, exact: true }).getAttribute('aria-current'), 'page');
    assert.equal(await nav.locator('[aria-current="page"]').count(), 1);
    assert.ok(await page.evaluate(() => window.sidebarBefore === document.querySelector('aside')));
    assert.equal(await page.locator('footer').count(), ['/admin/produk', '/admin/pesanan', '/admin/laporan'].includes(route) ? 1 : 0);
    assert.equal(await page.getByRole('navigation', { name: 'Navigasi utama', exact: true }).count(), 0);
  }
  const previousUrl = page.url();
  await page.getByRole('link', { name: 'Pengaturan Dapur', exact: true }).evaluate(el => el.click());
  assert.equal(page.url(), previousUrl);
  for (const [route, heading] of routes) {
    await page.goto(base + route);
    await page.getByRole('heading', { name: route === '/admin/pesanan' ? 'Kelola Pesanan & Distribusi Pengiriman' : route === '/admin/laporan' ? 'Laporan Penjualan & Analisis Finansial' : heading, exact: true }).waitFor();
    await page.reload();
    await page.getByRole('heading', { name: route === '/admin/pesanan' ? 'Kelola Pesanan & Distribusi Pengiriman' : route === '/admin/laporan' ? 'Laporan Penjualan & Analisis Finansial' : heading, exact: true }).waitFor();
    assert.equal((await auth()).user.role, 'admin');
  }
  for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({ width, height: 812 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  await page.getByRole('button', { name: 'Keluar', exact: true }).click();
  await loginScreen(); assert.equal(await auth(), null);
  await page.goto(base + '/admin/pesanan'); await loginScreen();
  console.log('PASS guest guards, invalid/valid mock admin login, all four shared-layout routes, active NavLinks, direct load/refresh, placeholder settings, logout, mobile widths');
  await page.evaluate(() => localStorage.setItem('happybite-auth-v1', JSON.stringify({ isLoggedIn: true, user: { name: 'Legacy Customer', email: 'legacy@example.com' } })));
  await page.goto(base + '/admin'); await loginScreen();
  await page.goto(base + '/profil');
  await page.getByRole('heading', { name: 'Profil Akun', exact: true }).waitFor();
  // Using the admin email/password through the CUSTOMER form must still create a customer.
  await page.goto(base + '/login');
  await page.locator('#login-email').fill('admin@happybite.com');
  await page.locator('#login-password').fill('admin123');
  await page.getByRole('button', { name: /Masuk ke Akun HappyBite/ }).click();
  await page.waitForURL(base + '/');
  assert.equal((await auth()).user.role, 'customer');
  await page.goto(base + '/admin/produk'); await loginScreen();
  await page.goto(base + '/login');
  await page.getByRole('tab', { name: 'Daftar Akun Baru', exact: true }).click();
  await page.locator('#register-fullName').fill('Customer Registration');
  await page.locator('#register-email').fill('admin@happybite.com');
  await page.locator('#register-password').fill('admin123');
  await page.locator('#panel-register button[type="submit"]').click();
  await page.waitForURL(base + '/');
  assert.equal((await auth()).user.role, 'customer');
  await page.goto(base + '/admin/laporan'); await loginScreen();
  assert.deepEqual(errors, []);
  console.log('PASS legacy accounts default to customer; customer Login/Register cannot grant admin; no runtime errors.');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
