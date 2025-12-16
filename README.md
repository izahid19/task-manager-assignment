# TaskFlow - Collaborative Task Management Application

A modern, real-time task management application built with the MERN stack (MongoDB, Express, React, Node.js). Features include secure authentication, real-time updates via Socket.io, and a responsive UI with GSAP animations.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Backend Setup (`server`)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` root and add the following:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/taskmanager
    JWT_SECRET=your_super_secret_jwt_key
    CORS_ORIGIN=http://localhost:5173
    NODE_ENV=development
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup (`frontend`)

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` root (optional if defaults work):
    ```env
    VITE_API_URL=http://localhost:3000/api
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Contract

Base URL: `/api`

### Authentication (`/auth`)
| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register new user | `{ name, email, password }` |
| `POST` | `/login` | Login user | `{ email, password }` |
| `POST` | `/verify-otp` | Verify email OTP | `{ email, otp }` |
| `POST` | `/resend-otp` | Resend verification OTP | `{ email }` |
| `POST` | `/forgot-password` | Request password reset | `{ email }` |
| `POST` | `/reset-password` | Reset password | `{ email, otp, newPassword }` |
| `POST` | `/logout` | Logout user | - |

### Tasks (`/tasks`)
| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all tasks (with filters) | Query: `page`, `limit`, `status`, `priority` |
| `POST` | `/` | Create new task | `{ title, description, priority, dueDate }` |
| `GET` | `/:id` | Get task by ID | - |
| `PATCH` | `/:id` | Update task | `{ title, status, ... }` |
| `DELETE` | `/:id` | Delete task | - |
| `GET` | `/dashboard/assigned` | Get assigned tasks | - |
| `GET` | `/dashboard/created` | Get created tasks | - |
| `GET` | `/dashboard/overdue` | Get overdue tasks | - |

---

## 🏗️ Architecture Overview

The application follows a **Layered Architecture** to separate concerns and ensure maintainability.

### Backend Structure (`server/src`)
1.  **Routes** (`/routes`): Defines API endpoints and maps them to controllers.
2.  **Controllers** (`/controllers`): Handles HTTP requests, validation, and sending responses.
3.  **Services** (`/services`): Contains the core business logic.
4.  **Repositories** (`/repositories`): Handles direct database interactions (Data Access Layer).
5.  **Models** (`/models`): Mongoose schemas defining the data structure.
6.  **DTOs** (`/dtos`): Data Transfer Objects for type-safe validation using Zod.

### Frontend Structure (`frontend/src`)
1.  **Pages** (`/pages`): Top-level route components (Dashboard, Login, etc.).
2.  **Components** (`/components`): Reusable UI building blocks.
3.  **Hooks** (`/hooks`): Custom hooks for logic reuse (`useAuth`, `useTasks`, `useSocket`).
4.  **Contexts** (`/contexts`): Global state management (AuthContext).
5.  **API** (`/lib/api`): Axios instance configuration and interceptors.

---

## 🔌 Socket.io Integration (Real-time)

Real-time functionality is implemented using `socket.io` to provide instant updates for task changes and notifications.

### Backend Implementation
- **Initialization**: Socket server is attached to the HTTP server in `socket/index.ts`.
- **Authentication**: Using `socket.on('authenticate')`, the server verifies the JWT token and joins the socket to a private user room (`user:{userId}`).
- **Broadcasting**:
    - **Global Events**: `emitTaskEvent` broadcasts `task:created`, `task:updated`, `task:deleted` events to all connected clients (simplified for this demo).
    - **Private Notifications**: `notifyUser` sends events only to the specific user's room.

### Frontend Integration
- **Connection**: Managed via `useSocket` hook.
- **Event Listening**: Components subscribe to events to invalidate React Query caches, triggering instant UI updates without manual refreshes.

---

## 💡 Design Decisions & Trade-offs

1.  **Database: MongoDB (NoSQL)**
    -   *Decision*: Chosen for its flexibility with JSON-like documents, which fits task data structures well.
    -   *Trade-off*: requires careful schema design to avoid deep nesting issues, though Mongoose helps enforce structure.

2.  **Authentication: JWT (JSON Web Tokens)**
    -   *Decision*: Stateless authentication allows easiest scalability.
    -   *Trade-off*: Revoking tokens instantly is harder without a blocklist (managed here via short expiration and database checks).

3.  **Validation: Zod**
    -   *Decision*: Used on both frontend and backend for type-safe schema validation. Ensures consistency across the stack.

4.  **State Management: React Query (TanStack Query)**
    -   *Decision*: Handles server state (caching, loading, error states) much better than Redux for this use case.
    -   *Trade-off*: Adds a small learning curve for those used to Redux, but significantly reduces boilerplate code.

5.  **Broadcasting Strategy (socket.io)**
    -   *Decision*: Currently broadcasts task updates to *all* connected clients for simplicity.
    -   *Trade-off*: in a massive production app with thousands of concurrent users, this would be optimized to only broadcast to users *in* a specific team or project room to reduce bandwidth.

6.  **UI/UX: GSAP Animations**
    -   *Decision*: Used for high-performance, complex entrance animations that CSS transitions can't handle smoothly (staggering, physics-based casing).
    -   *Trade-off*: Adds a small bundle size overhead, but significantly improves perceived production quality.
