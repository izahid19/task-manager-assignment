# TaskFlow Frontend

React + TypeScript frontend for the TaskFlow application, built with Vite and Tailwind CSS.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` root:
    ```env
    VITE_API_URL=http://localhost:3000/api
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 🏗️ Project Structure (`src`)

1.  **Pages** (`/pages`): Dashboard, Login, TasksPage, etc.
2.  **Components** (`/components`): Reusable UI (Button, Input, TaskCard).
3.  **Hooks** (`/hooks`): Custom logic (`useAuth`, `useTasks`).
4.  **Contexts** (`/contexts`): Global providers (`AuthContext`).
5.  **API** (`/lib/api`): Axios setup with interceptors.

---

## ⚡ Tech Stack & Features

- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Query (Server state) + Context API (Auth state)
- **Forms**: React Hook Form + Zod
- **Animations**: GSAP (Entrance animations) + CSS Transitions

---

## 🔌 Socket.io Integration

Frontend socket logic resides in `src/hooks/useSocket.ts`.

- Connects to backend socket server.
- Listens for `task:created`, `task:update`, `notification:assigned`.
- Automatically invalidates React Query cache to refresh data.

---

## 💡 Key Decisions

1.  **React Query**: Replaces Redux for server state sync.
2.  **GSAP**: Used for complex staggered entrance animations.
3.  **Component Composition**: Highly modular UI using Radix primitives (via shadcn/ui).
