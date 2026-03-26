# 📘 Project Notes: College Management System (Frontend Complete)

This document tracks the comprehensive architecture, design decisions, and status of the College Management System frontend phase.

---

## 🏗️ 1. Core Architecture & Tech Stack

Our frontend is built using a modern, scalable stack designed for speed and "vibrant, rich aesthetics".

*   **Framework**: Next.js 16 (App Router)
*   **Styling**: TailwindCSS (v4) with custom dark mode and dynamic hover/animation utility classes.
*   **State Management**: Zustand (Mocking databases/backend securely on the client side until Phase 2).
*   **Form Validation**: Zod (For Login & Registration schema safety).
*   **UI Components**: Functional, reusable React components (`ui/Button`, `ui/Input`, `ui/FileUpload`).

---

## 🚀 2. Features Implemented (Phase by Phase)

### Phase 1: Authentication & User Accounts (Mocked)
*   **Login (`app/login`)**: Zod-validated login form distinguishing between `admin` and `member` roles.
*   **Registration (`app/register`)**: Allow new members to register themselves via a rich form UI.
*   **Auth Store (`store/authStore.ts`)**: Global tracking of `isLoggedIn`, `user` (email), and `role`. 
*   *Security Note*: Protected pages utilize `useEffect` to safely `router.push("/login")` if unauthenticated.

### Phase 2: Notice Management
*   **Notices View (`app/notices`)**: Members can view active college notices natively with date parsing and styling.
*   **Create Notice (`app/create-notice`)**: Admins-only section to draft updates. Now supports a custom **Drag and Drop File Upload Component** instead of boring inputs!
*   **Notice Store (`store/noticeStore.ts`)**: Holds arrays of notices with features mapped like author tracking and optional attachment simulation.

### Phase 3: Event Management
*   **Events Loop (`app/events`)**: Dynamic grid interface where users can view upcoming events (Tech fests, Sports meets). Events successfully identify active vs past timelines.
*   **RSVP System**: Members can actively 'RSVP' and "Cancel RSVP". Admins can instantly see how many members are attending.
*   **Create Event (`app/create-event`)**: Admins-only zone to spawn events with distinct title, locations, organizers, and deadlines.
*   **Event Store (`store/eventStore.ts`)**: Array mappings for tracking `registeredUsers`.

### Phase 4: Complaint System
*   **Helpdesk / Tracking (`app/complaints`)**:
    *   *Admins*: View ALL complaints system-wide and directly click tags to dynamically change statuses (`Pending`, `In Progress`, `Resolved`, `Rejected`).
    *   *Members*: Bound context—they can only see tickets they raised themselves.
*   **Raise Ticket (`app/create-complaint`)**: Allows members to report infrastructure (e.g. Broken ACs, library wifi drops).

### Phase 5: Dashboard & Global UI
*   **Landing Page (`app/page.tsx`)**: Utterly rebuilt from ground-up using rich gradients, pulse animations, glassy frosted elements, and heavy marketing styling. It converts unregistered users to the newly built Sign-Up portal.
*   **Dashboard (`app/dashboard`)**: Intelligent rendering based on your role.
    *   *Admin Dashboard view*: "Pending Complaints", "Manage Notices", "Upcoming Events".
    *   *Member Dashboard view*: "My Open Tickets", "Active Campus Events", "Notices Loop".
*   **Navbar (`components/Navbar.tsx`)**: Responsive, horizontal-scroll friendly. Highlights standard routing.

---

## 💻 3. Reusable UI Components

To maintain consistency and reduce bloat, low-level UI elements are grouped together:

1.  **`<Button />`**: Standardized buttons with distinct variants (`primary`, `secondary`) and animation properties.
2.  **`<Input />`**: Universal input fields carrying their own contextual validation error rendering setups.
3.  **`<FileUpload />`**: A fully customized Drag-and-Drop area. Uses native HTML5 `onDragOver` / `onDrop` events cleanly hooked into React `useState`. Displays the precise active file name and file size parsed elegantly. 

---

## 🛣️ 4. The Transition to Backend (What’s Next?)

Right now, **Zustand (`store/`)** is doing the heavy lifting of acting like our MongoDB database. Since we neatly separated our Business Logic inside those stores, migrating to a real backend will be extremely easy.

**Future Action Items:**
1.  **Remove Dummy Data**: We won't pre-populate the Zustand stores.
2.  **Axios Calls**: Replace `addNotice()` logic inside `noticeStore.ts` with a `POST /api/notices` REST call.
3.  **JWT implementation**: `authStore` will just store the Token and decode it instead of simply trusting an email string.
4.  **AWS S3 / Multer**: Route the `File` object from `<FileUpload />` into FormData buffers mapped to our actual Express REST endpoints.

---

## 🧪 5. How to Run & Test Frontend Locally

1. Open your terminal at project root and run `npm run dev`.
2. Visit `http://localhost:3000`.
3. Try standard authentication bypass variables:
   - **Admin Powers**: `admin@test.com` / `123456`
   - **Student/Member Powers**: `any@mail.com` (or whatever you create via Register page) / `123456`
