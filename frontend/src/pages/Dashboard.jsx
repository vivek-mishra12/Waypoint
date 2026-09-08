import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../api/axios";

import ProjectCard from "../components/ProjectCard.jsx";
import Modal from "../components/Modal.jsx";

import { useAuth } from "../context/AuthContext.jsx";

const PlusIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export default function Dashboard() {

  const { user } = useAuth();

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showCreate, setShowCreate] =
    useState(false);

  const [name, setName] = useState("");

  const [description, setDescription] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  const [createError, setCreateError] =
    useState("");

  /* Load projects */

  const loadProjects = async () => {

    setLoading(true);

    try {

      const response =
        await api.get("/projects");

      setProjects(response.data);

      setError("");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Could not load projects."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    loadProjects();

  }, []);

  /* Statistics */

  const stats = useMemo(() => {

    const active =
      projects.filter(
        (project) =>
          project.status === "active" ||
          !project.status
      ).length;

    const members =
      projects.reduce(
        (total, project) =>
          total +
          (project.members?.length || 0),
        0
      );

    return {
      total: projects.length,
      active,
      members,
    };

  }, [projects]);

  /* Create project */

  const handleCreate = async (event) => {

    event.preventDefault();

    setCreateError("");

    setCreating(true);

    try {

      await api.post(
        "/projects",
        {
          name,
          description,
        }
      );

      setName("");

      setDescription("");

      setShowCreate(false);

      await loadProjects();

    } catch (err) {

      setCreateError(
        err.response?.data?.message ||
        "Could not create project."
      );

    } finally {

      setCreating(false);

    }
  };

  return (
    <div className="animate-in">

      {/* HERO */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-end
          justify-between
          gap-5
          mb-8
        "
      >

        <div>

          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-[.2em]
              text-indigo-300/70
              mb-2
            "
          >
            Good to see you
          </p>

          <h1
            className="
              text-3xl
              sm:text-4xl
              font-bold
              tracking-tight
            "
          >
            Hey,{" "}
            {user?.name?.split(" ")[0] ||
              "there"}{" "}
            👋
          </h1>

          <p
            className="
              text-slate-400
              mt-2
              max-w-xl
            "
          >
            Keep your projects moving,
            stay aligned with your team,
            and deliver the work that
            matters.
          </p>

        </div>

        <button
          onClick={() =>
            setShowCreate(true)
          }
          className="
            inline-flex
            items-center
            justify-center
            gap-2

            rounded-xl

            bg-indigo-500
            hover:bg-indigo-400

            px-4
            py-3

            text-sm
            font-semibold

            shadow-lg
            shadow-indigo-500/20

            transition-all

            hover:-translate-y-0.5
          "
        >

          <PlusIcon />

          New project

        </button>

      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-4
          mb-8
        "
      >

        {[
          [
            "Projects",
            stats.total,
            "Total workspaces",
          ],

          [
            "Active",
            stats.active,
            "Currently moving",
          ],

          [
            "Members",
            stats.members,
            "Across your projects",
          ],
        ].map(
          ([label, value, subtitle], index) => (

            <div
              key={label}
              className="
                glass
                rounded-2xl
                p-5
                shimmer
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    text-xs
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  {label}
                </span>

                <span
                  className={`
                    h-2
                    w-2
                    rounded-full

                    ${
                      index === 1
                        ? "bg-emerald-400"
                        : "bg-indigo-400"
                    }
                  `}
                />

              </div>

              <div
                className="
                  text-3xl
                  font-bold
                  mt-4
                "
              >
                {loading
                  ? "—"
                  : value}
              </div>

              <div
                className="
                  text-xs
                  text-slate-500
                  mt-1
                "
              >
                {subtitle}
              </div>

            </div>

          )
        )}

      </div>

      {/* PROJECT HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-4
        "
      >

        <div>

          <h2 className="text-lg font-semibold">
            Your projects
          </h2>

          <p
            className="
              text-xs
              text-slate-500
              mt-1
            "
          >
            Everything your team is
            planning and building.
          </p>

        </div>

        <span
          className="
            text-xs
            text-slate-500
          "
        >
          {projects.length} total
        </span>

      </div>

      {/* ERROR */}

      {error && (

        <div
          className="
            glass
            border-rose-400/20
            text-rose-300
            rounded-xl
            p-4
            mb-5
            text-sm
          "
        >
          {error}
        </div>

      )}

      {/* LOADING */}

      {loading ? (

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-4
          "
        >

          {[1, 2, 3].map(
            (item) => (

              <div
                key={item}
                className="
                  glass
                  rounded-2xl
                  h-52
                  shimmer
                "
              />

            )
          )}

        </div>

      ) : projects.length === 0 ? (

        /* EMPTY STATE */

        <div
          className="
            glass
            rounded-3xl
            p-12
            text-center
          "
        >

          <div
            className="
              mx-auto
              h-14
              w-14

              rounded-2xl

              bg-indigo-500/10

              border
              border-indigo-400/10

              grid
              place-items-center

              text-indigo-300

              mb-5
            "
          >
            ✦
          </div>

          <h3
            className="
              font-semibold
              text-lg
            "
          >
            Your workspace is empty
          </h3>

          <p
            className="
              text-sm
              text-slate-500
              mt-2
              mb-6
            "
          >
            Create your first project
            and start turning plans into
            progress.
          </p>

          <button
            onClick={() =>
              setShowCreate(true)
            }
            className="
              rounded-xl
              bg-white
              text-slate-950
              px-4
              py-2.5
              text-sm
              font-semibold
              hover:bg-slate-200
              transition-colors
            "
          >
            Create your first project
          </button>

        </div>

      ) : (

        /* PROJECTS */

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-4
          "
        >

          {projects.map(
            (project, index) => (

              <div
                key={project._id}
                style={{
                  animationDelay:
                    `${index * 70}ms`,
                }}
                className="animate-in"
              >

                <ProjectCard
                  project={project}
                />

              </div>

            )
          )}

        </div>

      )}

      {/* CREATE PROJECT MODAL */}

      {showCreate && (

        <Modal
          title="Create a project"
          onClose={() =>
            setShowCreate(false)
          }
        >

          {createError && (

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
              {createError}
            </div>

          )}

          <form
            onSubmit={handleCreate}
            className="space-y-4"
          >

            <Field label="Project name">

              <input
                required
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="field"
                placeholder="Website redesign"
              />

            </Field>

            <Field label="Description">

              <textarea
                rows={4}
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                className="field resize-none"
                placeholder="What is this project about?"
              />

            </Field>

            <button
              disabled={creating}
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
              {creating
                ? "Creating..."
                : "Create project"}
            </button>

          </form>

        </Modal>

      )}

    </div>
  );
}


/* Form field */

function Field({
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