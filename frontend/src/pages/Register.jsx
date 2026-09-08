import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {

  const {
    register,
  } = useAuth();

  const navigate =
    useNavigate();

  const [name, setName] =
    useState("");

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

        await register(
          name,
          email,
          password
        );

        navigate("/");

      } catch (err) {

        setError(
          err.response?.data?.message ||
            "Could not create your account. Try again."
        );

      } finally {

        setSubmitting(false);

      }
    };

  return (
    <div
      className="
        min-h-screen

        app-bg

        grid-bg

        flex

        items-center
        justify-center

        p-5
      "
    >

      <div
        className="
          w-full
          max-w-md

          animate-in
        "
      >

        {/* LOGO */}

        <div
          className="
            flex
            items-center
            gap-3

            mb-6
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

        {/* CARD */}

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
            Get started
          </p>

          <h1
            className="
              text-2xl
              font-bold
            "
          >
            Create your workspace
          </h1>

          <p
            className="
              text-sm
              text-slate-500

              mt-2

              mb-7
            "
          >
            Bring your team and projects
            into one focused place.
          </p>

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

            {/* NAME */}

            <FormField label="Full name">

              <input
                required
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                className="field"
                placeholder="Ada Lovelace"
              />

            </FormField>

            {/* EMAIL */}

            <FormField label="Email">

              <input
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

            {/* PASSWORD */}

            <FormField label="Password">

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                className="field"
                placeholder="At least 6 characters"
              />

            </FormField>

            {/* SUBMIT */}

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
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          {/* LOGIN */}

          <p
            className="
              text-sm
              text-slate-500

              mt-6

              text-center
            "
          >
            Already have an account?{" "}

            <Link
              to="/login"
              className="
                text-indigo-300

                hover:text-white

                transition-colors
              "
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
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