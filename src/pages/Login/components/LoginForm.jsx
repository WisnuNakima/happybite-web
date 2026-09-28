import { useState } from 'react'
import Icon from '@/components/Icon'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/authContext'

export default function LoginForm({ onRegister }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [errors, setErrors] = useState({})

  function submit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Masukkan alamat email yang valid.'
    }
    if (!password.trim()) nextErrors.password = 'Kata sandi wajib diisi.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      document
        .getElementById(nextErrors.email ? 'login-email' : 'login-password')
        ?.focus()
      return
    }
    login({ name: 'Amanda Putri', email })
    navigate(state?.returnTo === '/pembayaran' ? '/pembayaran' : '/', {
      replace: true,
    })
  }

  const fieldClass =
    'flex min-h-12 items-center gap-3 rounded-full border bg-canvas px-3.5 text-muted focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15'

  return (
    <>
      <div className="mt-7 text-center">
        <h2 className="text-[23px] font-bold leading-tight tracking-[-.9px] sm:text-[27px]">
          Selamat Datang Kembali!
        </h2>
        <p className="mt-2 text-sm leading-5 text-muted">
          Masukkan detail akun HappyBite milikmu untuk melanjutkan pesanan.
        </p>
      </div>

      <div className="my-5 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-primary/40" />
        <span className="text-[10px] font-semibold sm:text-[11px]">
          MASUK DENGAN EMAIL
        </span>
        <span className="h-px flex-1 bg-primary/40" />
      </div>

      <form onSubmit={submit} noValidate>
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px]">
            <label htmlFor="login-email" className="font-bold tracking-wide">
              ALAMAT EMAIL
            </label>
            <span className="text-muted">Konfirmasi otomatis</span>
          </div>
          <div
            className={`${fieldClass} ${errors.email ? 'border-red-600' : 'border-primary/40'}`}
          >
            <Icon name="mail" />
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="amanda.putri@email.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setErrors((current) => ({ ...current, email: undefined }))
              }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-chocolate outline-none placeholder:text-muted focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="mt-2 text-xs text-red-700"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="login-password"
            className="mb-1.5 block text-[11px] font-bold tracking-wide"
          >
            KATA SANDI
          </label>
          <div
            className={`${fieldClass} ${errors.password ? 'border-red-600' : 'border-primary/40'}`}
          >
            <Icon name="lock" />
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setErrors((current) => ({ ...current, password: undefined }))
              }}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-chocolate outline-none placeholder:text-muted focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <button
              type="button"
              aria-label={
                showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
              }
              aria-pressed={showPassword}
              aria-controls="login-password"
              onClick={() => setShowPassword(!showPassword)}
              className="-mr-2 rounded-full p-2 hover:text-baked"
            >
              <Icon
                name={showPassword ? 'eyeOff' : 'eye'}
                className="h-[18px] w-[18px]"
              />
            </button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="mt-2 text-xs text-red-700"
            >
              {errors.password}
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-2 gap-y-3 text-[10px] sm:text-[11px]">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              name="rememberMe"
              className="h-4 w-4 shrink-0 cursor-pointer accent-terracotta"
            />
            Ingat saya di perangkat ini
          </label>
          <span className="inline-flex items-center gap-1">
            <Icon name="shield" className="h-3.5 w-3.5 text-emerald-600" />
            256-Bit SSL Enkripsi
          </span>
        </div>

        <button
          type="submit"
          className="mt-7 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-terracotta px-4 py-3 text-sm font-bold text-white shadow-warm transition-colors hover:bg-baked"
        >
          Masuk ke Akun HappyBite <Icon name="arrow" className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-6 border-t border-primary/40 pt-7 text-center text-xs leading-6 text-muted sm:text-sm">
        Belum punya akun HappyBite?{' '}
        <button
          type="button"
          onClick={onRegister}
          className="font-semibold text-terracotta hover:text-baked"
        >
          Daftar Sekarang
        </button>
      </div>
    </>
  )
}
