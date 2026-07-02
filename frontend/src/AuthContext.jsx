import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

function apiURL(path) {
  return `/api${path}`
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(() => token !== null)

  useEffect(() => {
    if (!token) return
    fetch(apiURL('/auth/me/'), {
      headers: { Authorization: `Token ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  function login(username, password) {
    return fetch(apiURL('/auth/login/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((r) => {
        if (!r.ok) throw new Error('Invalid credentials')
        return r.json()
      })
      .then((data) => {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setUser(data.user)
      })
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  function authHeaders() {
    return token ? { Authorization: `Token ${token}` } : {}
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, authHeaders }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
