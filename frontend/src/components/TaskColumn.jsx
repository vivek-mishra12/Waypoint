import React from 'react'
import TaskCard from './TaskCard.jsx'

export default function TaskColumn({
  title,
  tasks,
  members,
  onChangeStatus,
  onToggleComplete,
  onAssign,
  onDelete,
}) {
  return (
    <div className="flex-1 min-w-[260px]">
      <div className="flex items-center justify-between border-b-2 border-ink pb-2 mb-4">
        <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
        <span className="text-xs font-mono text-ink-soft">{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <p className="text-xs text-ink-soft/70 italic">No tasks here</p>
      ) : (
        tasks.map((t) => (
          <TaskCard
            key={t._id}
            task={t}
            members={members}
            onChangeStatus={onChangeStatus}
            onToggleComplete={onToggleComplete}
            onAssign={onAssign}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  )
}