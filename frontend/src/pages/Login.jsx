import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {

  const {
    login,
  } = useAuth();

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setSubmitting(true);

      try {

        await login(
          email,
          password
        );

        navigate("/");

      } catch (err) {

        setError(
          err.response?.data?.message ||
            "Could not sign in. Check your details and try again."
        );

      } finally {

        setSubmitting(false);

      }
    };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      subtitle="
        Pick up where your team left off.
      "
    >

      {/* ERROR */}

      {error && (
        <div
          className="
            mb-5

            rounded-xl

            border
            border-rose-400/10

            bg-rose-500/10

            text-rose-300

            px-4
            py-3

            text-sm
          "
        >
          {error}
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <FormField label="Email">

          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            className="field"
            placeholder="you@company.com"
          />

        </FormField>

        <FormField label="Password">

          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            className="field"
            placeholder="••••••••"
          />

        </FormField>

        <button
          disabled={submitting}
          className="
            w-full

            rounded-xl

            bg-indigo-500

            hover:bg-indigo-400

            py-3

            text-sm
            font-semibold

            shadow-lg
            shadow-indigo-500/20

            transition-all

            hover:-translate-y-0.5

            disabled:opacity-50
            disabled:hover:translate-y-0
          "
        >
          {submitting
            ? "Signing in..."
            : "Sign in"}
        </button>

      </form>

      {/* REGISTER */}

      <p
        className="
          text-sm
          text-slate-500

          mt-6

          text-center
        "
      >
        New to Waypoint?{" "}

        <Link
          to="/register"
          className="
            text-indigo-300
            hover:text-white

            transition-colors
          "
        >
          Create an account
        </Link>

      </p>

    </AuthLayout>
  );
}


/* --------------------------------
   Form field
-------------------------------- */

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


/* --------------------------------
   Authentication layout
-------------------------------- */

function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
}) {

  return (
    <div
      className="
        min-h-screen

        app-bg

        grid-bg

        grid

        lg:grid-cols-2
      "
    >

      {/* LEFT PANEL */}

      <div
        className="
          hidden
          lg:flex

          relative

          overflow-hidden

          items-center
          justify-center

          p-16

          border-r
          border-white/[.06]
        "
      >

        {/* ORB 1 */}

        <div
          className="
            absolute

            h-80
            w-80

            rounded-full

            bg-indigo-500/15

            blur-3xl

            -top-20
            -left-20

            auth-orb
          "
        />

        {/* ORB 2 */}

        <div
          className="
            absolute

            h-72
            w-72

            rounded-full

            bg-cyan-400/10

            blur-3xl

            bottom-0
            right-0

            auth-orb
          "
        />

        <div
          className="
            relative

            max-w-lg
          "
        >

          {/* LOGO */}

          <div
            className="
              flex
              items-center
              gap-3

              mb-12
            "
          >

            <span
              className="
                h-11
                w-11

                rounded-2xl

                bg-gradient-to-br
                from-indigo-500
                to-violet-600

                grid
                place-items-center

                text-xl
              "
            >
              ✦
            </span>

            <span className="font-bold text-xl">
              Waypoint
            </span>

          </div>

          <p
            className="
              text-xs

              uppercase

              tracking-[.25em]

              text-indigo-300/70

              mb-4
            "
          >
            Plan. Collaborate. Deliver.
          </p>

          <h1
            className="
              text-5xl

              font-bold

              tracking-tight

              leading-[1.08]
            "
          >
            A calmer way to move
            work forward.
          </h1>

          <p
            className="
              text-slate-400

              mt-6

              leading-7
            "
          >
            Organize projects, align
            your team, and turn a
            messy backlog into visible
            progress.
          </p>

          {/* FEATURE CARDS */}

          <div
            className="
              grid
              grid-cols-3

              gap-3

              mt-10
            "
          >

            {[
              [
                "Projects",
                "Focused work",
              ],

              [
                "Kanban",
                "Simple flow",
              ],

              [
                "Progress",
                "Clear goals",
              ],
            ].map(
              ([title, subtitle]) => (

                <div
                  key={title}
                  className="
                    glass

                    rounded-2xl

                    p-4
                  "
                >

                  <div
                    className="
                      h-1.5
                      w-10

                      rounded-full

                      progress-fill

                      mb-4
                    "
                  />

                  <p
                    className="
                      text-sm
                      font-medium
                    "
                  >
                    {title}
                  </p>

                  <p
                    className="
                      text-xs
                      text-slate-600

                      mt-1
                    "
                  >
                    {subtitle}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div
        className="
          flex

          items-center
          justify-center

          p-5
          sm:p-8
        "
      >

        <div
          className="
            w-full
            max-w-md

            animate-in
          "
        >

          {/* MOBILE LOGO */}

          <div
            className="
              lg:hidden

              flex
              items-center
              gap-3

              mb-10
            "
          >

            <span
              className="
                h-10
                w-10

                rounded-xl

                bg-gradient-to-br
                from-indigo-500
                to-violet-600

                grid
                place-items-center
              "
            >
              ✦
            </span>

            <span
              className="
                font-bold
                text-lg
              "
            >
              Waypoint
            </span>

          </div>

          {/* FORM CARD */}

          <div
            className="
              glass

              rounded-3xl

              p-7
              sm:p-9

              glow
            "
          >

            <p
              className="
                text-[10px]

                uppercase

                tracking-[.22em]

                text-indigo-300/70

                mb-2
              "
            >
              {eyebrow}
            </p>

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              {title}
            </h2>

            <p
              className="
                text-sm
                text-slate-500

                mt-2

                mb-7
              "
            >
              {subtitle}
            </p>

            {children}

          </div>

        </div>

      </div>

    </div>
  );
}