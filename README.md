# Mechanical Festival 2026 — Registration & Team Management System

A modern web platform built for **Mechanical Festival 2026**, designed to handle team registrations, competition enrollments.

This project was developed using **Next.js (App Router)**, with **TypeScript**, **Prisma**, **Better-auth**, **TanStack Query** , **TanStack Table**, **tRPC**, **Zod**, **React Hook Form**, **Zustand**, **UploadThing**, **Sentry**.
It serves as the official system for participants to register, create teams, and manage competition payments online.

---

## 🚀 Tech Stack

| Category                                                                    | Technology                                          |
| --------------------------------------------------------------------------- | --------------------------------------------------- |
| **Framework**                                                               | [Next.js 16 (App Router)](https://nextjs.org)       |
| **Language**                                                                | [TypeScript](https://www.typescriptlang.org/)       |
| **Styling**                                                                 | [TailwindCSS](https://tailwindcss.com/)             |
| **UI Components**                                                           | [shadcn/ui](https://ui.shadcn.com/)                 |
| **Database ORM**                                                            | [Prisma](https://www.prisma.io/)                    |
| **Database**                                                                | [Neon PostgreSQL](https://neon.tech/)               |
| **Authentication**                                                          | [Better-Auth ](https://www.better-auth.com/)        |
| **Asynchronous state management, server-state utilities and data fetching** | [TanStack Query](https://tanstack.com/query/latest) |
| **Headless Table UI**                                                       | [TanStack Table](https://tanstack.com/table/latest) |
| **End-to-end typesafe API**                                                 | [tRPC](https://trpc.io/)                            |
| **Schema Validation**                                                       | [Zod](https://zod.dev/)                             |
| **Form Managment**                                                          | [React Hook Form](https://react-hook-form.com/)     |
| **State Managment**                                                         | [Zustand](https://zustand.docs.pmnd.rs/)            |
| **File Uploads**                                                            | [UploadThing](https://uploadthing.com/)             |
| **Error Tracking**                                                          | [Sentry.js](https://sentry.io/)                     |
| **Deployment**                                                              | [Vercel](https://vercel.com/)                       |

---

## ✨ Features

### 🧑‍💻 Authentication

- Secure login and registration using **Google** or **GitHub** OAuth.
- User session management handled by **Better-Auth**.
- Secure session handling with Better-Auth.
- User profile management including avatar upload using UploadThing.
- Profile editing with avatar upload (via UploadThing).
- Role-based control: USER, ADMIN, SUPERADMIN.

### 👥 Team Management

- Create and edit teams with leader and member roles.
- Teams have editable member lists with form validation.
- Restriction rules: only unregistered teams can be edited or deleted.
- Leaders now have expanded capabilities:
  - Register a team to competitions.
  - Upload member's documents/requirements needed for verification.
  - Track verification status directly from dashboard.

### 🏆 Competition Registration

- Team can be registered into available competitions.
- Only team leaders are permitted to initiate registration.
- Live transaction tracking with states: success, pending, failed.

### 📄 Document Handling & Verification

- Each member in a team may upload required verification documents.
- Leader can upload documents on behalf of members.
- Document verification flow built for Admin review.

### 🛠 Admin System (Fully Functional)

- Admin Features:

| View                              | Action Capabilities           |
| --------------------------------- | ----------------------------- |
| Users list                        | View user details & role      |
| User document details page        | Approve / reject individually |
| Accounts, sessions, teams         | Delete or manage records      |
| Team documents                    | Bulk approve / bulk reject    |
| Promote/demote roles (SUPERADMIN) | Set role → `USER` ↔ `ADMIN`   |

- Table powered by TanStack Table + ShadCN UI, supports search, filtering, column toggling.
- Row actions allow bulk operations (approve all documents, delete multiple accounts, etc).
- Real-time data handling with TanStack Query & TRPC mutations.

### ⚙️ Additional Features

- Error and performance tracking via **Sentry**.
- Secure server actions and Prisma operations.
- Suspense and server components for optimized rendering.

---

## 🛠️ Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/EnvoyX/m-fest.git
cd m-fest
```

### 2. Install dependancies

```bash
npm install
```

### 3. Setup enviroment variables

```env
# Database
DATABASE_URL=""
DIRECT_URL=""

# NODENV
NODE_ENV="development"

# BASE URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Better-Auth
BETTER_AUTH_URL=""
BETTER_AUTH_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_ID=""

# UploadThing
UPLOADTHING_TOKEN=''
UPLOADTHING_API=""
UPLOADTHING_APP_ID=""

# Duitku
DUITKU_MERCHANT_ID=""
DUITKU_API_KEY=""

# Sentry
SENTRY_AUTH_TOKEN=""
```

### 4 Initialize Prisma

```bash
npx prisma db push
npx prisma generate
```

### 5. Run the development server (using bun for faster dev server)

```bash
bun run dev
```

```
the app should be running on:
http://localhost:3000
```

### 📝 License

This project is licensed under the MIT License.
