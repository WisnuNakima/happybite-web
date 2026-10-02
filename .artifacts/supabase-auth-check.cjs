// Exercise the real SDK with intercepted HTTP, never creating remote test users.
const { chromium } = require(
  process.env.TEMP + '/happybite-auth-check/node_modules/playwright',
)
const assert = require('node:assert/strict')
const base = 'http://127.0.0.1:5185'

;(async () => {
  const { loadEnv } = await import('vite')
  const env = loadEnv('development', process.cwd(), 'VITE_')
  const origin = new URL(env.VITE_SUPABASE_URL).origin
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const ids = {
    pelanggan: '00000000-0000-4000-8000-000000000001',
    admin: '00000000-0000-4000-8000-000000000002',
  }
  const makeUser = (
    role = 'pelanggan',
    email = 'customer@example.test',
    name = 'Nama dari Profil',
  ) => ({
    id: ids[role],
    aud: 'authenticated',
    role: 'authenticated',
    email,
    email_confirmed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { nama_lengkap: name, role: 'admin' },
    identities: [{ id: ids[role], user_id: ids[role], provider: 'email' }],
  })
  const session = (user) => {
    const payload = {
      sub: user.id,
      email: user.email,
      role: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + 3600,
    }
    const token = [
      Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString(
        'base64url',
      ),
      Buffer.from(JSON.stringify(payload)).toString('base64url'),
      'test-signature',
    ].join('.')
    return {
      access_token: token,
      refresh_token: 'test-refresh-' + user.id,
      token_type: 'bearer',
      expires_in: 3600,
      user,
    }
  }
  try {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    page.setDefaultTimeout(10000)
    const goto = (url) => page.goto(url, { waitUntil: 'domcontentloaded' })
    await context.route('**/*', (route) => {
      const target = new URL(route.request().url()).origin
      return target === base || target === origin
        ? route.continue()
        : route.abort()
    })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    let currentUser = makeUser()
    let profileFailure = false
    let logoutFailure = false
    let signupMode = 'confirm'
    let lastSignup
    let signInRequests = 0
    let profileRequests = 0
    let profileGate = null
    await context.route(origin + '/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const json = (body, status = 200) =>
        route.fulfill({
          status,
          headers: {
            'x-supabase-api-version': '2024-01-01',
            'access-control-allow-origin': '*',
            'access-control-expose-headers': 'x-supabase-api-version',
          },
          contentType: 'application/json',
          body: JSON.stringify(body),
        })
      if (url.pathname.endsWith('/token')) {
        signInRequests++
        const body = request.postDataJSON()
        await new Promise((resolve) => setTimeout(resolve, 150))
        if (body.password === 'wrong')
          return json(
            { code: 'invalid_credentials', msg: 'Invalid login credentials' },
            400,
          )
        if (body.email === 'unconfirmed@example.test')
          return json(
            { code: 'email_not_confirmed', msg: 'Email not confirmed' },
            400,
          )
        currentUser = makeUser(
          body.email === 'admin@example.test' ? 'admin' : 'pelanggan',
          body.email,
        )
        return json(session(currentUser))
      }
      if (url.pathname.endsWith('/signup')) {
        lastSignup = request.postDataJSON()
        assert.deepEqual(lastSignup.data, { nama_lengkap: 'Nama Pendaftaran' })
        await new Promise((resolve) => setTimeout(resolve, 150))
        if (signupMode === 'duplicate')
          return json(
            { code: 'user_already_exists', msg: 'User already registered' },
            422,
          )
        if (signupMode === 'error')
          return json({ code: 'unexpected_failure', msg: 'Failure' }, 500)
        currentUser = makeUser(
          'pelanggan',
          lastSignup.email,
          lastSignup.data.nama_lengkap,
        )
        if (signupMode === 'hidden-duplicate')
          return json({ ...currentUser, identities: [] })
        return json(
          signupMode === 'session' ? session(currentUser) : currentUser,
        )
      }
      if (url.pathname.endsWith('/profiles')) {
        assert.equal(
          request.method(),
          'GET',
          'Frontend must never insert/update profiles',
        )
        assert.equal(url.searchParams.get('select'), '*')
        assert.equal(url.searchParams.get('id'), 'eq.' + currentUser.id)
        profileRequests++
        if (profileGate) await profileGate
        await new Promise((resolve) => setTimeout(resolve, 200))
        if (profileFailure)
          return json({ code: 'PGRST116', message: 'Profile unavailable' }, 406)
        return json({
          id: currentUser.id,
          nama_lengkap: 'Nama dari Profil',
          role: currentUser.id === ids.admin ? 'admin' : 'pelanggan',
        })
      }
      if (url.pathname.endsWith('/logout')) {
        if (logoutFailure)
          return json({ code: 'unexpected_failure', msg: 'Failure' }, 500)
        return route.fulfill({ status: 204 })
      }
      if (url.pathname.endsWith('/user')) return json(currentUser)
      throw new Error('Unexpected Supabase endpoint: ' + url.pathname)
    })
    async function login(
      email = 'customer@example.test',
      password = 'password123',
    ) {
      await page.locator('#login-email').fill(email)
      await page.locator('#login-password').fill(password)
      await page
        .getByRole('button', { name: 'Masuk ke Akun HappyBite', exact: true })
        .click()
    }
    async function logout() {
      await page
        .getByRole('button', {
          name: 'Menu akun Nama dari Profil',
          exact: true,
        })
        .click()
      await page.getByRole('button', { name: 'Keluar', exact: true }).click()
    }
    const memberReady = () =>
      page
        .getByRole('button', {
          name: 'Menu akun Nama dari Profil',
          exact: true,
        })
        .waitFor()
    await goto(base)
    await page.evaluate(() =>
      localStorage.setItem(
        'happybite-auth-v1',
        JSON.stringify({
          isLoggedIn: true,
          user: { name: 'Forged', email: 'fake@example.test', role: 'admin' },
        }),
      ),
    )
    for (const path of [
      '/katalog',
      '/katalog/classic-nyc',
      '/keranjang',
      '/checkout',
      '/pembayaran',
      '/riwayat-pesanan',
    ]) {
      await goto(base + path)
      await page.waitForURL('**/login')
    }
    assert.equal(
      await page.evaluate(() => localStorage.getItem('happybite-auth-v1')),
      null,
    )
    await goto(base + '/admin')
    await page.waitForURL('**/admin/login')
    await goto(base + '/login')
    await login('customer@example.test', 'wrong')
    await page
      .getByText('Email atau kata sandi salah.', { exact: true })
      .waitFor()
    await login('unconfirmed@example.test')
    await page.getByText('Email belum dikonfirmasi.', { exact: true }).waitFor()
    const before = signInRequests
    await login()
    assert.equal(
      await page.getByRole('button', { name: /Memproses/ }).isDisabled(),
      true,
    )
    await page.waitForURL(base + '/')
    await memberReady()
    assert.equal(signInRequests, before + 1)
    await goto(base + '/katalog')
    await page
      .getByRole('heading', { name: 'Katalog Artisan Cookie & Hampers' })
      .waitFor()
    let releaseProfile
    profileGate = new Promise((resolve) => {
      releaseProfile = resolve
    })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.getByText('Memuat sesi...', { exact: true }).waitFor()
    assert.equal(page.url(), base + '/katalog')
    assert.equal(
      await page
        .getByRole('button', { name: 'Masuk / Daftar', exact: true })
        .count(),
      0,
    )
    releaseProfile()
    profileGate = null
    await page
      .getByRole('heading', { name: 'Katalog Artisan Cookie & Hampers' })
      .waitFor()
    assert.equal(page.url(), base + '/katalog')
    assert.equal(
      await page
        .getByRole('button', { name: 'Masuk / Daftar', exact: true })
        .count(),
      0,
    )
    // Metadata claiming admin must not override the profiles role.
    await goto(base + '/admin/produk')
    await page.waitForURL(base + '/')
    await memberReady()
    profileFailure = true
    await goto(base + '/katalog')
    await page.getByRole('button', { name: 'Coba lagi', exact: true }).waitFor()
    assert.equal(page.url(), base + '/katalog')
    assert.equal(
      await page
        .getByRole('heading', { name: 'Katalog Artisan Cookie & Hampers' })
        .count(),
      0,
    )
    profileFailure = false
    await page.getByRole('button', { name: 'Coba lagi', exact: true }).click()
    await page
      .getByRole('heading', { name: 'Katalog Artisan Cookie & Hampers' })
      .waitFor()
    logoutFailure = true
    await logout()
    // This SDK clears the local session even if remote revocation fails.
    await page.waitForURL(base + '/')
    await page
      .getByRole('button', { name: 'Masuk / Daftar', exact: true })
      .waitFor()
      .catch(async (error) => {
        console.log(
          'Navbar after logout:',
          await page.locator('header').innerText(),
          errors,
        )
        throw error
      })
    logoutFailure = false
    console.log(
      'PASS guest guards, legacy auth removal, login/errors/loading, profile role, refresh, retry and logout',
    )

    await goto(base + '/login')
    await login('admin@example.test')
    await page.waitForURL(base + '/admin')
    for (const path of [
      '/admin',
      '/admin/produk',
      '/admin/pesanan',
      '/admin/laporan',
    ]) {
      await goto(base + path)
      await page.getByRole('navigation', { name: 'Navigasi admin' }).waitFor()
      assert.equal(page.url(), base + path)
      await page.getByText('Head Baker & Owner', { exact: true }).waitFor()
    }
    await page.getByRole('button', { name: 'Keluar', exact: true }).click()
    await page.waitForURL(base + '/')
    await goto(base + '/admin/login')
    await page.locator('#admin-email').fill('customer@example.test')
    await page.locator('#admin-password').fill('password123')
    await page.getByRole('button', { name: 'Masuk Admin', exact: true }).click()
    await page.waitForURL(base + '/')
    await memberReady()
    await logout()
    await page
      .getByRole('button', { name: 'Masuk / Daftar', exact: true })
      .waitFor()
    console.log(
      'PASS admin via real shared login, all admin routes/refresh, non-admin login cannot promote role',
    )

    await goto(base + '/login')
    await page
      .getByRole('tab', { name: 'Daftar Akun Baru', exact: true })
      .click()
    await page.locator('#register-fullName').fill('Nama Pendaftaran')
    await page.locator('#register-email').fill('new@example.test')
    await page.locator('#register-password').fill('password123')
    const submitRegister = () =>
      page.getByRole('button', { name: 'Buat Akun Baru', exact: true }).click()
    await submitRegister()
    assert.equal(
      await page.getByRole('button', { name: /Memproses/ }).isDisabled(),
      true,
    )
    await page
      .getByText(
        'Pendaftaran berhasil. Silakan cek email kamu untuk konfirmasi, lalu masuk.',
        { exact: true },
      )
      .waitFor()
    assert.equal(page.url(), base + '/login')
    assert.ok(lastSignup.password)
    for (const mode of ['duplicate', 'hidden-duplicate', 'error']) {
      signupMode = mode
      await submitRegister()
      await page
        .getByText(
          mode === 'error'
            ? 'Terjadi kesalahan, coba lagi.'
            : 'Email sudah terdaftar.',
          { exact: true },
        )
        .waitFor()
    }
    signupMode = 'session'
    await submitRegister()
    await page.waitForURL(base + '/')
    await memberReady()
    assert.ok(profileRequests > 0)
    assert.deepEqual(errors, [])
    console.log(
      'PASS signup metadata only, email-confirmation message, duplicate/generic errors, immediate session, no frontend profile writes',
    )
    const secondTab = await context.newPage()
    await secondTab.goto(base + '/katalog', { waitUntil: 'domcontentloaded' })
    await secondTab
      .getByRole('heading', { name: 'Katalog Artisan Cookie & Hampers' })
      .waitFor()
    await logout()
    await page
      .getByRole('button', { name: 'Masuk / Daftar', exact: true })
      .waitFor()
    await secondTab.waitForURL('**/login')
    console.log(
      'PASS auth-event sign-out across tabs and loading guard without guest-navbar flicker',
    )
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
