# Aftertone

Aftertone is a personal music diary: a place to explore listening history and connect songs with the days, seasons, and life moments around them.

This initial scaffold has a React home page and an Express health API. Spotify sign-in, listening-history import, and diary storage are not implemented yet.

## Project layout

```text
backend/   Express API and production web server
frontend/  React application built with Vite
```

Each project has its own `package.json`, dependencies, and commands.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Install

From the repository root:

```sh
cd backend
npm install
cd ../frontend
npm install
```

## Run locally

Open two terminals from the repository root.

Terminal 1 — backend:

```sh
cd backend
npm run dev
```

Terminal 2 — frontend:

```sh
cd frontend
npm run dev
```

Open <http://localhost:8080> for the home page. Vite forwards `/api` requests to the backend at `http://localhost:3030`.

Check backend health:

```sh
curl http://localhost:3030/api/health
```

The endpoint returns `{"status":"ok"}`. The same endpoint is available through the frontend proxy at <http://localhost:8080/api/health>.

## Tests and builds

Run the frontend Cypress component test:

```sh
cd frontend
npm run test:component
```

Open Cypress interactively with `npm run test:component:open`. Build either project with `npm run build` from its directory.

## Production

Build the frontend first, then build and start the backend:

```sh
cd frontend
npm run build
cd ../backend
npm run build
npm start
```

Express serves the compiled frontend from `frontend/dist/` and the API from the same host. The API listens on port `3030` by default; set `PORT` to override it.
