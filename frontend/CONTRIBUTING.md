# Frontend Contribution Guidelines

These guidelines keep the React application focused on browser UI while Spring Boot owns server-side behavior.

## Where code belongs

| Concern | Frontend | Backend |
| --- | --- | --- |
| Pages, layouts, navigation, responsive design | Yes | No |
| Form state, client-side validation messages | Yes | Validate the same inputs authoritatively |
| Query caching, loading and error states | Yes | No |
| HTTP calls and response mapping | API adapters in `src/services/` | REST controllers and application services |
| Authentication and authorization decisions | Display and route experience only | Enforce on every protected API |
| Business rules and workflow decisions | Display server results; no authority | Yes |
| Database access, SQL, transactions, persistence | Never | Yes |
| Private credentials and signing keys | Never | Server-side secret configuration |

## API integration

1. Put calls to Spring Boot endpoints in a feature service under `src/services/` (or the existing feature API adapter pattern).
2. Reuse the shared HTTP client in `src/lib/axios.ts` so base URLs, cookies, and error handling stay consistent.
3. Keep React components responsible for rendering, user interaction, and presenting loading, success, empty, and error states.
4. Keep response/request interfaces in `src/types/`. Coordinate contract changes with the backend team rather than reimplementing server business rules in TypeScript.
5. Do not call a database directly from browser code. The browser must communicate with server APIs.

## Validation and authorization

- Client-side schemas are for immediate feedback and better forms. The backend must validate all incoming data again.
- Route guards and role-based UI visibility improve navigation, but users can bypass browser code. Every protected operation must be authorized by the backend.
- Never trust a role, permission, amount, stock level, patient identifier, or workflow status merely because the browser supplied it.

## Environment and secrets

- Only browser-safe configuration belongs in frontend environment variables.
- Vite exposes `VITE_*` values in the client bundle. Never store database credentials, JWT/signing secrets, private API keys, or SMTP passwords in them.
- Keep local `.env` files untracked. Commit safe placeholder values in `.env.example` only.

## Before opening a pull request

Run the checks supported by the current frontend package:

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
```

Describe any check that could not be run and coordinate API contract changes with the backend maintainers.
