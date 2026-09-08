import React from "react";

const priorityStyles = {
  low:
    "text-slate-400 bg-slate-500/10 border-slate-400/10",

  medium:
    "text-indigo-300 bg-indigo-500/10 border-indigo-400/10",

  high:
    "text-rose-300 bg-rose-500/10 border-rose-400/10",
};

export default function TaskCard({
  task,
  members = [],
  onChangeStatus,
  onToggleComplete,
  onAssign,
  onDelete,
}) {

  const completed =
    Boolean(
      task.isCompleted ||
      task.status === "done"
    );

  const assigneeId =
    task.assignee?._id ||
    task.assignee ||
    "";

  const priority =
    task.priority || "medium";

  return (
    <div
      className={`
        glass

        rounded-2xl

        p-4

        mb-3

        card-hover

        border-l-2

        ${
          priority === "high"
            ? "border-l-rose-400"
            : priority === "medium"
            ? "border-l-indigo-400"
            : "border-l-slate-600"
        }

        ${completed ? "opacity-70" : ""}
      `}
    >

      <div className="flex gap-3">

        {/* CHECKBOX */}

        <button
          onClick={() =>
            onToggleComplete?.(
              task._id
            )
          }
          aria-label="Toggle task complete"
          className={`
            mt-0.5

            shrink-0

            h-5
            w-5

            rounded-full

            border

            grid
            place-items-center

            transition-all

            ${
              completed
                ? `
                  bg-emerald-500
                  border-emerald-400
                  text-white
                `
                : `
                  border-slate-600
                  hover:border-indigo-400
                `
            }
          `}
        >

          {completed && (
            <span className="text-[10px]">
              ✓
            </span>
          )}

        </button>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">

          {/* TITLE */}

          <div
            className="
              flex
              justify-between
              gap-2
            "
          >

            <h4
              className={`
                text-sm
                font-medium
                leading-5

                ${
                  completed
                    ? `
                      line-through
                      text-slate-500
                    `
                    : "text-slate-100"
                }
              `}
            >
              {task.title}
            </h4>

            <button
              onClick={() =>
                onDelete?.(
                  task._id
                )
              }
              className="
                text-slate-600

                hover:text-rose-300

                transition-colors

                text-lg
                leading-none

                shrink-0
              "
              aria-label="Delete task"
            >
              ×
            </button>

          </div>

          {/* DESCRIPTION */}

          {task.description && (
            <p
              className={`
                text-xs

                leading-5

                mt-2

                ${
                  completed
                    ? `
                      line-through
                      text-slate-600
                    `
                    : "text-slate-500"
                }
              `}
            >
              {task.description}
            </p>
          )}

          {/* FOOTER */}

          <div
            className="
              flex
              items-center
              justify-between

              gap-2

              mt-4
              pt-3

              border-t
              border-white/[.06]
            "
          >

            {/* PRIORITY */}

            <span
              className={`
                text-[10px]

                px-2
                py-1

                rounded-full

                border

                uppercase

                tracking-wider

                ${
                  priorityStyles[
                    priority
                  ] ||
                  priorityStyles.medium
                }
              `}
            >
              {priority}
            </span>

            {/* CONTROLS */}

            <div
              className="
                flex
                gap-1.5
              "
            >

              {/* ASSIGNEE */}

              <select
                value={assigneeId}
                onChange={(event) =>
                  onAssign?.(
                    task._id,
                    event.target.value
                  )
                }
                className="
                  max-w-[100px]

                  bg-slate-900/80

                  border
                  border-white/[.08]

                  rounded-lg

                  px-2
                  py-1.5

                  text-[10px]

                  text-slate-400

                  outline-none

                  focus:border-indigo-400/40
                "
              >

                <option value="">
                  Unassigned
                </option>

                {members.map(
                  (member) => (
                    <option
                      key={member._id}
                      value={member._id}
                    >
                      {member.name}
                    </option>
                  )
                )}

              </select>

              {/* STATUS */}

              <select
                value={
                  task.status ||
                  "todo"
                }
                onChange={(event) =>
                  onChangeStatus?.(
                    task._id,
                    event.target.value
                  )
                }
                className="
                  bg-slate-900/80

                  border
                  border-white/[.08]

                  rounded-lg

                  px-2
                  py-1.5

                  text-[10px]

                  text-slate-400

                  outline-none

                  focus:border-indigo-400/40
                "
              >

                <option value="todo">
                  To do
                </option>

                <option value="in-progress">
                  In progress
                </option>

                <option value="done">
                  Done
                </option>

              </select>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}