const { chromium } = require(process.env.TEMP + '/happybite-preview/node_modules/playwright')
const assert = require('node:assert/strict')
const base = 'http://127.0.0.1:5185'
const productKey = 'happybite-products-v1'
const orderKey = 'happybite-orders-v1'
const shopKey = 'happybite-shop-v1'

;(async () => {
  const { reserveOrderInventory } = await import('../src/data/orderInventory.js')
  const product = { id: 'cookie', name: 'Cookie', stokDisplayEtalase: 22, isLiveOnWebsite: true }
  const order = { id: 'test', ownerEmail: 'test@example.com', items: [
    { productId: 'cookie', quantity: 2 }, { productId: 'cookie', quantity: 1 },
  ] }
  const updated = reserveOrderInventory([product], order)
  assert.equal(updated[0].stokDisplayEtalase, 19)
  assert.equal(reserveOrderInventory(updated, order)[0].stokDisplayEtalase, 19)
  assert.throws(() => reserveOrderInventory([{ ...product, stokDisplayEtalase: 2 }], order), /tidak mencukupi/)
  assert.equal(reserveOrderInventory([{ ...product, stokDisplayEtalase: 3 }], order)[0].stockNote, 'Habis etalase')

  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  try {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const stock = () => page.evaluate(key => {
      const products = JSON.parse(localStorage.getItem(key))
      return products?.find(product => product.id === 'classic-nyc')?.stokDisplayEtalase ?? 22
    }, productKey)
    const orders = () => page.evaluate(key => (JSON.parse(localStorage.getItem(key)) || []).filter(o => o.source === 'checkout'), orderKey)
    const shop = () => page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), shopKey)
    const confirm = () => page.getByRole('button', { name: 'Konfirmasi Pembayaran Sekarang', exact: true })
    const proof = () => page.locator('input[type="file"]').setInputFiles({ name: 'proof.png', mimeType: 'image/png', buffer: Buffer.from('test') })
    await page.goto(base + '/login')
    await page.locator('#login-email').fill('stock@example.com')
    await page.locator('#login-password').fill('password123')
    await page.getByRole('button', { name: /Masuk ke Akun HappyBite/ }).click()
    await page.goto(base + '/katalog')
    const card = page.locator('article').filter({ has: page.getByRole('heading', { name: 'The OG Classic Chocochip NYC', exact: true }) })
    await card.getByText('Sisa 22 pcs', { exact: true }).waitFor()
    for (let i = 0; i < 3; i++) await card.getByRole('button', { name: /keranjang/i }).click()
    await page.getByRole('link', { name: /Keranjang/ }).first().click()
    await page.getByRole('button', { name: /Lanjut ke Pembayaran/ }).click()
    const recipient = { name: 'Pembeli Cookie', whatsapp: '081234567890', email: 'stock@example.com', address: 'Jl. Mawar No 21', city: 'Jakarta Selatan - Kitchen Senopati', postalCode: '12730', notes: 'Tes stok' }
    for (const [field, value] of Object.entries(recipient)) {
      const input = page.locator('#checkout-' + field)
      if (field === 'city') await input.selectOption(value)
      else await input.fill(value)
    }
    await page.getByRole('button', { name: 'Lanjut ke Pembayaran', exact: true }).click()
    await page.waitForURL('**/pembayaran')
    const pending = await shop()
    assert.equal(await stock(), 22, 'Opening checkout does not deduct stock')
    await proof()
    // Neither a stock write failure nor an order write failure may lose cart items.
    for (const key of [productKey, orderKey]) {
      await page.evaluate(key => {
        window.originalSetItem = Storage.prototype.setItem
        Storage.prototype.setItem = function (name, value) {
          if (name === key) throw new DOMException('quota', 'QuotaExceededError')
          return window.originalSetItem.call(this, name, value)
        }
      }, key)
      await confirm().click()
      await page.getByRole('alert').filter({ hasText: /belum tersimpan/ }).waitFor()
      assert.equal(await stock(), 22)
      assert.equal((await orders()).length, 0)
      assert.equal((await shop()).cartItems[0].quantity, 3)
      await page.evaluate(() => { Storage.prototype.setItem = window.originalSetItem })
    }
    await confirm().evaluate(button => { button.click(); button.click() })
    await page.waitForURL('**/riwayat-pesanan')
    assert.equal(await stock(), 19)
    assert.equal((await orders()).length, 1)
    assert.equal((await orders())[0].total, 84000)
    assert.equal((await shop()).cartItems.length, 0)
    await page.reload()
    assert.equal(await stock(), 19)
    // Restoring an already completed payment must not deduct twice.
    await page.evaluate(({ pending, shopKey }) => sessionStorage.setItem(shopKey, JSON.stringify(pending)), { pending, shopKey })
    await page.goto(base + '/pembayaran')
    await proof()
    await confirm().click()
    await page.waitForURL('**/riwayat-pesanan')
    assert.equal(await stock(), 19)
    assert.equal((await orders()).length, 1)
    // Insufficient stock rejects confirmation and preserves the cart.
    const tooMany = { ...pending, order: null, cartItems: pending.cartItems.map(item => ({ ...item, quantity: 20 })) }
    await page.evaluate(({ tooMany, shopKey }) => sessionStorage.setItem(shopKey, JSON.stringify(tooMany)), { tooMany, shopKey })
    await page.goto(base + '/checkout')
    await page.getByRole('button', { name: 'Lanjut ke Pembayaran', exact: true }).click()
    await page.waitForURL('**/pembayaran')
    await proof()
    await confirm().click()
    await page.getByRole('alert').filter({ hasText: /Stok.*tidak mencukupi/ }).waitFor()
    assert.equal(await stock(), 19)
    assert.equal((await orders()).length, 1)
    assert.equal((await shop()).cartItems[0].quantity, 20)
    // Both customer catalog and admin table read the same persisted stock.
    await page.goto(base + '/katalog')
    await card.getByText('Sisa 19 pcs', { exact: true }).waitFor()
    await page.goto(base + '/admin/login')
    await page.locator('#admin-email').fill('admin@happybite.com')
    await page.locator('#admin-password').fill('admin123')
    await page.getByRole('button', { name: 'Masuk Admin', exact: true }).click()
    await page.getByRole('link', { name: 'Manajemen Produk', exact: true }).click()
    const row = page.locator('tbody tr').filter({ hasText: 'The OG Classic Chocochip NYC' })
    await row.getByText('19 Pcs', { exact: true }).waitFor()
    await page.reload()
    await row.getByText('19 Pcs', { exact: true }).waitFor()
    assert.deepEqual(errors, [])
    console.log('PASS stock 22 -> 19, catalog/admin persistence, duplicate confirmation, insufficient stock, storage rollback, variant aggregation')
  } finally {
    await browser.close()
  }
})().catch(error => { console.error(error); process.exitCode = 1 })
