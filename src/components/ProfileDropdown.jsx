import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import Icon from './Icon'

export default function ProfileDropdown() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const container = useRef(null)
  const trigger = useRef(null)
  useEffect(() => {
    if (!open) return
    container.current?.querySelector('a')?.focus()
    function outside(event) {
      if (!container.current?.contains(event.target)) setOpen(false)
    }
    function escape(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])
  return (
    <div
      ref={container}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-label={`Menu akun ${user.name}`}
        aria-expanded={open}
        aria-controls="profile-dropdown"
        onClick={() => setOpen(!open)}
        className="rounded-full bg-baked p-2 text-white hover:bg-terracotta"
      >
        <Icon name="user" className="h-4 w-4" />
      </button>
      {open && (
        <div
          id="profile-dropdown"
          className="absolute right-0 top-full z-50 mt-3 w-56 rounded-2xl border border-primary/20 bg-white p-2 shadow-warm"
        >
          <p className="truncate px-3 py-2 text-xs font-bold text-muted">
            {user.name}
          </p>
          <Link
            to="/profil"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-3 text-sm font-semibold hover:bg-peach"
          >
            Profil Akun
          </Link>
          <Link
            to="/riwayat-pesanan"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-3 text-sm font-semibold hover:bg-peach"
          >
            Riwayat Pesanan
          </Link>
          <div className="my-1 border-t border-primary/20" />
          <button
            type="button"
            onClick={() => {
              logout()
              setOpen(false)
              navigate('/')
            }}
            className="w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            Keluar
          </button>
        </div>
      )}
    </div>
  )
}
