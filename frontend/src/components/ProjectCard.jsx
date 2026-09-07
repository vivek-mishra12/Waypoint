import React from 'react'
import { Link } from 'react-router-dom'

const statusLabel = {
  active: 'Active',
  'on-hold': 'On hold',
  completed: 'Completed',
}

export default function ProjectCard({ project }) {
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
          <span className="font-mono">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-blueprint-light/50 w-full">
          <div
            className="h-1.5 bg-blueprint"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-ink-soft">
        <span>{project.taskCount} task{project.taskCount === 1 ? '' : 's'}</span>
        <span>{project.members?.length || 0} member{project.members?.length === 1 ? '' : 's'}</span>
      </div>
    </Link>
  )
}
