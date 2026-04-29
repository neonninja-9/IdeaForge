# IdeaForge AI Agent Prompt Series

Use these prompts one by one in Codex, Claude Code, or a similar coding agent. Each prompt assumes the agent is working in this repository and should continue from the current state instead of starting over.

Current project state:

- Repo root contains product docs in `README.md` and `Tech-stack.md`.
- Working app is currently under `frontend/`.
- Frontend is a Next.js 16.2.1 app using React 19, TypeScript, Tailwind CSS 4, and App Router.
- Existing UI is a static marketing homepage composed from `frontend/src/app/page.tsx` and components in `frontend/src/components/`.
- There is no implemented backend, database, authentication, idea CRUD, voting, comments, search, or recommendation logic yet.
- `frontend/AGENTS.md` says to read relevant Next.js docs in `node_modules/next/dist/docs/` before making Next-specific changes because this version has breaking changes.

Before every prompt:

- Run from the repo root unless the prompt says otherwise.
- Inspect the current files first and preserve existing user changes.
- Prefer small, focused changes with working build/lint checks after each major step.
- Do not remove existing homepage work unless replacing it with an equivalent app route.
- Use the existing product direction from `README.md`: structured project ideas, categories, tags, tech stack recommendations, similar ideas, voting, and discussion.

## Prompt 1: Baseline Audit And Execution Plan

Inspect the repository and summarize the current implementation. Read `README.md`, `Tech-stack.md`, `frontend/AGENTS.md`, `frontend/package.json`, `frontend/src/app/page.tsx`, `frontend/src/app/globals.css`, and all files in `frontend/src/components/`. Identify what is already built, what is missing for a full working IdeaForge application, and any risks from using Next.js 16/Tailwind 4. Then create a concise implementation plan in `docs/implementation-plan.md` with phases, file areas, and verification commands. Do not change runtime code in this prompt.

## Prompt 2: Normalize Product Requirements

Create `docs/product-spec.md` that turns the existing README into an actionable MVP specification. Include user roles, core user journeys, required pages, idea fields, category/tag behavior, voting, comments, search/filtering, tech stack recommendations, and out-of-scope future features. Keep the spec practical for an MVP that can run locally. Do not implement code yet.

## Prompt 3: Choose Architecture For Local MVP

Based on the current frontend-only Next app, decide whether to implement the MVP as a single Next.js application using App Router route handlers and Prisma, or as a separate backend service. Prefer the simplest maintainable path unless there is a strong reason otherwise. Update `docs/implementation-plan.md` with the chosen architecture, environment variables, folder structure, local commands, and deployment assumptions. Do not write feature code yet.

## Prompt 4: Install Core App Dependencies

Inside `frontend/`, add the dependencies needed for the MVP architecture: Prisma, Prisma client, Auth.js/NextAuth if compatible with the installed Next version, Zod, password hashing, and any small utilities needed for forms or data access. Read the installed Next docs before coding against Next 16 APIs. Update `frontend/package.json` scripts for Prisma generation/migration if needed. Run install, then run lint/build if possible and record any issues in `docs/implementation-plan.md`.

## Prompt 5: Add Database Schema

Add Prisma to the app with a PostgreSQL-ready schema that also supports easy local development. Model `User`, `Idea`, `Category`, `Tag`, `IdeaTag`, `Vote`, `Comment`, and any needed timestamps/status fields. Include fields from the README: title, problem, solution, category, tags, impact, difficulty, suggested tech stack, author, votes, and comments. Add indexes for search/filtering fields. Generate the Prisma client and create a seed script with realistic sample IdeaForge data.

## Prompt 6: Add Environment And Setup Docs

Create or update local setup documentation for the frontend app. Add `frontend/.env.example` with all required variables. Update `frontend/README.md` with install, database setup, Prisma migration/seed, dev server, lint, and build commands. Mention the current Next.js version and the requirement to check `frontend/AGENTS.md` before Next API changes.

## Prompt 7: Data Access Layer

Create a typed server-side data access layer under `frontend/src/lib/` for users, ideas, categories, tags, votes, and comments. Use Prisma through a singleton client helper. Add Zod schemas for idea creation/update, comments, voting, search query parameters, and auth inputs. Keep database access out of React components wherever possible.

## Prompt 8: App Shell And Navigation

Convert the app from a marketing-only page into an application shell. Keep the landing page available, but add routes for explore, idea detail, submit idea, dashboard, login, and register. Update navigation so users can move through the product. Ensure the UI stays consistent with the current visual style but becomes more practical for a content/productivity app.

## Prompt 9: Explore Ideas Page

Implement `/explore` as the primary idea discovery page. It should render seeded ideas from the database, show title, problem summary, category, tags, difficulty, impact, suggested stack, vote count, comment count, and author/date metadata. Add empty, loading, and error states. Use server components where appropriate and keep client components only for interactive controls.

