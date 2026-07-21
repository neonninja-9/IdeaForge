# Backend API implementation status

This document is the working checklist for the IdeaForge backend as of July 21, 2026. The route-level request and response contract is in [API.md](API.md).

## Implemented and connected

These APIs exist in the backend and are used by the current React application.

| Area | Endpoints | Status | Notes |
| --- | --- | --- | --- |
| Health | `GET /` | Implemented | Basic API availability response. |
| Authentication | `POST /api/v1/auth/register`, `/login`, `/refresh`, `/logout`; `GET /me` | Implemented | JWT access token plus httpOnly refresh cookie. Registration/login validation is present. |
| Ideas | `GET /api/v1/ideas`, `GET /ideas/:id`, `POST /ideas`, `DELETE /ideas/:id`, `GET /ideas/my`, `GET /ideas/dashboard` | Implemented | Public browse/search/filter, create, owner-only deletion, profile and dashboard data. |
| Categories and tags | `GET /api/v1/categories`, `GET /api/v1/tags` | Implemented | Database-backed lookup data; run `npm run seed` in `backend/` first. |
| Comments | `GET /api/v1/comments?ideaId=:id`, `POST /comments`, `DELETE /comments/:id` | Implemented | Read is public; create/delete requires login; deletion is owner-only. |
| Votes | `POST /api/v1/votes/toggle` | Implemented | One vote per user/idea and returns updated vote total. |
| Project Canvas | `GET`, `PUT /api/v1/projects/canvas` | Implemented | Private, account-persisted canvas notes. Used by the Projects page. |
| Preferences | `GET`, `PUT /api/v1/users/me/preferences` | Implemented | Private account preferences. Used by Settings. |
| Profile update | `PATCH /api/v1/users/me` | Implemented, UI pending | Backend supports username/email updates; Settings does not yet expose an edit form. |
| AI assistant transport | `POST /api/v1/ai/assist` | Implemented as fallback | Used by AI Studio and the Submit Idea preview. It returns deterministic coaching text, not model-generated content. |

## Frontend features that are not server-backed yet

These work in the interface but do not persist to the IdeaForge API/database.

| Feature | Current behavior | Backend work needed |
| --- | --- | --- |
| Favorites | Stored in the browser using `localStorage`; the Favorites page filters ideas by those IDs. | Add a `Favorite` model and protected `GET /favorites`, `POST /favorites/:ideaId`, and `DELETE /favorites/:ideaId` endpoints. Replace the local-storage helper. |
| Templates | Static frontend template cards that prefill the idea form. | Optional: add a `Template` model plus public `GET /templates` and admin CRUD if templates should be managed without a deploy. |
| AI Studio history | Messages disappear on refresh and are not shared across devices. | Add `AiConversation` and `AiMessage` models; implement `GET/POST /ai/conversations`, `GET /ai/conversations/:id/messages`, and `POST /ai/conversations/:id/messages`. |
| AI quality | The API responds with fixed, deterministic guidance. | Integrate an AI provider in `ai.controller.js`, keep the same `/ai/assist` response contract, add request limits, usage logging, and safe failure handling. |
| Idea attachments | Voice, image, file, and sketch controls are visual only. | Add object storage and an `Attachment` model; implement signed upload flow and `POST/DELETE /ideas/:id/attachments`. |
| Share action | The idea-detail Share button has no behavior. | Frontend-only: Web Share API/copy-link is sufficient. Add sharing analytics only if needed. |
| Notifications | The shell explicitly labels notifications as a prototype. | Add `Notification` model and protected list/read endpoints; generate events for votes and comments. |

## Important API gaps to implement next

Prioritized by product impact.

1. **Persist favorites.** It is the only current saved-user feature still stored solely on a device. Add the `Favorite` model and routes listed above.
2. **Edit ideas.** Add `PATCH /api/v1/ideas/:id` with ownership checks, body validation, category/tag validation, and a corresponding frontend edit screen. The backend currently supports create and delete only.
3. **Use a real AI provider.** Replace the fallback in `src/controllers/ai.controller.js`. Keep API keys server-side in environment variables; never expose them to Vite/browser code.
4. **Persist AI conversations.** Create conversation/message endpoints before adding history, rename, or cross-device AI use in the frontend.
5. **Add uploads.** Choose an object-storage provider, validate type/size server-side, and use signed uploads instead of sending large files through the Express process.
6. **Add pagination to profile and dashboard ideas.** `GET /ideas/my` and `/ideas/dashboard` currently return all authored ideas; introduce `page` and `limit` as data grows.

## Backend quality work

| Item | Why it matters |
| --- | --- |
| Request validation for ideas, comments, votes, canvas, and user updates | Authentication currently has validator middleware, but most non-auth payloads are manually checked only. Add reusable `express-validator` rules. |
| MongoDB ObjectId validation | Invalid IDs can surface as Mongoose cast errors. Convert them to consistent `400` responses. |
| Automated API tests | Add integration tests for auth, ownership checks, request validation, and vote/favorite uniqueness before expanding features. |
| Configuration | Move the port and client origin to environment variables; the server currently uses port `8080` directly and permissive reflected CORS. |
| Rate limiting and security headers | Especially required before a real AI provider, public deployment, or credential abuse protection. |
| API specification | Maintain an OpenAPI document once external consumers or a mobile client are planned. |

## Suggested ownership rule

- Public reads: ideas, categories, tags, and comments.
- Authenticated writes: ideas, votes, comments, AI, canvas, preferences, and favorites.
- Owner-only writes/deletes: an idea, comment, canvas, preference set, favorite, and AI conversation must only be changed by its owning user.
- Admin-only: future template management and moderation.

## Quick setup

```sh
cd backend
npm install
npm run init-db
npm run seed
npm start
```

Create `backend/.env` with the MongoDB connection and JWT secrets expected by `db.js` and `src/config/token.config.js` before starting the server.
