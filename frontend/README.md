# MediContinuum Frontend

The frontend is a browser application built with React, TypeScript, Vite, React Router, and TanStack Query.

## Frontend/backend boundary

The `frontend/` directory contains presentation and browser-side application code only:

- Pages, layouts, reusable UI components, navigation, and responsive styling.
- Form state and client-side validation for a good user experience.
- Browser state, query caching, loading/error states, and display formatting.
- HTTP request adapters that call the Spring Boot API.

The files in `src/services/` are **frontend API clients**, not backend services. They send HTTP requests through `src/lib/axios.ts` and translate API responses into data the UI can display. Keep these adapters in the frontend; deleting them would disconnect the UI from the backend.

The backend remains responsible for all authoritative operations, including authentication, authorization, permission enforcement, business rules, validation of incoming requests, database access, transactions, scheduling, and sensitive processing. Frontend role checks and form validation are for presentation and usability only; they are never a security boundary.

Do not add Spring controllers, repositories, JPA entities, database drivers, SQL/JDBC access, server credentials, or backend business workflows to this directory. Implement those in `backend/` (or the appropriate server-side module) and expose them through an API.

## Source layout

| Path | Purpose |
| --- | --- |
| `src/app/` | App bootstrap, providers, routing |
| `src/components/` | Shared UI and layout components |
| `src/features/` | Feature-specific pages, components, and browser hooks |
| `src/hooks/` | Reusable React hooks |
| `src/lib/axios.ts` | Shared HTTP client for backend API requests |
| `src/services/` | Frontend API request adapters |
| `src/schemas/` | Client-side form/input schemas |
| `src/store/` | Browser-side state |
| `src/styles/`, `src/index.css` | Frontend styling |
| `src/types/` | TypeScript API and UI data contracts |
| `src/utils/` | Formatting and client-side helpers |

## Environment configuration

Copy `.env.example` to `.env` and adjust the local values when needed.

- `VITE_API_BASE_URL` is the API path used by the browser (default: `/api`).
- `VITE_API_PROXY_TARGET` is the local Spring Boot server used by the Vite development proxy (default: `http://localhost:8080`).

**Every variable prefixed with `VITE_` is exposed to the browser bundle. Never put database passwords, private API keys, signing secrets, or other server credentials in frontend environment variables.** Keep the real local `.env` file untracked; commit only `.env.example` with safe placeholders.

## Development

Requirements: Node.js `>=22.12.0` and npm `>=10.9.0`.

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
```
