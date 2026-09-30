import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/context/authContext'
import Icon from '@/components/Icon'
import NotificationButton from '@/components/Navbar/NotificationButton'
import AdminSidebar from '../AdminSidebar'

export default function AdminLayout() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  return (
    <div className="group/admin min-h-dvh bg-canvas text-chocolate md:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center gap-4 border-b border-primary/10 bg-canvas px-6 py-4 shadow-soft xl:group-has-[[data-product-editor]]/admin:mr-[480px] 2xl:group-has-[[data-product-editor]]/admin:mr-[560px]">
          <span className="hidden text-xl font-semibold xl:block">
            HappyBite
          </span>
          <form
            className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-muted/40 bg-peach px-3 sm:max-w-sm"
            onSubmit={(event) => {
              event.preventDefault()
              navigate(`/admin/produk?q=${encodeURIComponent(query)}`)
            }}
          >
            <Icon name="search" className="h-4 w-4 text-muted" />
            <input
              aria-label="Pencarian admin"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari pesanan, cookies, atau pelanggan..."
              className="min-w-0 flex-1 bg-transparent py-2 text-xs outline-none focus-visible:ring-0"
            />
          </form>
          <div className="ml-auto flex items-center gap-3">
            <NotificationButton />
            <span className="rounded-full bg-chocolate p-2 text-white">
              <Icon name="user" className="h-4 w-4" />
            </span>
            <div className="text-xs">
              <p className="font-bold">{user?.name}</p>
              <p className="mt-0.5 text-muted">
                {user?.jobTitle || user?.role}
              </p>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 2xl:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
