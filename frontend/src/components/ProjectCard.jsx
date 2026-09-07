import React from 'react'
import { Link } from 'react-router-dom'

const statusLabel = {
  active: 'Active',
  'on-hold': 'On hold',
  completed: 'Completed',
}

export default function ProjectCard({ project, tasks = [] }) {
  // If the project model already provides precalculated progress, use it;
  // otherwise, calculate dynamically from tasks belonging to this project
  const projectTasks = tasks.length > 0 
    ? tasks.filter((t) => (t.project?._id || t.project) === project._id) 
    : []

  const totalTasks = projectTasks.length > 0 ? projectTasks.length : (project.taskCount ?? 0)
  const completedTasks = projectTasks.filter(
    (t) => t.isCompleted || t.status === 'done' || t.status === 'completed'
  ).length

  const progress = projectTasks.length > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : (project.progress ?? 0)

  // Clamp percentage between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <Link
      to={`/projects/${project._id}`}
      className="block bg-white border border-blueprint-light sheet-corners px-5 py-5 hover:border-blueprint transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-display text-base font-semibold text-ink pr-2">{project.name}</h3>
        <span className="shrink-0 text-[11px] border border-blueprint-light px-2 py-0.5 text-ink-soft">
          {statusLabel[project.status] || project.status}
        </span>
      </div>

      {project.description && (
        <p className="text-sm text-ink-soft mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
          <span>Progress</span>
          <span className="font-mono">{clampedProgress}%</span>
        </div>
        <div className="h-1.5 bg-blueprint-light/50 w-full overflow-hidden">
          <div
            className="h-1.5 bg-blueprint transition-all duration-300"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-ink-soft">
        <span>
          {totalTasks} task{totalTasks === 1 ? '' : 's'}
        </span>
        <span>
          {project.members?.length || 0} member{project.members?.length === 1 ? '' : 's'}
        </span>
      </div>
    </Link>
  )
}