# TaskFlow Backend

Node.js/Express backend for the TaskFlow collaborative task management application.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Redis (Optional, for rate limiting)

### Installation

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` root:
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

---

## 🏗️ Architecture (`server/src`)

The backend follows a **Layered Architecture**:

1.  **Routes** (`/routes`): Defines API endpoints.
2.  **Controllers** (`/controllers`): Handles HTTP requests, validation.
3.  **Services** (`/services`): Core business logic.
4.  **Repositories** (`/repositories`): Data access layer.
5.  **Models** (`/models`): Mongoose schemas.
6.  **DTOs** (`/dtos`): Zod validation schemas.

---

## 🔌 Socket.io Implementation

Real-time functionality is handled in `src/socket/index.ts`.

- **Authentication**: Verifies JWT info upon `authenticate` event.
- **Rooms**: Joins users to private `user:{userId}` rooms.
- **Events**:
    - `notifyUser(userId, data)`: Sends private notifications.
    - `emitTaskEvent(event, data)`: Broadcasts task updates.

---

## 📡 API Endpoints

### Auth (`/auth`)
- `POST /register`: Register user
- `POST /login`: Login (returns simple success, sets cookie)
- `POST /verify-otp`: Verify email
- `POST /resend-otp`: Resend OTP
- `POST /forgot-password`: Request reset
- `POST /reset-password`: Complete reset

### Tasks (`/tasks`)
- `GET /`: List tasks (supports pagination/filtering)
- `POST /`: Create task
- `GET /:id`: Get details
- `PATCH /:id`: Update task
- `DELETE /:id`: Remove task

---

## 💡 Key Decisions

1.  **MongoDB**: Flexible document storage for tasks.
2.  **Stateless JWT**: Scalable auth stored in HttpOnly cookies.
3.  **Zod**: Runtime validation for all inputs (DTOs).
