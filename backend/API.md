# IdeaForge API v1

Base URL: `http://localhost:8080/api/v1`

All responses use `{ "status": "success", "data": ... }`. Errors use `{ "status": "fail" | "error", "message": "..." }`.

Protected endpoints require an access token:

```http
Authorization: Bearer <accessToken>
```

Authentication also sets an httpOnly refresh-token cookie. The frontend sends it with `credentials: "include"`.

## Authentication

| Method | Path | Auth | Request body |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | `{ username, email, password }` |
| POST | `/auth/login` | No | `{ identifier, password }` |
| POST | `/auth/refresh` | Cookie | None |
| POST | `/auth/logout` | No | None |
| GET | `/auth/me` | Yes | None |

Register, login, and refresh return `data.user` and `data.accessToken`.

## Ideas and community

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/ideas` | No | Query: `q`, `category`, `tag`, `difficulty`, `sort`, `page`, `limit`. `sort` is `newest`, `oldest`, `top`, or `discussed`. |
| GET | `/ideas/:id` | Optional | Includes vote/comment totals and `hasVoted` when authenticated. |
| POST | `/ideas` | Yes | `{ title, problem, solution, impact?, difficulty, category, tags, suggestedTechStack? }`; `category` and `tags` are Mongo IDs. |
| DELETE | `/ideas/:id` | Yes | Owner only; removes attached votes and comments. |
| GET | `/ideas/my` | Yes | Current user's ideas. |
| GET | `/ideas/dashboard` | Yes | Current-user stats and ideas. |
| GET | `/categories` | No | Available categories. |
| GET | `/tags` | No | Available tags. |
| GET | `/comments?ideaId=:id` | No | Comments for an idea. |
| POST | `/comments` | Yes | `{ ideaId, text }` |
| DELETE | `/comments/:id` | Yes | Comment owner only. |
| POST | `/votes/toggle` | Yes | `{ ideaId }`; returns `{ voted, voteCount }`. |

## Workspace sync

These endpoints back the Project Canvas and Settings pages. All are private to the authenticated user.

| Method | Path | Request body | Result |
| --- | --- | --- | --- |
| GET | `/projects/canvas` | None | `{ notes, updatedAt }`; a new account receives an empty notes object. |
| PUT | `/projects/canvas` | `{ notes: { "Problem": "...", "Customer": "..." } }` | Replaces the user's canvas and returns the saved data. Notes are capped at 5,000 characters each. |
| GET | `/users/me/preferences` | None | `{ preferences: { productUpdates, weeklyReflection } }` |
| PUT | `/users/me/preferences` | `{ preferences: { productUpdates, weeklyReflection } }` | Persists the submitted boolean preferences. |
| PATCH | `/users/me` | `{ username?, email? }` | Returns the updated public user profile. |

## AI Studio

| Method | Path | Auth | Request body |
| --- | --- | --- | --- |
| POST | `/ai/assist` | Yes | `{ message, context?: { ideaTitle?: string } }` |

The response is `{ data: { message, provider } }`. It currently uses a deterministic built-in coaching response, so the UI is fully connected without storing a third-party AI key. A model provider can replace the controller implementation while retaining this response contract.

## Common status codes

`200` successful read/update, `201` resource created, `400` invalid request, `401` unauthenticated, `403` forbidden, `404` missing resource, `409` duplicate user field, and `500` unexpected server error.
