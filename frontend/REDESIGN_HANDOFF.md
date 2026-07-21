# IdeaForge UI Redesign Handoff

## Purpose and current goal

Continue transforming the React/Vite frontend at `IdeaForge/frontend` according to [REDESIGN.md](./REDESIGN.md). The product direction is **Calm Futurism**: a premium, calm AI-powered idea incubator—not a generic note-taking or idea-board app.

Do not attempt the full 989-line specification in one change. Continue in the small implementation slices listed below, preserving API-backed behavior where it already exists.

## Completed redesign slices

1. **Shared shell and foundations**
   - Added `src/components/AppShell.tsx`.
   - Authenticated pages now use a responsive workspace shell: collapsible desktop sidebar, top search/status/profile bar, mobile drawer, and five-tab mobile navigation.
   - Updated `src/App.tsx` so `WorkspaceLayout` renders `AppShell`; it contains the route outlet.
   - Updated `src/index.css` color tokens toward the spec: `#fafaf8` background, indigo `#6366f1`, violet `#8b5cf6`.
   - Font package currently available is Geist. CSS declares Poppins/Inter first with Geist as the local fallback. Do not assume additional font packages are installed.

2. **Home dashboard** — `src/pages/DashboardPage.tsx`
   - Rebuilt around greeting, large capture card, stats, live idea cards, inspiration prompts, and activity timeline.
   - Preserves existing `ideaService.getDashboard()` API data.
   - Capture text routes to `/submit?prompt=...`.

3. **Idea capture and AI expansion preview** — `src/pages/SubmitIdeaPage.tsx`
   - Rebuilt as a focused capture studio with live “idea clarity,” category/difficulty/tags, attachment control affordances, and an AI-blueprint preview panel.
   - The blueprint is **client-side generated UI**, not a real AI service. Keep that honest in wording; it is explicitly labelled a creative starting point.
   - Existing `categoryService`, `tagService`, validation, `ideaService.createIdea`, and API-save behavior are retained.
   - The `prompt` query parameter pre-fills the problem field.

4. **Idea details, validation, and roadmap preview** — `src/pages/IdeaDetailPage.tsx`
   - Rebuilt with opportunity/solution/impact cards, client-side validation score widgets, staged roadmap, and community momentum.
   - Validation scores and roadmap are presentation-only derived from existing idea engagement, not server-side market data.
   - Existing API-backed idea fetch, comments, comment deletion, and voting are retained.

## Current implementation plan

Completed:

- Shared shell and foundation
- Home dashboard
- Idea capture and AI expansion preview
- Idea detail, validation, and roadmap preview

Next, in this order:

1. **Projects/canvas and AI Studio surfaces**
   - The backend does not currently expose a project/canvas API or routes.
   - Add clearly labelled client-side prototype surfaces or introduce new routes only if the user authorizes the corresponding data model/API work.
   - Avoid pretending project persistence or AI chat exists if it does not.

2. **Search, notifications, profile, and settings**
   - Current top-shell controls are visual affordances only.
   - Existing profile route is `/profile`; explore data is available at `/explore`.
   - Implement search against available idea data first, then notifications/settings UI with honest empty/prototype states until APIs exist.

3. **Cross-app polish**
   - Audit landing, login, register, explore, profile, loading states, empty states, motion, keyboard behavior, focus styles, and reduced-motion behavior.

## Architecture and routes

- Framework: React 19 + TypeScript + Vite + Tailwind CSS v4.
- Router: `react-router-dom`.
- Auth context: `src/context/AuthContext.tsx`, hook: `src/hooks/useAuth.ts`.
- API services: `src/services/`.
- Current meaningful routes:
  - `/` public landing
  - `/login`, `/register`
  - `/dashboard`
  - `/explore`
  - `/idea/:id`
  - `/profile`
  - `/submit`
- `AppShell` maps future-oriented sidebar labels (Projects, Templates, AI Studio) to existing routes as temporary navigation destinations. Update this mapping when real routes are introduced.

## Design rules to preserve

- Palette: indigo primary, violet AI accent, emerald success, amber discovery; light background `#FAFAF8`.
- Generous whitespace; rounded cards usually 16–28px; soft shadows; avoid all-caps buttons and heavy borders.
- Desktop sidebar and mobile five-tab nav belong to the authenticated workspace.
- Minimum touch target is 44px where practical.
- Use `lucide-react` icons (already installed).
- Animations should be quiet, generally 200–350ms. Existing `prefers-reduced-motion` handling lives in `index.css`.

## Verification

From `IdeaForge/frontend`, run:

```bash
npx vite build
git diff --check
```

The Vite production build passed after every completed redesign slice.

`npm run build` currently fails before Vite due to **pre-existing legacy files** that import Next.js/Prisma modules (`next/navigation`, `@prisma/client`, `@/app/...`) which are not part of this Vite runtime. Do not attribute those errors to the redesign unless changes touch those files.

Vite emits a non-blocking warning that the JavaScript bundle exceeds 500 kB. Consider route-level lazy loading in the final performance/polish slice, not before core UI work is complete.

## Working-tree caution

The worktree already contained many user changes before this redesign began (including auth page work, dependencies, generated components, assets, and deleted `stitch_html` files). Preserve unrelated changes. Do not reset, checkout, or broadly overwrite files. Current redesign edits are concentrated in:

- `src/components/AppShell.tsx` (new)
- `src/App.tsx`
- `src/index.css`
- `src/pages/DashboardPage.tsx`
- `src/pages/SubmitIdeaPage.tsx`
- `src/pages/IdeaDetailPage.tsx`

No credentials, tokens, or API keys belong in this handoff or in source control.
