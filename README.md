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
| **Authentication**                                                          | [Better-Auth ](https://www.better-auth.com/)        |
| **Asynchronous state management, server-state utilities and data fetching** | [TanStack Query](https://tanstack.com/query/latest) |
| **Headless Table UI**                                                       | [TanStack Table](https://tanstack.com/table/latest) |
| **End-to-end typesafe API**                                                 | [tRPC](https://trpc.io/)                            |
| **Schema Validation**                                                       | [Zod](https://zod.dev/)                             |
| **Form Managment**                                                          | [React Hook Form](https://react-hook-form.com/)     |
| **State Managment**                                                         | [Zustand](https://zustand.docs.pmnd.rs/)            |
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
        ├── register.action.ts
        ├── uploadthing.action.ts
        ├── user.action.ts
    └── 📁app
        └── 📁(admin)
            └── 📁admin
                └── 📁competitions
                    ├── page.tsx
                └── 📁database
                    ├── page.tsx
                └── 📁events
                    ├── page.tsx
                └── 📁payments
                    ├── page.tsx
                └── 📁teams
                    ├── page.tsx
                └── 📁users
                    ├── page.tsx
                └── 📁verify-documents
                    ├── page.tsx
                ├── layout.tsx
                ├── page.tsx
        └── 📁(dashboard)
            └── 📁dashboard
                └── 📁competitions
                    └── 📁[comp]
                        ├── page.tsx
                    ├── page.tsx
                └── 📁documents
                    └── 📁[team]
                        └── 📁[userId]
                            ├── document-form.tsx
                            ├── page.tsx
                        ├── page.tsx
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
                    └── 📁register
                        └── 📁[comp]
                            ├── page.tsx
                            ├── register-form.tsx
                        ├── page.tsx
                    ├── page.tsx
                ├── layout.tsx
                ├── page.tsx
        └── 📁(general)
            └── 📁(auth)
                └── 📁login
                    ├── LoginErrorHandler.tsx
                    ├── page.tsx
            └── 📁(competitions)
                └── 📁competitions
                    ├── CompetitionHero.tsx
                    ├── CompetitionList.tsx
                    ├── page.tsx
            └── 📁events
                └── 📁[event]
                    ├── event-form.tsx
                    ├── page.tsx
                ├── page.tsx
            └── 📁payment
                └── 📁error
                    ├── page.tsx
                └── 📁status
                    ├── page.tsx
            ├── layout.tsx
            ├── page.tsx
        └── 📁api
            └── 📁auth
                └── 📁[...all]
                    ├── route.ts
            └── 📁payment
                └── 📁callback
                    ├── route.ts
                └── 📁check
                    ├── route.ts
                └── 📁verify
                    ├── route.ts
                ├── route.ts
            └── 📁routers
                ├── admin.ts
                ├── dashboard.ts
            └── 📁team
                └── 📁create-team
                    ├── route.ts
                └── 📁edit-team
                    ├── route.ts
            └── 📁trpc
                └── 📁[trpc]
                    ├── route.ts
            └── 📁uploadthing
                ├── core.ts
                ├── route.ts
            └── 📁user
                └── 📁by-email
                    ├── route.ts
            └── 📁verify-document
                ├── route.ts
        ├── favicon.ico
        ├── global-error.tsx
        ├── globals.css
        ├── help-button.tsx
        ├── layout.tsx
    └── 📁components
        └── 📁admin
            └── 📁competitions
                ├── CompsDataTable.tsx
            └── 📁data-overview
                ├── DataOverview.tsx
                ├── PaymentGraph.tsx
            └── 📁payments
                ├── PaymentsDataTable.tsx
            └── 📁sidebar
                ├── app-sidebar.tsx
                ├── nav-documents.tsx
                ├── nav-main.tsx
                ├── nav-secondary.tsx
                ├── nav-user.tsx
                ├── PaymentsChartSkeleton.tsx
                ├── site-header.tsx
            └── 📁teams
                ├── TeamsDataTable.tsx
            └── 📁users
                ├── UsersDataTable.tsx
            └── 📁verify-documents
                ├── DocumentsDataTable.tsx
            ├── DashboardSkeleton.tsx
            ├── DataTable.tsx
        └── 📁auth
            ├── auth-buttons.tsx
        └── 📁contact
            ├── ContactSection.tsx
        └── 📁dashboard
            └── 📁competitions
                ├── CountdownClient.tsx
                ├── registered-teams.tsx
                ├── RegisteredCompetitionList.tsx
                ├── SubmitForm.tsx
                ├── SubmitFormSkeleton.tsx
            └── 📁documents
                ├── MemberList.tsx
                ├── MemberListSkeleton.tsx
                ├── TeamList.tsx
            └── 📁edit-team
                ├── TeamFormSkeleton.tsx
            └── 📁profile
                ├── ImageCropper.tsx
                ├── PencilIcon.tsx
                ├── ProfileFormSkeleton.tsx
                ├── setCanvasPreview.ts
                ├── UploadDialog.tsx
            └── 📁sidebar
                ├── app-sidebar.tsx
                ├── nav-documents.tsx
                ├── nav-main.tsx
                ├── nav-secondary.tsx
                ├── nav-user.tsx
                ├── site-header.tsx
            └── 📁team
                ├── CompetitionListDashboard.tsx
            ├── competition.tsx
            ├── CompetitionListSkeleton.tsx
            ├── deleteButton.tsx
            ├── events.tsx
            ├── team-member.tsx
            ├── TeamFallback.tsx
            ├── user-info.tsx
            ├── user-profile.tsx
        └── 📁document
            ├── DocumentFormSkeleton.tsx
            ├── ImageCropperDocument.tsx
            ├── setCanvasPreview.ts
            ├── UploadDocumentDialog.tsx
        └── 📁events
            ├── events-hero.tsx
            ├── index.tsx
        └── 📁general
            ├── faqs.tsx
            ├── footer.tsx
            ├── hero-section.tsx
            ├── Navbar.tsx
            ├── UserProfile.tsx
        └── 📁providers
            ├── query-provider.tsx
            ├── theme-provider.tsx
        └── 📁register
            ├── CompFormSkeleton.tsx
        └── 📁timeline
            ├── timeline-item.tsx
            ├── timeline-test.tsx
            ├── timeline.tsx
        └── 📁ui
            ├── accordion.tsx
            ├── alert-dialog.tsx
            ├── animated-group.tsx
            ├── avatar.tsx
            ├── badge.tsx
            ├── blur-fade.tsx
            ├── breadcrumb.tsx
            ├── button.tsx
            ├── calendar.tsx
            ├── card.tsx
            ├── chart.tsx
            ├── checkbox.tsx
            ├── collapsible.tsx
            ├── confetti.tsx
            ├── data-table-column-header.tsx
            ├── data-table-pagination.tsx
            ├── data-table-view-options.tsx
            ├── data-table.tsx
            ├── dialog.tsx
            ├── drawer.tsx
            ├── dropdown-menu.tsx
            ├── empty.tsx
            ├── field.tsx
            ├── infinite-slider.tsx
            ├── input.tsx
            ├── label.tsx
            ├── link-preview.tsx
            ├── popover.tsx
            ├── progress.tsx
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
            ├── timeline.tsx
            ├── toggle-group.tsx
            ├── toggle.tsx
            ├── tooltip.tsx
        ├── sponsor-item.tsx
        ├── sponsors.tsx
        ├── ToggleTheme.tsx
    └── 📁constants
        ├── constants.ts
    └── 📁hooks
        ├── use-mobile.ts
    └── 📁lib
        ├── auth-client.ts
        ├── competition.ts
        ├── event.ts
        ├── profile.ts
        ├── schema.ts
        ├── utils.ts
    └── 📁server
        └── 📁api
            ├── root.ts
            ├── trpc.ts
        └── 📁auth
            ├── auth.ts
        ├── db.ts
        ├── uploadthing.ts
    └── 📁store
        ├── admin.store.ts
        ├── dashboard.store.ts
    └── 📁styles
        ├── font.ts
    └── 📁types
        ├── types.ts
    └── 📁utils
        ├── trpc.ts
        ├── uploadthing.ts
    ├── env.ts
    ├── instrumentation-client.ts
    ├── instrumentation.ts
    └── proxy.ts
```

### 📝 License

This project is licensed under the MIT License.
