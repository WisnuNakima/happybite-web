import { Link } from 'react-router-dom'
import Brand from './Brand'
import Icon from './Icon'
import { Reveal } from './Animation'

const favorites = [
  'Classic Chocochip',
  'Matcha Melt',
  'Red Velvet Cream',
  'Triple Dark Walnut',
  'Box Bundle',
]
const helpLinks = [
  'Pengiriman & Same-Day Delivery',
  'Informasi Alergen',
  'FAQ (Tanya Jawab)',
]

export default function Footer({ onAccount, onInfo }) {
  return (
    <Reveal as="footer" id="kontak" className="scroll-mt-36 bg-peach">
      <div className="mx-auto max-w-[1320px] px-5 pb-5 pt-11 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_.7fr_1.05fr_1.15fr] lg:gap-12">
          <div>
            <Brand compact />
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted">
              Kue artisan homemade dengan bahan premium terbaik, dipanggang
              fresh setiap pagi dengan cinta dan resep autentik.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['100% Halal Certified', 'Food Grade Packaging'].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 rounded-full bg-blush px-2.5 py-1 text-[9px] font-bold"
                >
                  <Icon name="seal" className="h-3 w-3 text-baked" />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-semibold">Menu Favorit</h2>
            <ul className="space-y-2.5 text-sm text-muted">
              {favorites.map((name) => (
                <li key={name}>
                  <button
                    onClick={onAccount}
                    className="text-left transition hover:text-baked"
                  >
                    {name}{' '}
                    <Icon
                      name="lock"
                      className="inline h-3 w-3 text-[#93815F]"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-semibold">Bantuan & Belanja</h2>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link to="/keranjang" className="hover:text-baked">
                  Keranjang Belanja
                </Link>
              </li>
              <li>
                <Link to="/#cara-pesan" className="hover:text-baked">
                  Cara Pemesanan
                </Link>
              </li>
              {helpLinks.map((label) => (
                <li key={label}>
                  <button
                    onClick={() => onInfo(label)}
                    className="text-left hover:text-baked"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-semibold">Kunjungi Dapur Kami</h2>
            <ul className="space-y-2.5 text-xs leading-5 text-muted">
              <li className="flex gap-2">
                <Icon name="pin" className="h-4 w-4 text-baked" />
                Jakarta Selatan, Indonesia
              </li>
              <li>
                <button
                  onClick={() => onInfo('Kontak HappyBite')}
                  className="flex gap-2 text-left hover:text-baked"
                >
                  <Icon name="chat" className="h-4 w-4 text-baked" />
                  WhatsApp: +62 812-3456-7890
                </button>
              </li>
              <li className="flex gap-2">
                <Icon name="clock" className="h-4 w-4 text-baked" />
                Setiap Hari: 08.00 - 18.00 WIB
              </li>
            </ul>
            <div className="mt-4 flex gap-2">
              {[
                ['instagram', 'Instagram'],
                ['music', 'TikTok'],
              ].map(([icon, label]) => (
                <button
                  key={icon}
                  onClick={() => onInfo(label)}
                  aria-label={label}
                  className="rounded-full bg-blush/70 p-2 text-muted hover:text-baked"
                >
                  <Icon name={icon} className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-primary/10 pt-5 text-center text-[11px] text-muted sm:text-left">
          <p>
            © {new Date().getFullYear()} HappyBite Artisan Bakery. Hak Cipta
            Dilindungi.
          </p>
        </div>
      </div>
    </Reveal>
  )
}
