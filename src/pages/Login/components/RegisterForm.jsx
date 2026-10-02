import { useState } from 'react'
import Icon from '@/components/Icon'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/authContext'
import { registerErrorMessage } from '@/lib/authErrors'

export default function RegisterForm({ onLogin }) {
  const [fullName, setFullName] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [errors, setErrors] = useState({})

  function clearFeedback(field) {
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function submit(event) {
    event.preventDefault()
    if (submitting) return
    setSubmitError('')
    setMessage('')
    const nextErrors = {}
    if (!fullName.trim()) nextErrors.fullName = 'Nama lengkap wajib diisi.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Masukkan alamat email yang valid.'
    }
    if (password.length < 8 || !password.trim()) {
      nextErrors.password = 'Kata sandi minimal 8 karakter.'
    }
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      document.getElementById(`register-${firstError}`)?.focus()
      return
    }
    setSubmitting(true)
    try {
      const { session } = await register({ name: fullName, email, password })
      if (session) navigate('/', { replace: true })
      else
        setMessage(
          'Pendaftaran berhasil. Silakan cek email kamu untuk konfirmasi, lalu masuk.',
        )
    } catch (error) {
      setSubmitError(registerErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  // Keep registration fields visually consistent with LoginForm.
  const fieldClass =
    'flex min-h-12 items-center gap-3 rounded-full border bg-canvas px-3.5 text-muted focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15'
  const inputClass =
    'min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-chocolate outline-none placeholder:text-muted focus-visible:ring-0 focus-visible:ring-offset-0'

  return (
    <>
      <div className="mt-7 text-center">
        <h2 className="text-[23px] font-bold leading-tight tracking-[-.9px] sm:text-[27px]">
          Bergabung dengan HappyBite
        </h2>
        <p className="mt-2 text-sm leading-5 text-muted">
          Daftar sekarang untuk mulai memesan cookie favoritmu.
        </p>
      </div>

      <div className="my-5 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-primary/40" />
        <span className="text-[10px] font-semibold sm:text-[11px]">
          DAFTAR DENGAN EMAIL
        </span>
        <span className="h-px flex-1 bg-primary/40" />
      </div>

      <form onSubmit={submit} noValidate>
        <div>
          <label
            htmlFor="register-fullName"
            className="mb-1.5 block text-[11px] font-bold tracking-wide"
          >
            NAMA LENGKAP
          </label>
          <div
            className={`${fieldClass} ${errors.fullName ? 'border-red-600' : 'border-primary/40'}`}
          >
            <Icon name="user" />
            <input
              id="register-fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Amanda Putri"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value)
                clearFeedback('fullName')
              }}
              aria-invalid={!!errors.fullName}
              aria-describedby={
                errors.fullName ? 'register-name-error' : undefined
              }
              className={inputClass}
            />
          </div>
          {errors.fullName && (
            <p
              id="register-name-error"
              role="alert"
              className="mt-2 text-xs text-red-700"
            >
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px]">
            <label htmlFor="register-email" className="font-bold tracking-wide">
              ALAMAT EMAIL
            </label>
            <span className="text-muted">Konfirmasi otomatis</span>
          </div>
          <div
            className={`${fieldClass} ${errors.email ? 'border-red-600' : 'border-primary/40'}`}
          >
            <Icon name="mail" />
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="amanda.putri@email.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearFeedback('email')
              }}
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? 'register-email-error' : undefined
              }
              className={inputClass}
            />
          </div>
          {errors.email && (
            <p
              id="register-email-error"
              role="alert"
              className="mt-2 text-xs text-red-700"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="register-password"
            className="mb-1.5 block text-[11px] font-bold tracking-wide"
          >
            KATA SANDI
          </label>
          <div
            className={`${fieldClass} ${errors.password ? 'border-red-600' : 'border-primary/40'}`}
          >
            <Icon name="lock" />
            <input
              id="register-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                clearFeedback('password')
              }}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? 'register-password-error' : undefined
              }
              className={inputClass}
            />
            <button
              type="button"
              aria-label={
                showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
              }
              aria-pressed={showPassword}
              aria-controls="register-password"
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
              id="register-password-error"
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

        {submitError && (
          <p role="alert" className="mt-4 text-xs text-red-700">
            {submitError}
          </p>
        )}
        {message && (
          <p role="status" className="mt-4 text-xs text-muted">
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="mt-7 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-terracotta px-4 py-3 text-sm font-bold text-white shadow-warm transition-colors hover:bg-baked"
        >
          {submitting ? 'Memproses...' : 'Buat Akun Baru'}{' '}
          <Icon name="arrow" className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-6 border-t border-primary/40 pt-7 text-center text-xs leading-6 text-muted sm:text-sm">
        Sudah memiliki akun?{' '}
        <button
          type="button"
          onClick={onLogin}
          className="font-semibold text-terracotta hover:text-baked"
        >
          Masuk di Sini
        </button>
      </div>
    </>
  )
}
