import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../api/axios";
import TaskColumn from "../components/TaskColumn.jsx";
import Modal from "../components/Modal.jsx";

import { useAuth } from "../context/AuthContext.jsx";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* -----------------------------
     New task modal
  ----------------------------- */

  const [showNewTask, setShowNewTask] =
    useState(false);

  const [taskTitle, setTaskTitle] =
    useState("");

  const [taskDescription, setTaskDescription] =
    useState("");

  const [taskPriority, setTaskPriority] =
    useState("medium");

  const [taskSubmitting, setTaskSubmitting] =
    useState(false);

  const [taskError, setTaskError] =
    useState("");

  /* -----------------------------
     Members modal
  ----------------------------- */

  const [showMembers, setShowMembers] =
    useState(false);

  const [memberEmail, setMemberEmail] =
    useState("");

  const [memberError, setMemberError] =
    useState("");

  const [memberSubmitting, setMemberSubmitting] =
    useState(false);

  /* -----------------------------
     Load project + tasks
  ----------------------------- */

  const loadAll = async () => {
    setLoading(true);

    try {
      const [
        projectResponse,
        tasksResponse,
      ] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`),
      ]);

      setProject(projectResponse.data);
      setTasks(tasksResponse.data);

      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load this project."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  /* -----------------------------
     Statistics
  ----------------------------- */

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) =>
      task.isCompleted ||
      task.status === "done"
  ).length;

  const progress = totalTasks
    ? Math.round(
        (completedTasks / totalTasks) * 100
      )
    : 0;

  /* -----------------------------
     Create task
  ----------------------------- */

  const handleCreateTask = async (event) => {
    event.preventDefault();

    setTaskError("");
    setTaskSubmitting(true);

    try {
      await api.post(
        `/projects/${id}/tasks`,
        {
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
        }
      );

      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("medium");

      setShowNewTask(false);

      await loadAll();
    } catch (err) {
      setTaskError(
        err.response?.data?.message ||
          "Could not create task."
      );
    } finally {
      setTaskSubmitting(false);
    }
  };

  /* -----------------------------
     Change task status
  ----------------------------- */

  const handleChangeStatus = async (
    taskId,
    status
  ) => {
    const isCompleted =
      status === "done";

    /* Optimistic update */

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              status,
              isCompleted,
            }
          : task
      )
    );

    try {
      await api.put(
        `/tasks/${taskId}`,
        {
          status,
          isCompleted,
        }
      );
    } catch (err) {
      await loadAll();
    }
  };

  /* -----------------------------
     Toggle task completion
  ----------------------------- */

  const handleToggleComplete = async (
    taskId
  ) => {
    const task = tasks.find(
      (item) => item._id === taskId
    );

    if (!task) return;

    const currentlyDone =
      task.isCompleted ||
      task.status === "done";

    /* Optimistic UI */

    setTasks((previousTasks) =>
      previousTasks.map((item) =>
        item._id === taskId
          ? {
              ...item,

              isCompleted:
                !currentlyDone,

              status:
                !currentlyDone
                  ? "done"
                  : "todo",
            }
          : item
      )
    );

    try {
      const response =
        await api.patch(
          `/tasks/${taskId}/toggle`
        );

      setTasks((previousTasks) =>
        previousTasks.map((item) =>
          item._id === taskId
            ? response.data
            : item
        )
      );
    } catch (err) {
      await loadAll();
    }
  };

  /* -----------------------------
     Assign task
  ----------------------------- */

  const handleAssign = async (
    taskId,
    assigneeId
  ) => {
    try {
      const response =
        await api.put(
          `/tasks/${taskId}`,
          {
            assignee:
              assigneeId || null,
          }
        );

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === taskId
            ? response.data
            : task
        )
      );
    } catch (err) {
      await loadAll();
    }
  };

  /* -----------------------------
     Delete task
  ----------------------------- */

  const handleDeleteTask = async (
    taskId
  ) => {
    const confirmed =
      window.confirm(
        "Delete this task?"
      );

    if (!confirmed) return;

    setTasks((previousTasks) =>
      previousTasks.filter(
        (task) =>
          task._id !== taskId
      )
    );

    try {
      await api.delete(
        `/tasks/${taskId}`
      );
    } catch (err) {
      await loadAll();
    }
  };

  /* -----------------------------
     Add member
  ----------------------------- */

  const handleAddMember = async (
    event
  ) => {
    event.preventDefault();

    setMemberError("");
    setMemberSubmitting(true);

    try {
      const response =
        await api.post(
          `/projects/${id}/members`,
          {
            email: memberEmail,
          }
        );

      setProject(response.data);
      setMemberEmail("");
    } catch (err) {
      setMemberError(
        err.response?.data?.message ||
          "Could not add member."
      );
    } finally {
      setMemberSubmitting(false);
    }
  };

  /* -----------------------------
     Remove member
  ----------------------------- */

  const handleRemoveMember = async (
    userId
  ) => {
    const confirmed =
      window.confirm(
        "Remove this member?"
      );

    if (!confirmed) return;

    try {
      const response =
        await api.delete(
          `/projects/${id}/members/${userId}`
        );

      setProject(response.data);
    } catch (err) {
      await loadAll();
    }
  };

  /* -----------------------------
     Loading
  ----------------------------- */

  if (loading) {
    return (
      <div
        className="
          min-h-[50vh]
          grid
          place-items-center
        "
      >
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="spinner" />
          Loading project...
        </div>
      </div>
    );
  }

  /* -----------------------------
     Error
  ----------------------------- */

  if (error) {
    return (
      <div
        className="
          glass
          rounded-2xl
          p-5
          border
          border-rose-400/20
          text-rose-300
        "
      >
        {error}
      </div>
    );
  }

  if (!project) return null;

  /* -----------------------------
     Owner check
  ----------------------------- */

  const ownerId =
    project.owner?._id ||
    project.owner;

  const currentUserId =
    user?.id ||
    user?._id;

  const isOwner =
    String(ownerId) ===
    String(currentUserId);

  /* -----------------------------
     Kanban columns
  ----------------------------- */

  const columns = [
    {
      key: "todo",
      title: "To do",
    },
    {
      key: "in-progress",
      title: "In progress",
    },
    {
      key: "done",
      title: "Done",
    },
  ];

  return (
    <div className="animate-in">

      {/* BACK */}

      <Link
        to="/"
        className="
          inline-flex
          items-center
          gap-2

          text-xs
          text-slate-500

          hover:text-indigo-300

          transition-colors

          mb-5
        "
      >
        ← Back to projects
      </Link>

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          lg:flex-row

          lg:items-end
          justify-between

          gap-5

          mb-7
        "
      >

        <div>

          <div
            className="
              flex
              items-center
              gap-2
              mb-2
            "
          >

            <span
              className="
                h-2
                w-2

                rounded-full

                bg-indigo-400

                shadow-[0_0_12px_rgba(129,140,248,.8)]
              "
            />

            <span
              className="
                text-[10px]
                uppercase
                tracking-[.2em]
                text-indigo-300/70
              "
            >
              Project workspace
            </span>

          </div>

          <h1
            className="
              text-3xl
              sm:text-4xl

              font-bold

              tracking-tight
            "
          >
            {project.name}
          </h1>

          {project.description && (
            <p
              className="
                text-sm
                text-slate-400

                mt-2

                max-w-2xl
              "
            >
              {project.description}
            </p>
          )}

        </div>

        {/* ACTIONS */}

        <div className="flex gap-2">

          <button
            onClick={() =>
              setShowMembers(true)
            }
            className="
              rounded-xl

              border
              border-white/[.09]

              bg-white/[.03]

              hover:bg-white/[.06]

              px-4
              py-2.5

              text-sm
              font-medium

              transition-colors
            "
          >
            Team{" "}
            <span className="text-slate-500">
              ({project.members?.length || 0})
            </span>
          </button>

          <button
            onClick={() =>
              setShowNewTask(true)
            }
            className="
              rounded-xl

              bg-indigo-500
              hover:bg-indigo-400

              px-4
              py-2.5

              text-sm
              font-semibold

              shadow-lg
              shadow-indigo-500/20

              transition-all

              hover:-translate-y-0.5
            "
          >
            + New task
          </button>

        </div>

      </div>

      {/* PROGRESS */}

      <div
        className="
          glass

          rounded-2xl

          p-5

          mb-7

          glow
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row

            sm:items-center

            justify-between

            gap-2

            mb-3
          "
        >

          <div>

            <p className="text-sm font-semibold">
              Project progress
            </p>

            <p
              className="
                text-xs
                text-slate-500
                mt-1
              "
            >
              {completedTasks} of{" "}
              {totalTasks} tasks completed
            </p>

          </div>

          <span
            className="
              text-2xl
              font-bold
              text-indigo-300
            "
          >
            {progress}%
          </span>

        </div>

        <div
          className="
            h-2.5
            rounded-full
            bg-slate-800
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
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* KANBAN */}

      <div
        className="
          flex
          gap-4
          overflow-x-auto
          pb-5
        "
      >

        {columns.map((column) => (

          <TaskColumn
            key={column.key}
            title={column.title}
            tasks={tasks.filter(
              (task) =>
                task.status ===
                column.key
            )}
            members={
              project.members || []
            }
            onChangeStatus={
              handleChangeStatus
            }
            onToggleComplete={
              handleToggleComplete
            }
            onAssign={handleAssign}
            onDelete={
              handleDeleteTask
            }
          />

        ))}

      </div>

      {/* CREATE TASK */}

      {showNewTask && (
        <Modal
          title="Create a task"
          onClose={() =>
            setShowNewTask(false)
          }
        >

          {taskError && (
            <div
              className="
                mb-4

                rounded-xl

                bg-rose-500/10

                border
                border-rose-400/10

                text-rose-300

                px-4
                py-3

                text-sm
              "
            >
              {taskError}
            </div>
          )}

          <form
            onSubmit={handleCreateTask}
            className="space-y-4"
          >

            <FormField label="Task title">

              <input
                required
                value={taskTitle}
                onChange={(event) =>
                  setTaskTitle(
                    event.target.value
                  )
                }
                className="field"
                placeholder="Design the landing page"
              />

            </FormField>

            <FormField label="Description">

              <textarea
                rows={4}
                value={taskDescription}
                onChange={(event) =>
                  setTaskDescription(
                    event.target.value
                  )
                }
                className="
                  field
                  resize-none
                "
                placeholder="
                  Add context for the team...
                "
              />

            </FormField>

            <FormField label="Priority">

              <select
                value={taskPriority}
                onChange={(event) =>
                  setTaskPriority(
                    event.target.value
                  )
                }
                className="field"
              >

                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>

              </select>

            </FormField>

            <button
              disabled={taskSubmitting}
              className="
                w-full

                rounded-xl

                bg-indigo-500
                hover:bg-indigo-400

                py-3

                text-sm
                font-semibold

                transition-colors

                disabled:opacity-50
              "
            >
              {taskSubmitting
                ? "Creating..."
                : "Create task"}
            </button>

          </form>

        </Modal>
      )}

      {/* MEMBERS */}

      {showMembers && (
        <Modal
          title="Team members"
          onClose={() =>
            setShowMembers(false)
          }
        >

          <div className="space-y-2 mb-5">

            {(project.members || []).map(
              (member) => {

                const memberId =
                  member._id;

                const isMemberOwner =
                  String(memberId) ===
                  String(ownerId);

                return (
                  <div
                    key={memberId}
                    className="
                      flex
                      items-center
                      justify-between

                      gap-3

                      rounded-xl

                      bg-white/[.03]

                      border
                      border-white/[.05]

                      p-3
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-3

                        min-w-0
                      "
                    >

                      <div
                        className="
                          h-9
                          w-9

                          rounded-xl

                          bg-indigo-500/10

                          text-indigo-300

                          grid
                          place-items-center

                          text-xs
                          font-semibold
                        "
                      >
                        {member.name
                          ?.slice(0, 1)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <p
                          className="
                            text-sm
                            font-medium
                            truncate
                          "
                        >
                          {member.name}

                          {isMemberOwner && (
                            <span
                              className="
                                text-[9px]
                                uppercase
                                tracking-wider
                                text-indigo-300
                                ml-1
                              "
                            >
                              Owner
                            </span>
                          )}

                        </p>

                        <p
                          className="
                            text-xs
                            text-slate-500
                            truncate
                          "
                        >
                          {member.email}
                        </p>

                      </div>

                    </div>

                    {isOwner &&
                      !isMemberOwner && (
                        <button
                          onClick={() =>
                            handleRemoveMember(
                              memberId
                            )
                          }
                          className="
                            text-xs
                            text-slate-500

                            hover:text-rose-300

                            transition-colors
                          "
                        >
                          Remove
                        </button>
                      )}

                  </div>
                );
              }
            )}

          </div>

          {/* ADD MEMBER */}

          {isOwner && (
            <>
              {memberError && (
                <div
                  className="
                    mb-3

                    rounded-xl

                    bg-rose-500/10

                    border
                    border-rose-400/10

                    text-rose-300

                    px-4
                    py-3

                    text-sm
                  "
                >
                  {memberError}
                </div>
              )}

              <form
                onSubmit={
                  handleAddMember
                }
                className="
                  flex
                  gap-2
                "
              >

                <input
                  type="email"
                  required
                  value={memberEmail}
                  onChange={(event) =>
                    setMemberEmail(
                      event.target.value
                    )
                  }
                  placeholder="
                    teammate@company.com
                  "
                  className="
                    field
                    flex-1
                  "
                />

                <button
                  disabled={
                    memberSubmitting
                  }
                  className="
                    rounded-xl

                    bg-indigo-500
                    hover:bg-indigo-400

                    px-4

                    text-sm
                    font-semibold

                    disabled:opacity-50
                  "
                >
                  {memberSubmitting
                    ? "..."
                    : "Add"}
                </button>

              </form>

              <p
                className="
                  text-xs
                  text-slate-600
                  mt-2
                "
              >
                The teammate must already
                have a Waypoint account.
              </p>
            </>
          )}

        </Modal>
      )}

    </div>
  );
}


/* -----------------------------
   Form field component
----------------------------- */

function FormField({
  label,
  children,
}) {
  return (
    <label className="block">

      <span
        className="
          block

          text-xs
          font-medium
          text-slate-400

          mb-2
        "
      >
        {label}
      </span>

      {children}

    </label>
  );
}