import { useState } from 'react'
import { AuthContext } from './authContext'
import { MOCK_ADMIN_CREDENTIALS } from '@/data/adminAuth'

const AUTH_KEY = 'happybite-auth-v1'
function readUser() {
  try {
    const saved = JSON.parse(localStorage.getItem(AUTH_KEY))
    if (
      saved?.isLoggedIn === true &&
      typeof saved.user?.name === 'string' &&
      saved.user.name.trim() &&
      typeof saved.user?.email === 'string' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(saved.user.email)
    )
      return {
        name: saved.user.name,
        email: saved.user.email,
        role: saved.user.role === 'admin' ? 'admin' : 'customer',
        ...(saved.user.role === 'admin' && {
          jobTitle: saved.user.jobTitle || 'Head Baker & Owner',
        }),
      }
  } catch {
    /* An unavailable or invalid storage entry starts logged out. */
  }
  return null
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)
  function saveUser(nextUser) {
    // School-project sign-in only. Never retain or persist a password.
    setUser(nextUser)
    try {
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ isLoggedIn: true, user: nextUser }),
      )
    } catch {
      /* In-memory sign-in still works without storage. */
    }
  }
  function login({ name, email }) {
    // Customer login/register must never grant an admin role, even for the admin email.
    saveUser({ name: name.trim(), email: email.trim(), role: 'customer' })
  }
  function loginAdmin({ email, password }) {
    // Temporary mock only; real credential verification belongs on the backend.
    if (
      email.trim().toLowerCase() !== MOCK_ADMIN_CREDENTIALS.email ||
      password !== MOCK_ADMIN_CREDENTIALS.password
    )
      return false
    saveUser({
      name: 'Dhea Ardiansyah',
      jobTitle: 'Head Baker & Owner',
      email: MOCK_ADMIN_CREDENTIALS.email,
      role: 'admin',
    })
    return true
  }
  function logout() {
    setUser(null)
    try {
      localStorage.removeItem(AUTH_KEY)
    } catch {
      /* Storage can be disabled by the browser. */
    }
  }
  return (
    <AuthContext.Provider
      value={{ isLoggedIn: user !== null, user, login, loginAdmin, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
