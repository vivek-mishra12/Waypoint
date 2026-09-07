# Waypoint — Team Productivity Platform

Plan. Collaborate. Deliver.

A full-stack project management app: create projects, invite teammates, manage tasks on a
kanban board, and track progress per project.

**Stack:** React (Vite) + Node/Express + MongoDB, JWT authentication.

```
Frontend (React/Vite) → Backend (Express API) → MongoDB
                              ↑
                        JWT auth middleware
```

## Project structure

```
nova-app/
├── backend/     Express API, MongoDB models, JWT auth
└── frontend/    React app (Vite + Tailwind)
```

## Prerequisites

- Node.js 18+
- A MongoDB instance — either:
  - local: `mongod` running on `mongodb://127.0.0.1:27017`, or
  - free cloud instance: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nova        # or your Atlas connection string
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Run it:
```bash
npm run dev      # nodemon, auto-restarts on change
# or
npm start
```

The API runs on `http://localhost:5000`. Check `GET /api/health` to confirm it's up.

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open `http://localhost:5173`.

## Using the app

1. **Register** an account (name, email, password).
2. **Create a project** from the dashboard — you become the owner and first member.
3. Open the project and **add tasks**: title, description, priority.
4. **Assign tasks** to members and move them between To do / In progress / Done — the
   dashboard progress bar updates automatically (done tasks ÷ total tasks).
5. **Add teammates** via the "Team" button using their registered email — they must have
   an account already (register them first, or have them self-register, then add by email).

## API overview

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account, returns JWT |
| POST | `/api/auth/login` | Log in, returns JWT |
| GET | `/api/auth/me` | Current user (auth required) |
| GET | `/api/projects` | Projects you own or belong to |
| POST | `/api/projects` | Create a project |
| GET/PUT/DELETE | `/api/projects/:id` | Read / update / delete a project |
| POST | `/api/projects/:id/members` | Add a member by email (owner only) |
| DELETE | `/api/projects/:id/members/:userId` | Remove a member (owner only) |
| GET/POST | `/api/projects/:projectId/tasks` | List / create tasks in a project |
| PUT/DELETE | `/api/tasks/:id` | Update / delete a task |

All routes except register/login require `Authorization: Bearer <token>`.

## Notes on scope (MVP)

This covers the core flow end to end — auth, projects, tasks, members, progress tracking —
built to be easy to extend. Natural next steps: comments on tasks, activity log, role-based
permissions beyond owner/member, file attachments, and a proper deployment pipeline
(e.g. frontend on Vercel/Netlify, backend on Render/Railway, DB on Atlas).

## Deployment quick notes

- **Backend:** deploy `backend/` to Render, Railway, or Fly.io. Set the same env vars as
  `.env.example`, pointing `MONGO_URI` at your Atlas cluster and `CLIENT_ORIGIN` at your
  deployed frontend URL.
- **Frontend:** deploy `frontend/` to Vercel or Netlify. Set `VITE_API_URL` to your deployed
  backend's `/api` URL, then `npm run build`.
