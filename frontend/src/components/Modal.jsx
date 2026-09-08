import React from "react";

export default function Modal({
  title,
  onClose,
  children,
}) {

  return (
    <div
      className="
        fixed
        inset-0

        z-[100]

        bg-black/70

        backdrop-blur-sm

        grid
        place-items-center

        px-4
        py-6

        animate-in
      "
      onClick={onClose}
    >

      <div
        className="
          w-full
          max-w-lg

          glass

          rounded-3xl

          p-6

          shadow-2xl
          shadow-black/40
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <div>

            <p
              className="
                text-[10px]
                uppercase
                tracking-[.2em]
                text-indigo-300/70
                mb-1
              "
            >
              Waypoint
            </p>

            <h2 className="text-xl font-semibold">
              {title}
            </h2>

          </div>

          <button
            onClick={onClose}
            className="
              h-9
              w-9

              rounded-xl

              bg-white/[.04]

              hover:bg-white/[.08]

              text-slate-400
              hover:text-white

              transition-colors
            "
          >
            ×
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}