import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AppShell({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-paper font-body">
      <aside className="w-60 shrink-0 bg-ink text-paper flex flex-col justify-between">
        <div>
          <div className="px-6 py-6 border-b border-white/10">
            <Link to="/" className="font-display text-xl font-semibold tracking-tight">
              Waypoint
            </Link>
            <p className="text-xs text-paper/50 mt-1">Plan. Collaborate. Deliver.</p>
          </div>
          <nav className="px-4 py-6 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-sm rounded-sm hover:bg-white/10 transition-colors"
            >
              Projects
            </Link>
          </nav>
        </div>
        <div className="px-6 py-5 border-t border-white/10">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-paper/50 truncate mb-3">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="text-xs text-paper/70 hover:text-amber transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 blueprint-grid overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  )
}
