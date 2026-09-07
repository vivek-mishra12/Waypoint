import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper blueprint-grid flex items-center justify-center px-4 font-body">
      <div className="w-full max-w-sm bg-paper border border-blueprint-light sheet-corners px-8 py-10">
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Waypoint</h1>
        <p className="text-sm text-ink-soft mb-8">Create your team workspace</p>

        {error && (
          <div className="mb-5 border-l-2 border-amber bg-amber/5 px-3 py-2 text-sm text-ink">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-ink-soft mb-1" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-blueprint-light px-3 py-2 text-sm bg-white focus:outline-none focus:border-blueprint"
              placeholder="Ada Lovelace"
            />
          </div>
          <div>
            <label className="block text-xs text-ink-soft mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-blueprint-light px-3 py-2 text-sm bg-white focus:outline-none focus:border-blueprint"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-xs text-ink-soft mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-blueprint-light px-3 py-2 text-sm bg-white focus:outline-none focus:border-blueprint"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blueprint text-white text-sm font-medium py-2.5 mt-2 hover:bg-ink transition-colors disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-ink-soft mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blueprint hover:text-ink">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
