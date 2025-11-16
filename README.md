# Mechanical Festival 2026 — Registration & Team Management System

A modern web platform built for **Mechanical Festival 2026**, designed to handle team registrations, competition enrollments, and payment integrations with a smooth, secure, and user-friendly interface.

This project was developed using **Next.js (App Router)**, with **TypeScript**, **Prisma**, **Auth.js**, and **DuitKu POP** for payments.  
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
| **Authentication**                                                          | [Auth.js (NextAuth)](https://authjs.dev/)           |
| **Asynchronous state management, server-state utilities and data fetching** | [TanStack Query](https://tanstack.com/query/latest) |
| **File Uploads**                                                            | [UploadThing](https://uploadthing.com/)             |
| **Payments**                                                                | [DuitKu POP](https://docs.duitku.com/)              |
| **Error Tracking**                                                          | [Sentry.js](https://sentry.io/)                     |
| **Deployment**                                                              | [Vercel](https://vercel.com/)                       |

---

## ✨ Features

### 🧑‍💻 Authentication

- Secure login and registration using **Google** or **GitHub** OAuth.
- User session management handled by **Auth.js**.
- Profile editing with avatar upload (via UploadThing).

### 👥 Team Management

- Create and edit teams with leader and member roles.
- Dynamic team member forms with validation.
- Restriction rules: only unregistered teams can be edited or deleted.
- Cascade deletion for related team members.

### 🏆 Competition Registration

- Register teams to competitions.
- Payment integration using **Duitku POP**.
- Only team leaders can initiate payments.
- Real-time payment status updates (settlement, pending, failed).

### 💳 Payment System

- Fully integrated **Duitku POP** payment gateway.
- Handles success, pending, and error redirects.
- Displays payment status and transaction details in dashboard.

### 🧾 Profile Management

- Update user profile (name, email, institution, and profile picture).

### ⚙️ Additional Features

- Error and performance tracking via **Sentry**.
- Secure server actions and Prisma operations.
- Suspense and server components for optimized rendering.

---

## 🛠️ Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/mechfest-2026.git
cd mechfest-2026
```

### 2. Install dependancies

```bash
bun install
```

### 3. Setup enviroment variables

```env
# Database
DATABASE_URL=""
DIRECT_URL=""

# NODENV
NODE_ENV="development"

# BASE URL Dev
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# BASE_URL_PROD
# NEXT_PUBLIC_BASE_URL=""

# Auth.js
AUTH_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_DISCORD_ID=""
AUTH_DISCORD_SECRET=""

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

# STORYBLOK

STORYBLOK_CONTENT_API_ACCESS_TOKEN=""

### 4 Initialize Prisma

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server

```bash
bun run dev
```

```
the app should be running on:
http://localhost:3000
```

### 6. Project Structure

```
└── 📁src
    └── 📁action
        ├── uploadthing.action.ts
        ├── user.action.ts
    └── 📁app
        └── 📁(dashboard)
            └── 📁dashboard
                └── 📁competitions
                    ├── page.tsx
                └── 📁events
                    ├── page.tsx
                └── 📁invoices
                    ├── page.tsx
                    ├── TableInvoices.tsx
                └── 📁profile
                    ├── page.tsx
                    ├── profile-form.tsx
                └── 📁team
                    └── 📁create-team
                        ├── page.tsx
                        ├── team-form.tsx
                    └── 📁edit-team
                        └── 📁[team]
                            ├── edit-team-form.tsx
                            ├── page.tsx
                        ├── page.tsx
                    ├── page.tsx
                ├── layout.tsx
                ├── page.tsx
        └── 📁(general)
            └── 📁_components
                ├── faqs.tsx
                ├── hero-section.tsx
            └── 📁(auth)
                └── 📁_sign-up
                    ├── page.tsx
                    ├── sign-up.tsx
                └── 📁login
                    ├── login-form.tsx
                    ├── LoginErrorHandler.tsx
                    ├── page.tsx
            └── 📁(competitions)
                └── 📁competitions
                    ├── competition-desc.tsx
                    ├── competitions.tsx
                    ├── page.tsx
                └── 📁register
                    └── 📁[comp]
                        ├── page.tsx
                        ├── register-form.tsx
            └── 📁events
                └── 📁[event]
                    ├── event-form.tsx
                    ├── page.tsx
                ├── page.tsx
            └── 📁payment
                └── 📁error
                    ├── page.tsx
                └── 📁thanks
                    ├── page.tsx
            ├── layout.tsx
            ├── page.tsx
        └── 📁api
            └── 📁auth
                └── 📁[...nextauth]
                    ├── route.ts
                └── 📁sign-up
                    ├── route.ts
            └── 📁payment
                └── 📁check
                    ├── route.ts
                └── 📁notification
                    ├── route.ts
                └── 📁verify
                    ├── route.ts
                ├── route.ts
            └── 📁team
                └── 📁create-team
                    ├── route.ts
                └── 📁edit-team
                    ├── route.ts
            └── 📁update-profile
                ├── route.ts
            └── 📁uploadthing
                ├── core.ts
                ├── route.ts
            └── 📁user
                └── 📁by-email
                    ├── route.ts
                └── 📁search
        ├── favicon.ico
        ├── global-error.tsx
        ├── globals.css
        ├── layout.tsx
    └── 📁components
        └── 📁auth
            ├── auth-buttons-server.tsx
            ├── auth-buttons.tsx
        └── 📁dashboard
            ├── app-sidebar.tsx
            ├── competition.tsx
            ├── deleteButton.tsx
            ├── events.tsx
            ├── nav-documents.tsx
            ├── nav-main.tsx
            ├── nav-secondary.tsx
            ├── nav-user.tsx
            ├── registered-stem.tsx
            ├── registered-teams.tsx
            ├── site-header.tsx
            ├── team-member.tsx
            ├── user-info.tsx
            ├── user-profile.tsx
        └── 📁events
            ├── events-hero.tsx
            ├── index.tsx
        └── 📁general
            ├── footer.tsx
            ├── Navbar.tsx
            ├── RouteLoader.tsx
            ├── UserProfile.tsx
        └── 📁providers
            ├── session-provider.tsx
            ├── theme-provider.tsx
        └── 📁ticket
            ├── pricing.tsx
        └── 📁timeline
            ├── timeline-item.tsx
            ├── timeline.tsx
        └── 📁ui
            ├── accordion.tsx
            ├── alert-dialog.tsx
            ├── animated-group.tsx
            ├── avatar.tsx
            ├── badge.tsx
            ├── breadcrumb.tsx
            ├── button.tsx
            ├── card.tsx
            ├── chart.tsx
            ├── checkbox.tsx
            ├── drawer.tsx
            ├── dropdown-menu.tsx
            ├── empty.tsx
            ├── field.tsx
            ├── infinite-slider.tsx
            ├── input.tsx
            ├── label.tsx
            ├── progressive-blur.tsx
            ├── select.tsx
            ├── separator.tsx
            ├── sheet.tsx
            ├── sidebar.tsx
            ├── skeleton.tsx
            ├── sonner.tsx
            ├── table.tsx
            ├── tabs.tsx
            ├── text-effect.tsx
            ├── toggle-group.tsx
            ├── toggle.tsx
            ├── tooltip.tsx
        ├── sponsor-item.tsx
        ├── sponsors.tsx
        ├── StoryblokProvider.tsx
        ├── ToggleTheme.tsx
    └── 📁hooks
        ├── use-mobile.ts
    └── 📁lib
        ├── competition.ts
        ├── event.ts
        ├── hero.ts
        ├── prisma.ts
        ├── profile.ts
        ├── storyblok.ts
        ├── utils.ts
    └── 📁server
        ├── trpc.ts
        ├── uploadthing.ts
    └── 📁styles
        ├── font.ts
    └── 📁types
        ├── next-auth.d.ts
    └── 📁utils
        ├── uploadthing.ts
    ├── auth.ts
    ├── instrumentation-client.ts
    └── instrumentation.ts
```

---

### 📝 License

This project is licensed under the MIT License.
