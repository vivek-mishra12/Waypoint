import React from 'react'

const priorityColor = {
  low: 'border-l-blueprint-light',
  medium: 'border-l-blueprint',
  high: 'border-l-amber',
}

export default function TaskCard({
  task,
  members = [],
  onChangeStatus,
  onToggleComplete,
  onAssign,
  onDelete,
}) {
  const isDone = Boolean(task.isCompleted || task.status === 'done')
  const assigneeId = task.assignee?._id || task.assignee || ''

  return (
    <div
      className={`bg-white border border-blueprint-light border-l-4 ${
        priorityColor[task.priority] || 'border-l-blueprint'
      } px-3.5 py-3 mb-3 transition-opacity ${isDone ? 'opacity-75 bg-paper/50' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <label className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isDone}
            onChange={() => onToggleComplete && onToggleComplete(task._id)}
            className="mt-0.5 h-4 w-4 rounded border-blueprint-light text-blueprint focus:ring-blueprint cursor-pointer shrink-0"
          />
          <span
            className={`text-sm font-medium leading-snug break-words select-none ${
              isDone ? 'line-through text-ink-soft' : 'text-ink'
            }`}
          >
            {task.title}
          </span>
        </label>

        <button
          type="button"
          onClick={() => onDelete && onDelete(task._id)}
          aria-label="Delete task"
          className="text-ink-soft/60 hover:text-amber text-lg leading-none shrink-0 ml-1 cursor-pointer"
        >
          ×
        </button>
      </div>

      {task.description && (
        <p
          className={`text-xs mb-3 line-clamp-3 pl-6.5 ${
            isDone ? 'text-ink-soft/60 line-through' : 'text-ink-soft'
          }`}
        >
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-blueprint-light/40">
        <select
          value={assigneeId}
          onChange={(e) => onAssign && onAssign(task._id, e.target.value)}
          className="text-xs border border-blueprint-light bg-paper px-1.5 py-1 focus:outline-none focus:border-blueprint max-w-[45%] cursor-pointer"
        >
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          value={task.status || 'todo'}
          onChange={(e) => onChangeStatus && onChangeStatus(task._id, e.target.value)}
          className="text-xs border border-blueprint-light bg-paper px-1.5 py-1 focus:outline-none focus:border-blueprint cursor-pointer"
        >
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  )
}