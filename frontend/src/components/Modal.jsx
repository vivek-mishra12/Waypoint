import React from 'react'

export default function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-paper border border-blueprint-light sheet-corners px-6 py-6 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-soft hover:text-ink text-lg leading-none cursor-pointer p-1"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}