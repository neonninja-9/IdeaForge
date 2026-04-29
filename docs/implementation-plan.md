# IdeaForge Implementation Plan

## 1. Baseline Audit

### What is Already Built
- A frontend shell using **Next.js 16.2.1**, **React 19**, and **Tailwind CSS 4**.
- A static marketing homepage (`frontend/src/app/page.tsx`) composed of several UI components (`Hero`, `Navbar`, `CoreCapabilities`, etc.).
- Basic global styling using Tailwind 4's new `@theme` CSS variable approach (`frontend/src/app/globals.css`).

### What is Missing
- **Database & Data Layer:** No database schema or ORM (Prisma/PostgreSQL).
- **Authentication:** No user login, registration, or session management.
- **Dynamic Routes & Pages:** Missing `/explore`, `/ideas/[id]`, `/submit`, `/dashboard`, `/categories`, and `/tags` routes.
- **Core Features:** Idea creation/editing, voting system, commenting, and search/filtering logic.
- **Advanced Features:** Tech stack recommendation MVP and similar idea grouping.
- **Backend API / Server Actions:** No server-side logic to handle data mutations.

### Risks & Considerations
- **Next.js 16 & React 19:** Next.js 16 introduces breaking changes to APIs and conventions. It requires reading local documentation (`node_modules/next/dist/docs/`) before making structural changes. React 19 also brings new paradigms for handling server actions and state (`useActionState`, `useFormStatus`).
- **Tailwind CSS 4:** Tailwind v4 uses a CSS-first approach (no `tailwind.config.js`). We must adhere to the `@theme` variable structure in `globals.css` and be careful with any complex utility classes or external plugins that might expect v3.

---

## 2. Architecture Decisions (MVP)

### Chosen Architecture
**Single Next.js Application (Full-Stack)**
Given the requirement for the simplest maintainable path and the existing Next.js 16 App Router setup, we will use a unified architecture. Next.js Server Actions and Route Handlers will serve as the backend layer, communicating directly with the database via Prisma ORM. A separate backend service would add unnecessary complexity for the MVP scope.

### Technology Stack
- **Framework:** Next.js 16.2 (App Router)
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** Auth.js (NextAuth) or secure HTTP-only cookies if Auth.js Next 16 support is limited.
- **Styling:** Tailwind CSS 4

### Environment Variables
Required in `frontend/.env`:
- `DATABASE_URL`: PostgreSQL connection string.
- `AUTH_SECRET`: Secret key for session encryption.
- `NEXT_PUBLIC_APP_URL`: Base URL for absolute links (e.g., `http://localhost:3000`).

### Folder Structure Additions
```text
frontend/
├── prisma/               # Database schema, migrations, seed scripts
├── src/
│   ├── app/
│   │   ├── api/          # Route handlers (if needed)
│   │   ├── explore/      # Explore routes
│   │   ├── ideas/        # Idea detail routes
│   │   └── ...
│   ├── components/       # UI components (Client & Server)
│   └── lib/              # Core logic
│       ├── prisma.ts     # Singleton database client
│       ├── auth.ts       # Authentication configuration
│       ├── schemas.ts    # Zod validation schemas
│       └── ...
```

### Local Commands
- Setup: `npm install`
- Database: `npx prisma migrate dev` (runs migrations and generates client)
- Seed: `npx prisma db seed`
- Development: `npm run dev`

### Deployment Assumptions
- **Hosting:** Vercel (seamless Next.js support for SSR, API routes, and Server Actions).
- **Database:** A managed PostgreSQL provider (e.g., Supabase, Neon, or Railway) to connect seamlessly via the `DATABASE_URL`.

---

## 3. Implementation Phases

### Phase 1: Architecture & Foundation (Prompts 2-7)
- **Goal:** Set up product spec, MVP architecture, database schema, and data access layer.
- **Files/Areas:** `docs/product-spec.md`, `frontend/package.json`, `prisma/schema.prisma`, `frontend/.env.example`, `frontend/src/lib/`.
- **Verification Commands:** 
  - `npm install`
  - `npx prisma generate`
  - `npm run lint` && `npm run build`
- **Execution Notes (Prompt 4):**
  - Prisma requires Node.js 20.19+. Set Node version to v24.
  - Added Prisma, NextAuth beta, Zod, and bcryptjs.
  - Lint and Build passed successfully without issues.

### Phase 2: App Shell & Authentication (Prompts 8, 12)
- **Goal:** Transition from a static landing page to a dynamic app shell and set up secure authentication.
- **Files/Areas:** App layout (`layout.tsx`), new routes (`/login`, `/register`), Auth integration (`frontend/src/lib/auth.ts`).
- **Verification Commands:** 
  - `npm run dev` (Test sign-in/sign-out flows)

### Phase 3: Core Idea Discovery (Prompts 9-11)
- **Goal:** Implement the `/explore` page, search/filtering, and the individual idea detail page (`/ideas/[id]`).
- **Files/Areas:** `frontend/src/app/explore/page.tsx`, `frontend/src/app/ideas/[id]/page.tsx`, search components.
- **Verification Commands:** 
  - Build and run dev server.
  - Verify routing and data fetching.

### Phase 4: User Actions (Prompts 13-16, 19)
- **Goal:** Allow users to submit, edit, and delete ideas. Implement voting and commenting. Add a user dashboard.
- **Files/Areas:** `/submit`, `/dashboard`, server actions for CRUD, voting, and comments under `frontend/src/app/ideas/[id]/actions.ts`.
- **Verification Commands:** 
  - Test server actions logic.
  - Verify authorization barriers.

### Phase 5: Categorization & Recommendations (Prompts 17-18, 20)
- **Goal:** Implement categories, tags, tech stack recommendations, and similar ideas MVP.
- **Files/Areas:** `/categories`, `/tags`, `frontend/src/lib/recommendations.ts`.
- **Verification Commands:** 
  - Unit test recommendation logic.

### Phase 6: Polish & Final Integration (Prompts 21-25)
- **Goal:** UX polish, responsive layout checks, landing page alignment, testing, and error state handling.
- **Files/Areas:** Global components, tests (`frontend/tests/`), documentation updates.
- **Verification Commands:** 
  - `npm run test`
  - `npm run build`
  - Full manual walkthrough of the application.
