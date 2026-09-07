import React from 'react'

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-md bg-paper border border-blueprint-light sheet-corners px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-ink-soft hover:text-ink text-lg leading-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
