# 🛠️ Backend Architecture Design: College Management System

This document outlines the theoretical backend architecture, database schemas, and API design required to complete the College Management System. No implementation code is present; this serves as the blueprint for the upcoming Node.js / Express.js / MongoDB integration.

---

## 1. High-Level System Architecture
*   **Runtime Environment**: Node.js
*   **Web Framework**: Express.js (RESTful API architecture)
*   **Database**: MongoDB (NoSQL) accessed via Mongoose ODM
*   **Authentication**: JSON Web Tokens (JWT) for stateless sessions
*   **File Storage**: AWS S3 (or local disk via Multer) for Notice attachments
*   **Deployment**: Ready for Render / Railway / AWS

---

## 2. Database Schema Design (Mongoose Models)

### `User` Collection
Stores authentication credentials and role-based access control (RBAC) definitions.
*   `_id`: ObjectId
*   `name`: String (required)
*   `email`: String (unique, index)
*   `passwordHash`: String (bcrypt hashed)
*   `role`: Enum (`'admin'`, `'member'`) - Default: `'member'`
*   `createdAt` / `updatedAt`: Timestamps

### `Notice` Collection
Tracks official campus announcements.
*   `_id`: ObjectId
*   `title`: String (required)
*   `content`: String (required)
*   `author`: ObjectId (Ref -> `User`)
*   `attachmentUrl`: String (Optional link to S3 bucket / local static folder)
*   `createdAt` / `updatedAt`: Timestamps

### `Event` Collection
Manages campus activities and tracks student RSVPs.
*   `_id`: ObjectId
*   `title`: String
*   `description`: String
*   `date`: Date
*   `location`: String
*   `organizer`: String
*   `registeredUsers`: [ObjectId] (Ref -> `User` array for RSVPs)
*   `createdAt` / `updatedAt`: Timestamps

### `Complaint` Collection
Tracks issue tickets raised by members.
*   `_id`: ObjectId
*   `title`: String
*   `description`: String
*   `status`: Enum (`'Pending'`, `'In Progress'`, `'Resolved'`, `'Rejected'`) - Default: `'Pending'`
*   `user`: ObjectId (Ref -> `User` who raised the ticket)
*   `createdAt` / `updatedAt`: Timestamps

---

## 3. RESTful API Endpoints Specification

### 🔐 Authentication (`/api/auth`)
*   `POST /api/auth/register`: Create a new User. Returns JWT.
*   `POST /api/auth/login`: Validate credentials. Returns JWT.
*   `GET /api/auth/me`: Validate continuous session (returns user profile based on JWT token).

### 📢 Notices (`/api/notices`)
*   `GET /api/notices`: Fetch all notices (Public/Member).
*   `POST /api/notices`: Create notice ( **Admin Only**, supports Multer `multipart/form-data` for attachments).
*   `DELETE /api/notices/:id`: Delete notice ( **Admin Only**).

### 📅 Events (`/api/events`)
*   `GET /api/events`: Fetch all events (sorted by date).
*   `POST /api/events`: Create event ( **Admin Only**).
*   `DELETE /api/events/:id`: Remove event ( **Admin Only**).
*   `POST /api/events/:id/rsvp`: Add user's ObjectId to `registeredUsers` array.
*   `DELETE /api/events/:id/rsvp`: Remove user's ObjectId from `registeredUsers`.

### 🛡️ Complaints (`/api/complaints`)
*   `GET /api/complaints`: 
    *   If **Admin**: Returns all complaints system-wide.
    *   If **Member**: Only returns complaints where `user === req.user._id`.
*   `POST /api/complaints`: Raise a new ticket (Member).
*   `PATCH /api/complaints/:id/status`: Update status ( **Admin Only**).
*   `DELETE /api/complaints/:id`: Remove a complaint ( **Admin Only**).

---

## 4. Custom Express Middleware Hierarchy

1.  **`express.json()` & `cors()`**: Global parsing and cross-origin resource sharing for Next.js interoperability.
2.  **`authMiddleware.js`**: 
    *   Intercepts HTTP requests.
    *   Extracts dynamic `Bearer <token>`.
    *   Verifies JWT signature via `jsonwebtoken`.
    *   Injects the decoded payload into `req.user`.
3.  **`roleMiddleware.js`**: 
    *   A higher-order function: `requireRole('admin')`.
    *   Immediately blocks requests with `403 Forbidden` if `req.user.role` does not match the requirement.
4.  **`uploadMiddleware.js`**: 
    *   Utilizes `multer` to intercept Notice attachments, process the binary stream, and store it efficiently before passing control to the final controller.
5.  **`errorHandler.js`**: 
    *   A centralized `(err, req, res, next)` block to catch Database crashes, Validation errors, and format them into a standard `{ success: false, message: '...' }` JSON response for the frontend.

---

## 5. Security Protocols
*   **Password Hashing**: Never store plain text passwords. `bcrypt.js` will salt and hash during Registration and generate comparisons during Login.
*   **Stateless Scaling**: Using JWT ensures server instances do not need to share session memory.
*   **Input Validation**: A backend `Zod` or `Joi` validation layer will mirror the frontend restrictions to prevent NoSQL Injection attacks. 
*   **Data Masking**: Exclude `passwordHash` and `__v` from all Mongoose `.find()` queries before sending JSON to the React client.
