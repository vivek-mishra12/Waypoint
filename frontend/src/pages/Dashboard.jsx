import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import ProjectCard from '../components/ProjectCard.jsx'
import Modal from '../components/Modal.jsx'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const loadProjects = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/projects')
      setProjects(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load projects.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateError('')
    setCreating(true)
    try {
      await api.post('/projects', { name, description })
      setName('')
      setDescription('')
      setShowCreate(false)
      loadProjects()
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Could not create project.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Projects</h1>
          <p className="text-sm text-ink-soft mt-1">Everything your team is planning and building.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blueprint text-white text-sm font-medium px-4 py-2 hover:bg-ink transition-colors"
        >
          New project
        </button>
      </div>

      {error && (
        <div className="mb-6 border-l-2 border-amber bg-amber/5 px-3 py-2 text-sm text-ink">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink-soft">Loading projects…</p>
      ) : projects.length === 0 ? (
        <div className="border border-dashed border-blueprint-light px-6 py-14 text-center">
          <p className="font-display text-base text-ink mb-1">No projects yet</p>
          <p className="text-sm text-ink-soft mb-5">Create your first project to start planning work.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blueprint text-white text-sm font-medium px-4 py-2 hover:bg-ink transition-colors"
          >
            New project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="New project" onClose={() => setShowCreate(false)}>
          {createError && (
            <div className="mb-4 border-l-2 border-amber bg-amber/5 px-3 py-2 text-sm text-ink">
              {createError}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs text-ink-soft mb-1" htmlFor="pname">
                Project name
              </label>
              <input
                id="pname"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-blueprint-light px-3 py-2 text-sm bg-white focus:outline-none focus:border-blueprint"
                placeholder="Website redesign"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-soft mb-1" htmlFor="pdesc">
                Description (optional)
              </label>
              <textarea
                id="pdesc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-blueprint-light px-3 py-2 text-sm bg-white focus:outline-none focus:border-blueprint resize-none"
                placeholder="What is this project about?"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-blueprint text-white text-sm font-medium py-2.5 hover:bg-ink transition-colors disabled:opacity-60"
            >
              {creating ? 'Creating…' : 'Create project'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
