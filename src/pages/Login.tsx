import { useState, type FormEvent } from 'react'

const USERNAME = 'Bask'
const PASSWORD = 'Bask2026'

interface Props {
  onLogin: () => void
}

export function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (username === USERNAME && password === PASSWORD) {
      onLogin()
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen bg-brand-blanco flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-brand-stone/40 shadow-sm p-8">
          <div className="mb-8 text-center">
            <img
              src="/logo.png"
              alt="BASK"
              className="h-8 w-auto mx-auto mb-4"
              style={{ filter: 'brightness(0)' }}
            />
            <p className="text-sm text-brand-stone mt-1">Management Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-brand-charcoal mb-1.5">
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(false) }}
                className="w-full px-3 py-2.5 rounded-lg border border-brand-stone/60 text-sm text-brand-charcoal placeholder-brand-stone focus:outline-none focus:ring-2 focus:ring-brand-charcoal focus:border-transparent"
                placeholder="Username"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-charcoal mb-1.5">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false) }}
                className="w-full px-3 py-2.5 rounded-lg border border-brand-stone/60 text-sm text-brand-charcoal placeholder-brand-stone focus:outline-none focus:ring-2 focus:ring-brand-charcoal focus:border-transparent"
                placeholder="Password"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                Incorrect username or password.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-brand-charcoal text-white text-sm font-medium py-2.5 rounded-lg hover:bg-brand-palm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-charcoal focus:ring-offset-2 mt-2"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
