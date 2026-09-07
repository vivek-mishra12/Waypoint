import React from 'react'

const priorityColor = {
  low: 'border-l-blueprint-light',
  medium: 'border-l-blueprint',
  high: 'border-l-amber',
}

export default function TaskCard({ task, members, onChangeStatus, onAssign, onDelete }) {
  return (
    <div className={`bg-white border border-blueprint-light border-l-4 ${priorityColor[task.priority]} px-3.5 py-3 mb-3`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm text-ink font-medium leading-snug">{task.title}</p>
        <button
          onClick={() => onDelete(task._id)}
          aria-label="Delete task"
          className="text-ink-soft/60 hover:text-amber text-sm leading-none shrink-0"
        >
          ×
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-ink-soft mb-3 line-clamp-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between gap-2 mt-2">
        <select
          value={task.assignee?._id || ''}
          onChange={(e) => onAssign(task._id, e.target.value)}
          className="text-xs border border-blueprint-light bg-paper px-1.5 py-1 focus:outline-none focus:border-blueprint max-w-[45%]"
        >
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          value={task.status}
          onChange={(e) => onChangeStatus(task._id, e.target.value)}
          className="text-xs border border-blueprint-light bg-paper px-1.5 py-1 focus:outline-none focus:border-blueprint"
        >
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  )
}
