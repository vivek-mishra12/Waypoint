import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import TaskColumn from '../components/TaskColumn.jsx'
import Modal from '../components/Modal.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showNewTask, setShowNewTask] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [taskSubmitting, setTaskSubmitting] = useState(false)
  const [taskError, setTaskError] = useState('')

  const [showMembers, setShowMembers] = useState(false)
  const [memberEmail, setMemberEmail] = useState('')
  const [memberError, setMemberError] = useState('')
  const [memberSubmitting, setMemberSubmitting] = useState(false)

  const loadAll = async () => {
    setLoading(true)
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`),
      ])
      setProject(projectRes.data)
      setTasks(tasksRes.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load this project.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    setTaskError('')
    setTaskSubmitting(true)
    try {
      await api.post(`/projects/${id}/tasks`, {
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority,
      })
      setTaskTitle('')
      setTaskDesc('')
      setTaskPriority('medium')
      setShowNewTask(false)
      loadAll()
    } catch (err) {
      setTaskError(err.response?.data?.message || 'Could not create task.')
    } finally {
      setTaskSubmitting(false)
    }
  }

  const handleChangeStatus = async (taskId, status) => {
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)))
    try {
      await api.put(`/tasks/${taskId}`, { status })
    } catch (err) {
      loadAll()
    }
  }

  const handleAssign = async (taskId, assigneeId) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { assignee: assigneeId || null })
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data : t)))
    } catch (err) {
      loadAll()
    }
  }

  const handleDeleteTask = async (taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId))
    try {
      await api.delete(`/tasks/${taskId}`)
    } catch (err) {
      loadAll()
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    setMemberError('')
    setMemberSubmitting(true)
    try {
      const { data } = await api.post(`/projects/${id}/members`, { email: memberEmail })
      setProject(data)
      setMemberEmail('')
    } catch (err) {
      setMemberError(err.response?.data?.message || 'Could not add member.')
    } finally {
      setMemberSubmitting(false)
    }
  }

  const handleRemoveMember = async (userId) => {
    try {
      const { data } = await api.delete(`/projects/${id}/members/${userId}`)
      setProject(data)
    } catch (err) {
      loadAll()
    }
  }

  if (loading) return <p className="text-sm text-ink-soft">Loading project…</p>
  if (error) return <p className="text-sm text-amber">{error}</p>
  if (!project) return null

  const isOwner = project.owner._id === user?.id
  const columns = [
    { key: 'todo', title: 'To do' },
    { key: 'in-progress', title: 'In progress' },
    { key: 'done', title: 'Done' },
  ]

  return (
    <div>
      <Link to="/" className="text-xs text-blueprint hover:text-ink">
        ← All projects
      </Link>

      <div className="flex items-start justify-between mt-3 mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{project.name}</h1>
          {project.description && (
            <p className="text-sm text-ink-soft mt-1 max-w-lg">{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowMembers(true)}
            className="text-sm border border-blueprint-light px-3 py-2 text-ink hover:border-blueprint transition-colors"
          >
            Team ({project.members.length})
          </button>
          <button
            onClick={() => setShowNewTask(true)}
            className="bg-blueprint text-white text-sm font-medium px-4 py-2 hover:bg-ink transition-colors"
          >
            New task
          </button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((col) => (
          <TaskColumn
            key={col.key}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.key)}
            members={project.members}
            onChangeStatus={handleChangeStatus}
            onAssign={handleAssign}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>

      {showNewTask && (
        <Modal title="New task" onClose={() => setShowNewTask(false)}>
          {taskError && (
            <div className="mb-4 border-l-2 border-amber bg-amber/5 px-3 py-2 text-sm text-ink">
              {taskError}
            </div>
          )}
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs text-ink-soft mb-1" htmlFor="ttitle">
                Title
              </label>
              <input
                id="ttitle"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full border border-blueprint-light px-3 py-2 text-sm bg-white focus:outline-none focus:border-blueprint"
                placeholder="Design the landing page"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-soft mb-1" htmlFor="tdesc">
                Description (optional)
              </label>
              <textarea
                id="tdesc"
                rows={3}
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                className="w-full border border-blueprint-light px-3 py-2 text-sm bg-white focus:outline-none focus:border-blueprint resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-soft mb-1" htmlFor="tpriority">
                Priority
              </label>
              <select
                id="tpriority"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full border border-blueprint-light px-3 py-2 text-sm bg-white focus:outline-none focus:border-blueprint"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={taskSubmitting}
              className="w-full bg-blueprint text-white text-sm font-medium py-2.5 hover:bg-ink transition-colors disabled:opacity-60"
            >
              {taskSubmitting ? 'Creating…' : 'Create task'}
            </button>
          </form>
        </Modal>
      )}

      {showMembers && (
        <Modal title="Team members" onClose={() => setShowMembers(false)}>
          <ul className="space-y-2 mb-5">
            {project.members.map((m) => (
              <li key={m._id} className="flex items-center justify-between text-sm">
                <span className="text-ink">
                  {m.name} <span className="text-ink-soft">({m.email})</span>
                  {m._id === project.owner._id && (
                    <span className="ml-2 text-[11px] border border-blueprint-light px-1.5 py-0.5 text-ink-soft">
                      Owner
                    </span>
                  )}
                </span>
                {isOwner && m._id !== project.owner._id && (
                  <button
                    onClick={() => handleRemoveMember(m._id)}
                    className="text-xs text-ink-soft hover:text-amber"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>

          {isOwner && (
            <>
              {memberError && (
                <div className="mb-3 border-l-2 border-amber bg-amber/5 px-3 py-2 text-sm text-ink">
                  {memberError}
                </div>
              )}
              <form onSubmit={handleAddMember} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="teammate@company.com"
                  className="flex-1 border border-blueprint-light px-3 py-2 text-sm bg-white focus:outline-none focus:border-blueprint"
                />
                <button
                  type="submit"
                  disabled={memberSubmitting}
                  className="bg-blueprint text-white text-sm font-medium px-3 py-2 hover:bg-ink transition-colors disabled:opacity-60"
                >
                  Add
                </button>
              </form>
              <p className="text-xs text-ink-soft mt-2">
                They need an existing NOVA account with this email.
              </p>
            </>
          )}
        </Modal>
      )}
    </div>
  )
}
