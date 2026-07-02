import { useState } from 'react'

import { useAuth } from './AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    login(username, password)
      .catch((err) => {
        setError(err.message || 'Login failed')
      })
      .finally(() => setBusy(false))
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">⚽</div>
        <h1>FIFA World Cup 26</h1>
        <p className="login-subtitle">Sticker Collection</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            disabled={busy}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" disabled={busy || !username || !password}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
