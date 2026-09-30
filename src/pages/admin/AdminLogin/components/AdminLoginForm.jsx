import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/authContext'

export default function AdminLoginForm() {
  const { loginAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    if (!loginAdmin({ email, password })) {
      setError('Email atau kata sandi admin salah.')
      return
    }
    navigate('/admin', { replace: true })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="admin-email" className="mb-1 block text-sm">
          Email Admin
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setError('')
          }}
          aria-describedby={error ? 'admin-login-error' : undefined}
          className="w-full rounded-xl border border-primary/40 bg-white px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-1 block text-sm">
          Kata Sandi
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setError('')
          }}
          aria-describedby={error ? 'admin-login-error' : undefined}
          className="w-full rounded-xl border border-primary/40 bg-white px-3 py-2"
        />
      </div>
      {error && (
        <p id="admin-login-error" role="alert" className="text-sm text-baked">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="rounded-xl bg-terracotta px-4 py-2 font-semibold text-white"
      >
        Masuk Admin
      </button>
    </form>
  )
}
