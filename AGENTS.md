# Aftertone

Personal music diary. Users sign in with Spotify and look back at listening history in the context of days, seasons, and life moments.

## Goal

Show a signed-in user's recent Spotify listening as a readable timeline. The Spotify access token stays on the server and is never sent to the browser.

## Architecture

Two packages, one origin:

- `frontend/` — React + Vite. Clerk session in the browser. Calls `/api/*` with same-origin credentials.
- `backend/` — Express. Validates the Clerk session, fetches the user's Spotify OAuth token from Clerk, and calls the Spotify Web API.

In development, Vite (`localhost:8080`) proxies `/api` to Express (`localhost:3030`). In production, Express serves `frontend/dist` and the API on the same host.

```text
Browser → React (Clerk session cookie)
        → Express /api/*
        → Clerk (session + Spotify token)
        → Spotify Web API
        → JSON without the access token
```

## API

| Route | Auth | Result |
| --- | --- | --- |
| `GET /api/health` | none | `{ status: "ok" }` |
| `GET /api/me` | Clerk session | Clerk user id and a safe Spotify profile |
| `GET /api/recently-played` | Clerk session | Up to 50 recent tracks; the UI groups them by day |

`401` means no session. `403` means the Clerk user has no Spotify connection, or the recently-played scope is missing. Spotify failures return `502`.

Required Spotify scopes: `user-read-email`, `user-read-private`, `user-read-recently-played`.

## Boundaries

- Frontend owns UI and client state. Backend owns Clerk verification and every Spotify call.
- Do not return Spotify tokens, Clerk secrets, or raw provider payloads to the client.
- Secrets live in `backend/.env` and `frontend/.env.local`. Do not commit them.
