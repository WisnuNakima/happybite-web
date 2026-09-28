import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/authContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SiteDialog from '@/components/SiteDialog'

export default function AccountPlaceholder({ kind, cartCount }) {
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()
  const [dialog, setDialog] = useState(null)
  const openAccount = () => navigate('/login')
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navbar
        cartCount={cartCount}
        onAccount={openAccount}
        onSearch={() => navigate('/katalog#catalog-search')}
      />
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <section className="w-full max-w-lg rounded-[30px] bg-white p-8 text-center shadow-soft">
          <h1 className="text-2xl font-bold">
            {kind === 'profile' ? 'Profil Akun' : 'Riwayat Pesanan'}
          </h1>
          {kind === 'profile' ? (
            <dl className="mt-6 space-y-3 text-left text-sm">
              <div>
                <dt className="text-xs text-muted">Nama Lengkap</dt>
                <dd className="mt-1 break-words font-semibold">{user.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Alamat Email</dt>
                <dd className="mt-1 break-all">{user.email}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-5 text-sm leading-6 text-muted">
              Riwayat pesanan akan segera tersedia.
            </p>
          )}
          <p className="mt-5 text-xs text-muted">
            Akun demo untuk proyek sekolah.
          </p>
          <Link
            to="/katalog"
            className="mt-6 inline-flex rounded-full bg-baked px-6 py-3 text-sm font-bold text-white"
          >
            Lihat Katalog
          </Link>
        </section>
      </main>
      <Footer onAccount={openAccount} onInfo={setDialog} />
      {dialog && (
        <SiteDialog
          kind={dialog}
          onClose={() => setDialog(null)}
          onAccount={openAccount}
        />
      )}
    </div>
  )
}
