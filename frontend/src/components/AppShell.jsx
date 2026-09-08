import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const Icon = ({ name, size = 19 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),

    folder: (
      <>
        <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
      </>
    ),

    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      </>
    ),

    menu: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>
    ),

    close: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
      </>
    ),

    spark: (
      <>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
        <path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
};

export default function AppShell({ children }) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const navigation = [
    {
      to: "/",
      label: "Overview",
      icon: "grid",
    },
  ];

  return (
    <div className="min-h-screen app-bg text-slate-100">

      {/* Background */}

      <div className="fixed inset-0 grid-bg pointer-events-none opacity-60" />

      {/* Mobile overlay */}

      {open && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed
          z-50
          inset-y-0
          left-0
          w-[270px]

          border-r
          border-white/[.07]

          bg-[#090d17]/95
          backdrop-blur-2xl

          flex
          flex-col

          transition-transform
          duration-300

          lg:translate-x-0

          ${open
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >

        {/* Logo */}

        <div className="h-20 px-6 flex items-center justify-between border-b border-white/[.06]">

          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >

            <span
              className="
                h-10
                w-10
                rounded-2xl
                bg-gradient-to-br
                from-indigo-500
                to-violet-600

                grid
                place-items-center

                shadow-lg
                shadow-indigo-500/20
              "
            >
              <Icon name="spark" size={20} />
            </span>

            <span>
              <span className="block font-bold tracking-tight text-lg">
                Waypoint
              </span>

              <span className="block text-[10px] uppercase tracking-[.22em] text-slate-500">
                Team workspace
              </span>
            </span>

          </Link>

          <button
            className="lg:hidden text-slate-400"
            onClick={() => setOpen(false)}
          >
            <Icon name="close" />
          </button>

        </div>

        {/* Navigation */}

        <nav className="p-4 space-y-1">

          <div
            className="
              px-3
              pt-3
              pb-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[.2em]
              text-slate-600
            "
          >
            Workspace
          </div>

          {navigation.map((item) => {

            const active =
              location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`
                  flex
                  items-center
                  gap-3

                  px-3
                  py-3

                  rounded-xl

                  text-sm

                  transition-all

                  ${
                    active
                      ? `
                        bg-indigo-500/12
                        text-indigo-300
                        border
                        border-indigo-400/15
                      `
                      : `
                        text-slate-400
                        hover:text-white
                        hover:bg-white/[.04]
                      `
                  }
                `}
              >

                <Icon name={item.icon} />

                {item.label}

              </Link>
            );
          })}

        </nav>

        {/* User section */}

        <div className="mt-auto p-4">

          <div className="glass rounded-2xl p-3 mb-3">

            <div className="flex items-center gap-3">

              <div
                className="
                  h-10
                  w-10
                  rounded-xl

                  bg-gradient-to-br
                  from-cyan-400/30
                  to-indigo-500/30

                  border
                  border-white/10

                  grid
                  place-items-center

                  font-semibold
                  text-sm
                  text-cyan-200
                "
              >
                {initials}
              </div>

              <div className="min-w-0">

                <p className="text-sm font-medium truncate">
                  {user?.name || "User"}
                </p>

                <p className="text-xs text-slate-500 truncate">
                  {user?.email}
                </p>

              </div>

            </div>

          </div>

          <button
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-3

              px-3
              py-3

              rounded-xl

              text-sm
              text-slate-400

              hover:text-rose-300
              hover:bg-rose-500/10

              transition-colors
            "
          >
            <Icon name="logout" />
            Sign out
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <div className="lg:pl-[270px] relative">

        {/* TOP BAR */}

        <header
          className="
            sticky
            top-0
            z-30

            h-20

            border-b
            border-white/[.06]

            bg-[#080b14]/75
            backdrop-blur-xl
          "
        >

          <div
            className="
              h-full
              px-5
              sm:px-8

              flex
              items-center
              justify-between
            "
          >

            <button
              className="lg:hidden text-slate-300"
              onClick={() => setOpen(true)}
            >
              <Icon name="menu" />
            </button>

            <div className="hidden lg:block text-xs text-slate-500">

              Workspace /

              <span className="text-slate-300">
                {" "}Waypoint
              </span>

            </div>

            <div className="flex items-center gap-3">

              <span
                className="
                  hidden
                  sm:inline-flex
                  items-center
                  gap-2

                  px-3
                  py-1.5

                  rounded-full

                  bg-emerald-500/10
                  border
                  border-emerald-400/10

                  text-xs
                  text-emerald-300
                "
              >

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-400
                    animate-pulse
                  "
                />

                All systems ready

              </span>

              <div
                className="
                  h-9
                  w-9
                  rounded-xl
                  bg-slate-800
                  border
                  border-white/10
                  grid
                  place-items-center
                  text-xs
                  font-semibold
                "
              >
                {initials}
              </div>

            </div>

          </div>

        </header>

        {/* PAGE */}

        <main
          className="
            relative
            min-h-[calc(100vh-80px)]

            px-5
            sm:px-8

            py-7
            lg:py-10

            max-w-[1500px]
            mx-auto
          "
        >
          {children}
        </main>

      </div>

    </div>
  );
}