import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Brand from '@/components/Brand'
import Icon from '@/components/Icon'
import LoginForm from '@/pages/Login/components/LoginForm'
import RegisterForm from '@/pages/Login/components/RegisterForm'
import SiteDialog from '@/components/SiteDialog'

const tabs = [
  { id: 'login', label: 'Masuk (Login)' },
  { id: 'register', label: 'Daftar Akun Baru' },
]

export default function Login() {
  const { state } = useLocation()
  const [activeTab, setActiveTab] = useState('login')
  const [dialog, setDialog] = useState(null)

  function switchTab(tab, focus = false) {
    setActiveTab(tab)
    if (focus) document.getElementById(`tab-${tab}`)?.focus()
  }

  function handleTabKey(event, index) {
    const indexes = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }
    if (event.key in indexes) {
      event.preventDefault()
      switchTab(tabs[indexes[event.key]].id, true)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <header className="border-b border-primary/30 bg-white/90">
        <div className="mx-auto flex min-h-[68px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-10">
          <Brand subtitle="Fresh Artisan Cookies" />
          <Link
            to="/katalog"
            className="inline-flex items-center gap-2 rounded-full bg-peach px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-blush"
          >
            <Icon name="back" className="h-4 w-4" />
            Kembali
          </Link>
        </div>
      </header>

      <main
        id="main"
        className="flex flex-1 items-center justify-center px-4 py-10 sm:py-[52px]"
      >
        <section
          aria-labelledby="login-brand"
          className="w-full max-w-[480px] rounded-[26px] border border-primary/20 bg-white px-5 py-8 shadow-warm sm:px-10 sm:py-10"
        >
          <div className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-peach bg-white shadow-soft">
              <img src="/favicon.svg" alt="" className="h-8 w-8" />
            </span>
            <h1
              id="login-brand"
              className="mt-3 text-2xl font-bold tracking-[-.7px]"
            >
              HappyBite
            </h1>
            <p className="mt-1 text-[11px] leading-5 sm:text-xs">
              Fresh Artisan Cookies, dipanggang dengan cinta
            </p>
          </div>

          {state?.returnTo === '/pembayaran' && (
            <p className="mt-4 rounded-xl bg-peach p-3 text-center text-xs leading-5 text-baked">
              Masuk atau daftar untuk melanjutkan pembayaran dan menyimpan
              riwayat pesananmu.
            </p>
          )}
          <div
            role="tablist"
            aria-label="Akses akun HappyBite"
            className="mt-6 flex rounded-full border border-primary/25 bg-blush/80 p-1 shadow-inner"
          >
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => switchTab(tab.id)}
                onKeyDown={(event) => handleTabKey(event, index)}
                className={`min-h-10 flex-1 rounded-full px-2 py-2 text-xs transition-colors sm:text-sm ${activeTab === tab.id ? 'bg-terracotta font-bold text-white shadow-soft' : 'text-muted hover:text-chocolate'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            id="panel-login"
            role="tabpanel"
            aria-labelledby="tab-login"
            hidden={activeTab !== 'login'}
          >
            <LoginForm onRegister={() => switchTab('register', true)} />
          </div>
          <div
            id="panel-register"
            role="tabpanel"
            aria-labelledby="tab-register"
            hidden={activeTab !== 'register'}
            tabIndex={0}
          >
            <RegisterForm onLogin={() => switchTab('login', true)} />
          </div>
        </section>
      </main>

      <footer className="border-t border-primary/30 bg-white/70">
        <div className="mx-auto flex min-h-[66px] max-w-[1440px] flex-col items-center justify-between gap-4 px-4 py-5 text-center text-[11px] leading-5 sm:px-10 lg:flex-row lg:text-left">
          <p>
            <span className="font-semibold">HappyBite Oven & Bakery.</span> ©
            2025 • Freshly baked with love & premium Belgian chocolate
          </p>
          <nav
            aria-label="Informasi dan bantuan"
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-muted"
          >
            <button
              onClick={() => setDialog('Kebijakan Privasi')}
              className="hover:text-baked"
            >
              Kebijakan Privasi
            </button>
            <span aria-hidden="true">•</span>
            <button
              onClick={() => setDialog('Syarat & Ketentuan')}
              className="hover:text-baked"
            >
              Syarat & Ketentuan
            </button>
            <span aria-hidden="true">•</span>
            <button
              onClick={() => setDialog('Pusat Bantuan')}
              className="hover:text-baked"
            >
              Pusat Bantuan
            </button>
          </nav>
        </div>
      </footer>
      {dialog && <SiteDialog kind={dialog} onClose={() => setDialog(null)} />}
    </div>
  )
}