## Prompt 10: Search And Filters

Add search and filtering to `/explore`. Support text search, category filter, tag filter, difficulty filter, sort by newest/top/most discussed, and clear filters. Encode filters in the URL query string. Make the UI responsive and efficient for scanning many ideas. Validate query params with Zod and make sure invalid values fail gracefully.

## Prompt 11: Idea Detail Page

Implement `/ideas/[id]` with full idea details: title, problem, proposed solution, expected impact, difficulty, category, tags, suggested tech stack, similar ideas placeholder, vote count, author metadata, creation date, and discussion section. Add proper `notFound()` handling for missing ideas and generate useful metadata if supported by the installed Next version.

## Prompt 12: Authentication Foundation

Implement local email/password authentication with secure password hashing and session handling. Prefer Auth.js/NextAuth if compatible with the installed Next version; otherwise implement a minimal secure session approach using signed HTTP-only cookies. Add register, login, logout, and current-user helpers. Protect routes that require authentication.

## Prompt 13: Submit Idea Flow

Implement `/submit` for authenticated users. Add a validated form for title, problem, solution, category, tags, impact, difficulty, and optional links. On submit, create the idea in the database and redirect to the new idea detail page. Show useful validation messages and preserve user input after validation errors.

## Prompt 14: Edit And Delete Own Ideas

Allow authenticated authors to edit and delete their own ideas. Add authorization checks on the server. Include edit UI, update actions, delete confirmation, and redirects. Make sure non-authors cannot see or call destructive actions successfully. Add tests or at least server-side assertions for authorization behavior.

## Prompt 15: Voting System

Implement voting so authenticated users can upvote an idea once and remove their vote. Add a server action or route handler for toggling votes, update counts correctly, and prevent duplicate votes at the database level. Add optimistic or responsive UI on idea cards and detail pages without compromising correctness.

## Prompt 16: Comments And Discussion

Implement comments on idea detail pages. Authenticated users can add comments, and comment authors can delete their own comments. Render comments in chronological order with author and date. Validate comment length, handle empty states, and protect server-side mutations with auth checks.

## Prompt 17: Tech Stack Recommendation MVP

Build a deterministic MVP tech stack recommendation module. Given category, tags, difficulty, and idea text, suggest relevant technologies from a curated mapping. Integrate it into the submit form as a preview and store the final recommendation on the idea. Keep the module testable and avoid calling external AI APIs in this step.

## Prompt 18: Similar Ideas MVP

Implement basic similar idea grouping without external services. Use category/tag overlap and simple text matching to find related ideas. Show similar ideas on the detail page. Keep the algorithm isolated under `frontend/src/lib/` so it can later be replaced by embeddings or a search service.

## Prompt 19: User Dashboard

Implement `/dashboard` for authenticated users. Show the user's submitted ideas, vote totals, comment counts, and recent activity. Add quick links to submit a new idea, edit existing ideas, and view public detail pages. Include empty states for new users.

## Prompt 20: Categories And Tags Pages

Create category and tag browsing pages, such as `/categories`, `/categories/[slug]`, and `/tags/[slug]`. Show idea counts and filtered idea lists. Make sure category/tag links from cards and detail pages navigate to these routes.

## Prompt 21: Landing Page Alignment

Revise the existing landing page content so it accurately markets the actual IdeaForge product, not a generic idea/story tool. Keep the strongest parts of the current visual design, but align hero copy, capabilities, workflow, proof, CTA, and navigation with project idea discovery, structured submissions, recommendations, and collaboration. Ensure all CTAs link to real app routes.

## Prompt 22: UX Polish And Responsive Pass

Review every implemented route on desktop and mobile widths. Fix layout overflow, awkward spacing, inaccessible controls, missing focus states, weak contrast, and confusing empty/error states. Ensure forms are usable on small screens and that idea cards remain scannable. Keep UI practical and app-like rather than a marketing-heavy layout.

## Prompt 23: Validation, Errors, And Loading States

Audit all server actions, route handlers, and forms. Add consistent validation errors, auth errors, not-found states, pending states, and success feedback. Make sure database errors do not leak sensitive details to users. Centralize common helpers where useful without over-abstracting.

## Prompt 24: Test Coverage

Add focused tests for the highest-risk logic: validation schemas, tech stack recommendation, similar idea matching, auth guards, voting uniqueness, and authorization for editing/deleting ideas/comments. Use the test framework that best fits the existing Next/TypeScript setup. Add test scripts to `frontend/package.json` and document how to run them.

## Prompt 25: Final Integration And Release Readiness

Run a full verification pass from a clean install path if possible: install, generate Prisma client, migrate/seed database, lint, test, build, and run the dev server. Manually verify landing, explore, filters, idea detail, auth, submit, edit/delete, vote, comments, dashboard, categories, and tags. Fix any blocking issues. Update documentation with final commands, known limitations, and deployment notes.
