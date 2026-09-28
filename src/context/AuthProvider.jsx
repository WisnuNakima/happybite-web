import { useState } from 'react'
import { AuthContext } from './authContext'

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
      return { name: saved.user.name, email: saved.user.email }
  } catch {
    /* An unavailable or invalid storage entry starts logged out. */
  }
  return null
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)
  function login({ name, email }) {
    // School-project sign-in only. Never retain or persist a password.
    const nextUser = { name: name.trim(), email: email.trim() }
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
      value={{ isLoggedIn: user !== null, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
