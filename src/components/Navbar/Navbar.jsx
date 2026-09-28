import NavigationLink from './NavigationLink'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '@/components/Brand'
import Icon from '@/components/Icon'
import ProfileDropdown from './ProfileDropdown'
import NotificationButton from './NotificationButton'
import { useAuth } from '@/context/authContext'

const guestLinks = [
  ['Beranda', '/'],
  ['Katalog Menu', '/katalog'],
  ['Tentang Kami', '/#tentang'],
  ['Cara Pesan', '/#cara-pesan'],
  ['Kontak & FAQ', '/#kontak'],
]
const memberLinks = [
  ['Beranda', '/'],
  ['Katalog Menu', '/katalog'],
  ['Riwayat Pesanan', '/riwayat-pesanan'],
  ['Tentang Kami', '/#tentang'],
  ['Kontak & FAQ', '/#kontak'],
]

export default function Navbar({ onAccount, onSearch, cartCount = 0 }) {
  const { isLoggedIn } = useAuth()
  const links = isLoggedIn ? memberLinks : guestLinks
  const [open, setOpen] = useState(false)
  const header = useRef(null)

  useEffect(() => {
    function close(event) {
      if (
        event.key === 'Escape' ||
        (event.type === 'pointerdown' &&
          !header.current?.contains(event.target))
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', close)
    document.addEventListener('pointerdown', close)
    return () => {
      document.removeEventListener('keydown', close)
      document.removeEventListener('pointerdown', close)
    }
  }, [])

  return (
    <header
      ref={header}
      className="sticky top-0 z-40 border-b border-primary/10 bg-canvas/95 backdrop-blur-lg"
    >
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-5 py-4 lg:flex-nowrap lg:px-8">
        <Brand />
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-1 rounded-full bg-peach p-1 md:order-3 md:flex md:w-full md:justify-center lg:order-none lg:w-auto"
        >
          {links.map(([label, to]) => (
            <NavigationLink
              key={to}
              label={label}
              to={to}
              locked={!isLoggedIn && to === '/katalog'}
            />
          ))}
        </nav>
        <div className="flex items-center gap-1.5 xl:gap-2">
          <button
            onClick={onSearch}
            aria-label="Cari cookie"
            className="rounded-full p-2.5 hover:bg-peach"
          >
            <Icon name="search" className="h-[18px] w-[18px]" />
          </button>
          <Link
            to="/keranjang"
            aria-label={`Keranjang, ${cartCount} item`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-full bg-blush/70 px-3 py-2.5 text-xs font-bold hover:bg-blush"
          >
            <Icon name="bag" className="h-4 w-4 text-baked" />
            <span className="hidden sm:inline">Keranjang</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-golden px-1 text-[10px] font-bold">
              {cartCount}
            </span>
          </Link>
          {!isLoggedIn && (
            <button
              onClick={onAccount}
              className="hidden rounded-full bg-white px-5 py-3 text-xs font-bold text-baked shadow-soft md:block"
            >
              Masuk / Daftar
            </button>
          )}
          {isLoggedIn ? (
            <>
              <NotificationButton />
              <ProfileDropdown />
            </>
          ) : (
            <button
              onClick={onAccount}
              aria-label="Akun saya"
              className="hidden rounded-full bg-baked p-2 text-white md:block"
            >
              <Icon name="user" className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="rounded-full p-2 hover:bg-peach md:hidden"
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Navigasi seluler"
          className="space-y-1 border-t border-primary/15 px-5 pb-5 pt-3 md:hidden"
        >
          {links.map(([label, to]) => (
            <NavigationLink
              key={to}
              label={label}
              to={to}
              mobile
              locked={!isLoggedIn && to === '/katalog'}
              onClick={() => {
                setOpen(false)
              }}
            />
          ))}
          {!isLoggedIn && (
            <button
              onClick={() => {
                setOpen(false)
                onAccount()
              }}
              className="mt-3 w-full rounded-full bg-terracotta px-4 py-3 text-sm font-bold text-white"
            >
              Masuk / Daftar
            </button>
          )}
        </nav>
      )}
    </header>
  )
}
