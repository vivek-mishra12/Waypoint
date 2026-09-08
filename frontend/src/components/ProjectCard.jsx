import React from "react";
import { Link } from "react-router-dom";

const statusStyles = {
  active:
    "bg-emerald-500/10 text-emerald-300 border-emerald-400/15",

  "on-hold":
    "bg-amber-500/10 text-amber-300 border-amber-400/15",

  completed:
    "bg-sky-500/10 text-sky-300 border-sky-400/15",
};

export default function ProjectCard({
  project,
  tasks = [],
}) {

  const projectTasks = tasks.length
    ? tasks.filter(
        (task) =>
          (task.project?._id ||
            task.project) === project._id
      )
    : [];

  const totalTasks =
    projectTasks.length ||
    project.taskCount ||
    0;

  const completedTasks =
    projectTasks.filter(
      (task) =>
        task.isCompleted ||
        task.status === "done" ||
        task.status === "completed"
    ).length;

  const progress = projectTasks.length
    ? Math.round(
        (completedTasks / totalTasks) * 100
      )
    : project.progress || 0;

  const percentage = Math.min(
    100,
    Math.max(0, progress)
  );

  const [
    statusLabel,
    statusClass,
  ] =
    statusStyles[project.status]
      ? [
          project.status,
          statusStyles[project.status],
        ]
      : [
          project.status || "Active",
          "bg-indigo-500/10 text-indigo-300 border-indigo-400/15",
        ];

  return (
    <Link
      to={`/projects/${project._id}`}
      className="
        glass
        card-hover

        rounded-2xl

        p-5

        block

        group

        relative
        overflow-hidden
      "
    >

      {/* Glow */}

      <div
        className="
          absolute
          -right-16
          -top-16

          h-32
          w-32

          rounded-full

          bg-indigo-500/10

          blur-2xl

          group-hover:bg-indigo-500/20

          transition-colors
        "
      />

      <div className="relative">

        {/* Header */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
            mb-4
          "
        >

          <div className="min-w-0">

            <h3
              className="
                font-semibold
                text-[15px]
                truncate

                group-hover:text-indigo-300

                transition-colors
              "
            >
              {project.name}
            </h3>

            <p
              className="
                text-xs
                text-slate-500
                mt-1
              "
            >
              Project workspace
            </p>

          </div>

          <span
            className={`
              shrink-0

              text-[10px]

              font-medium

              px-2.5
              py-1

              rounded-full

              border

              ${statusClass}
            `}
          >
            {statusLabel}
          </span>

        </div>

        {/* Description */}

        {project.description ? (

          <p
            className="
              text-sm
              leading-6
              text-slate-400
              line-clamp-2
              mb-5
            "
          >
            {project.description}
          </p>

        ) : (

          <div className="h-5 mb-5" />

        )}

        {/* Progress */}

        <div
          className="
            flex
            justify-between
            text-xs
            mb-2
          "
        >

          <span className="text-slate-500">
            Progress
          </span>

          <span className="font-medium text-slate-200">
            {percentage}%
          </span>

        </div>

        <div
          className="
            h-2

            rounded-full

            bg-slate-800/80

            overflow-hidden
          "
        >

          <div
            className="
              h-full

              rounded-full

              progress-fill

              transition-all

              duration-700
            "
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

        {/* Footer */}

        <div
          className="
            mt-5
            pt-4

            border-t
            border-white/[.06]

            flex
            items-center
            justify-between

            text-xs
            text-slate-500
          "
        >

          <span>
            {totalTasks}{" "}
            task
            {totalTasks === 1
              ? ""
              : "s"}
          </span>

          <span>
            {project.members?.length || 0}{" "}
            member
            {project.members?.length === 1
              ? ""
              : "s"}
          </span>

        </div>

      </div>

    </Link>
  );
}