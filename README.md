# MERN Task Management Application

![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

A production-ready **MERN Task Management Application** built for organizing personal tasks, tracking progress, and visualizing productivity insights. The project includes secure authentication, task filtering, analytics, activity tracking, responsive UI, API validation, rate limiting, and deployment-ready configuration.

This repository is designed as a polished junior full-stack developer portfolio project, demonstrating practical frontend engineering, REST API development, MongoDB data modeling, authentication, testing, and deployment workflows.

---

## 📌 Project Overview

The Task Management Application helps users create, update, prioritize, complete, and delete tasks from a clean dashboard interface. Each user has a private workspace protected by JWT authentication.

The backend exposes a RESTful API built with Express and MongoDB, while the frontend uses React, Vite, Tailwind CSS, React Router, Recharts, and Axios for a fast and modern user experience.

### Key Highlights

| Area | Description |
| --- | --- |
| Authentication | Register, login, protected user profile, password updates |
| Task Management | Create, edit, delete, search, sort, filter, and complete tasks |
| Analytics | Completion stats, weekly activity, status distribution, recent activity |
| Security | JWT auth, password hashing, Helmet, CORS, rate limiting, input sanitization |
| UX | Responsive dashboard, loading skeletons, error boundaries, toast feedback |
| Deployment | Render backend config and Vercel-ready frontend setup |

---

## ✨ Features

- 🔐 User registration and login with JWT authentication
- 👤 Protected profile page with account statistics
- 🔑 Secure password update flow
- ✅ Create, read, update, and delete personal tasks
- 🏷️ Task priority levels: `low`, `medium`, `high`
- 📅 Optional task deadlines
- 🔎 Search tasks by title, description, status, or priority
- 🎯 Filter tasks by status and priority
- ↕️ Sort tasks by latest, oldest, priority, pending, or completed
- 📊 Analytics dashboard using Recharts
- 📝 Recent activity timeline for task actions
- 🌗 Theme toggle support
- 🧪 API and component test setup
- 🛡️ Backend validation with Zod
- 🚦 Express rate limiting for API and auth routes
- 📱 Responsive UI built with Tailwind CSS
- 🚀 Deployment-ready project structure

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React 19 | UI library |
| Vite | Frontend build tool |
| Tailwind CSS | Utility-first styling |
| React Router | Client-side routing |
| Axios | API requests |
| React Hook Form | Form handling |
| Zod | Schema validation |
| Recharts | Dashboard charts |
| Lucide React | Icons |
| Vitest | Frontend testing |

### Backend

| Technology | Purpose |
| --- | --- |
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| Zod | Request validation |
| Helmet | Security headers |
| CORS | Cross-origin access |
| Morgan | HTTP request logging |
| Supertest | API testing |

---

## 📁 Folder Structure

```bash
Task_Management System/
├── client/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth and theme context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Axios API client
│   │   ├── pages/             # Route-level pages
│   │   ├── App.jsx            # Main app routes
│   │   ├── index.css          # Global Tailwind styles
│   │   └── main.jsx           # React entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/            # Database connection
│   │   ├── controllers/       # Route controller logic
│   │   ├── middleware/        # Auth, validation, errors, sanitization
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Helpers and response utilities
│   │   ├── validators/        # Zod validation schemas
│   │   ├── app.js             # Express app configuration
│   │   └── server.js          # Server entry point
│   ├── tests/                 # Backend API tests
│   └── package.json
│
├── package.json               # Root scripts for full-stack development
├── render.yaml                # Render backend deployment config
└── README.md
```

---

## ⚙️ Installation Guide

### Prerequisites

Make sure you have the following installed:

- Node.js 18+
- npm
- MongoDB Atlas account or local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-management-system.git
cd "Task_Management System"
```

### 2. Install Dependencies

Install root, backend, and frontend dependencies with one command:

```bash
npm run install:all
```

Or install them manually:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` folder and a `.env` file inside the `client` folder. Use the examples below.

### 4. Start the Development Servers

From the project root:

```bash
npm run dev
```

The app will run at:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:5000/api` |

---

## 🔐 Environment Variables

### Server `.env`

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/task-manager
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | Yes | Application environment |
| `PORT` | Yes | Backend server port |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key used to sign JWTs |
| `JWT_EXPIRES_IN` | Yes | JWT expiration time |
| `CLIENT_URL` | Yes | Allowed frontend origin for CORS |

### Client `.env`

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Backend API base URL used by Axios |

---

## 📡 API Endpoints

Base URL:

```bash
http://localhost:5000/api
```

Protected routes require an authorization header:

```http
Authorization: Bearer <token>
```

### Health

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | Check API health status |

### Auth

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login and receive JWT token |
| `GET` | `/auth/me` | Private | Get current user and task stats |
| `PATCH` | `/auth/profile` | Private | Update user profile |
| `PATCH` | `/auth/password` | Private | Update account password |

### Tasks

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/tasks` | Private | Get paginated tasks with filters |
| `POST` | `/tasks` | Private | Create a new task |
| `PATCH` | `/tasks/:id` | Private | Update a task |
| `DELETE` | `/tasks/:id` | Private | Delete a task |

#### Task Query Parameters

| Parameter | Example | Description |
| --- | --- | --- |
| `search` | `meeting` | Search task text fields |
| `status` | `pending` | Filter by `pending`, `completed`, or `all` |
| `priority` | `high` | Filter by `low`, `medium`, `high`, or `all` |
| `sort` | `priority` | Sort by `latest`, `oldest`, `priority`, `pending`, or `completed` |
| `page` | `1` | Page number |
| `limit` | `10` | Tasks per page |

### Analytics

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/analytics` | Private | Get task stats, weekly activity, and recent activity |

---

## 🧪 Testing

Run backend API tests:

```bash
cd server
npm test
```

Run frontend tests:

```bash
cd client
npm test
```

Run frontend linting:

```bash
cd client
npm run lint
```

---

## 🖼️ Screenshots

Add your deployed application screenshots inside a `screenshots` folder and update the image paths below.

| Page | Preview |
| --- | --- |
| Login / Register | `screenshots/auth.png` |
| Dashboard | `screenshots/dashboard.png` |
| Task Modal | `screenshots/task-modal.png` |
| Analytics | `screenshots/analytics.png` |
| Profile | `screenshots/profile.png` |

Example:

```md
![Dashboard Screenshot](screenshots/dashboard.png)
```

---

## 🚀 Deployment Guide

### Backend Deployment on Render

This project includes a `render.yaml` file for backend deployment.

1. Push the repository to GitHub.
2. Create a new Render Web Service.
3. Select the `server` directory as the backend root.
4. Use the following commands:

| Setting | Value |
| --- | --- |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

5. Add the following environment variables in Render:

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Frontend Deployment on Vercel

1. Import the repository into Vercel.
2. Set the root directory to `client`.
3. Add the production API URL:

```env
VITE_API_URL=https://your-render-api.onrender.com/api
```

4. Deploy the frontend.
5. Update the Render `CLIENT_URL` environment variable with your Vercel domain.

### Production Build

Build the frontend locally:

```bash
npm run build
```

Preview the frontend build:

```bash
cd client
npm run preview
```

---

## 🗺️ Future Improvements

- 📌 Drag-and-drop Kanban board view
- 👥 Team workspaces and task assignment
- 🔔 Email reminders for upcoming deadlines
- 📎 File attachments for tasks
- 🧾 Export tasks as CSV or PDF
- 📆 Calendar view for deadline planning
- 🔍 Advanced analytics and productivity trends
- 🧑‍💼 Admin dashboard for user management
- 🌐 OAuth login with Google or GitHub
- 📱 Progressive Web App support

---

## 👨‍💻 Author

**Akhil**

Junior Full-Stack Developer focused on building practical, user-friendly web applications with the MERN stack.

| Platform | Link |
| --- | --- |
| GitHub | `https://github.com/your-username` |
| LinkedIn | `https://linkedin.com/in/your-profile` |
| Portfolio | `https://your-portfolio.com` |

---

## 📄 License

This project is available for learning, portfolio use, and further customization.

---

## Live Demo

Frontend:
`https://task-management-cwz8db1ie-akhileshsharma22s-projects.vercel.app`

Backend:
`https://task-management-app-2-anoq.onrender.com`

⭐ If you found this project helpful, consider starring the repository and using it as inspiration for your own MERN portfolio project.
