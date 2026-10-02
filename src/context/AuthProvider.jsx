import { useCallback, useEffect, useRef, useState } from 'react'
import { AuthContext } from './authContext'
import { supabase } from '@/lib/supabaseClient'
import { useLocation, useNavigate } from 'react-router-dom'

async function readProfile(session) {
  if (!session) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  if (error || !data || !['pelanggan', 'admin'].includes(data.role))
    throw new Error('Profil akun belum dapat dimuat. Silakan coba lagi.')
  return {
    id: session.user.id,
    name: data.nama_lengkap,
    email: session.user.email,
    role: data.role,
    jobTitle: data.role === 'admin' ? 'Head Baker & Owner' : '',
  }
}

export default function AuthProvider({ children }) {
  const navigate = useNavigate()
  const { key: locationKey } = useLocation()
  const [logoutLocationKey, setLogoutLocationKey] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const mounted = useRef(false)
  const revision = useRef(0)
  const pending = useRef(null)
  const signingOut = useRef(false)

  const cancelPending = useCallback(() => {
    revision.current++
    pending.current = null
  }, [])

  const restoreSession = useCallback((session) => {
    const key = session?.access_token || null
    if (pending.current?.key === key) return pending.current.promise
    const request = ++revision.current
    setLoading(true)
    setAuthError('')
    const promise = readProfile(session)
      .then((profile) => {
        if (!mounted.current || request !== revision.current)
          throw new Error('Sesi telah berubah. Silakan masuk kembali.')
        setUser(profile)
        return profile
      })
      .catch((error) => {
        if (mounted.current && request === revision.current) {
          pending.current = null
          setUser(null)
          setAuthError('Profil akun belum dapat dimuat. Silakan coba lagi.')
        }
        throw error
      })
      .finally(() => {
        if (mounted.current && request === revision.current) setLoading(false)
      })
    pending.current = { key, promise }
    return promise
  }, [])

  useEffect(() => {
    mounted.current = true
    let active = true
    let eventVersion = 0
    let timer
    // Discard the old demo login; Supabase alone persists the session now.
    try {
      localStorage.removeItem('happybite-auth-v1')
    } catch {
      /* Storage may be disabled. */
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Explicit logout navigates home before clearing the protected page.
      // Otherwise its guard can race the caller and send the user to Login.
      if (_event === 'SIGNED_OUT' && signingOut.current) return
      eventVersion++
      clearTimeout(timer)
      // Keep the auth callback synchronous; profile queries run outside it.
      timer = setTimeout(() => {
        if (active) restoreSession(session).catch(() => {})
      }, 0)
    })
    const initialVersion = eventVersion
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active || initialVersion !== eventVersion) return
        if (error) throw error
        return restoreSession(data.session)
      })
      .catch(() => {
        if (!active || initialVersion !== eventVersion) return
        setUser(null)
        setAuthError('Sesi akun belum dapat dimuat. Silakan coba lagi.')
        setLoading(false)
      })
    return () => {
      active = false
      mounted.current = false
      cancelPending()
      clearTimeout(timer)
      subscription.unsubscribe()
    }
  }, [restoreSession, cancelPending])

  async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error) throw error
    if (!data.session) throw new Error('Sesi tidak tersedia.')
    return restoreSession(data.session)
  }

  async function register({ name, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { nama_lengkap: name.trim() } },
    })
    if (error) throw error
    // Supabase may conceal an existing account behind an empty identities list.
    if (data.user?.identities?.length === 0) {
      const duplicate = new Error('Email sudah terdaftar.')
      duplicate.code = 'user_already_exists'
      throw duplicate
    }
    const profile = data.session ? await restoreSession(data.session) : null
    return { session: data.session, user: profile }
  }

  async function logout() {
    signingOut.current = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        // The SDK can clear the local session even when remote revocation fails.
        // Follow that session rather than leaving a stale signed-in UI behind.
        const { data, error: sessionError } = await supabase.auth.getSession()
        if (sessionError || data.session) throw error
      }
      // BrowserRouter navigation is a transition. Keep the previous route's
      // guard waiting until that transition commits, even if user clears first.
      setLogoutLocationKey(locationKey)
      navigate('/', { replace: true })
      await restoreSession(null)
    } finally {
      signingOut.current = false
    }
  }

  async function retryAuth() {
    pending.current = null
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      await restoreSession(data.session)
    } catch {
      setAuthError('Sesi akun belum dapat dimuat. Silakan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: user !== null,
        user,
        loading: loading || logoutLocationKey === locationKey,
        authError,
        retryAuth,
        login,
        loginAdmin: login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
