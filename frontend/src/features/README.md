# Feature folder boundaries

The folders under `src/features/` are for **browser-side feature presentation and interaction**. Keep the responsibilities below separate so a React page cannot become a second implementation of backend rules.

## What belongs here

- `components/`: presentational React components, accessibility, layout, and user interactions.
- `pages/`: page composition, route-level loading/error/empty states, and UI state.
- `hooks/`: React Query cache/loading/mutation state and browser-only state such as selected dates or filters.
- `types/`: frontend view models and TypeScript request/response contracts used by a feature.

## What does not belong here

Do not put backend implementations in this directory. In particular, do not add:

- Database queries, SQL/JDBC, repositories, persistence, or transaction handling.
- Server controllers, authentication/authorization enforcement, or secret management.
- Medication scheduling rules, dose-state transitions, adherence scoring, clinical decisions, inventory valuation, procurement calculations, or forecasting algorithms.
- AI inference, prompt execution, OCR processing, or anomaly-detection algorithms.

Implement authoritative rules and processing in the Spring Boot backend and expose the results through REST APIs.

## API requests

Feature hooks may call frontend API adapters in `src/services/`. The adapter owns HTTP details and the feature hook owns only browser query/mutation state. Do not call `fetch` or create a second Axios client inside a feature.

AI screens send a task identifier and optional user-provided text only. Do not put model prompts, clinical instructions, anomaly rules, or inventory analysis policies in feature pages; the backend must own those task definitions and access the authorised data.

Current examples:

- `features/adherence/hooks/useAdherence.ts` uses `services/adherence.service.ts`.
- `features/ai/hooks/useAI.ts` uses `services/ai.service.ts`.
- `features/analytics/hooks/useAnalytics.ts` uses `services/analytics.service.ts`.

These service files are **frontend API clients**. They do not implement server-side business logic.

## Allowed UI-side calculations

Simple display-only operations are fine: filtering the rows currently visible, grouping dates for a calendar, sorting a history list, formatting numbers/dates, and scaling a chart. They must not be treated as the authoritative source for clinical, financial, inventory, or permission decisions.

For example, the adherence summary and percentage must come from the backend summary response. The browser may render that value but must not derive an alternative rate or assign clinical thresholds.

## Comments for feature modules

When a hook or component sits near an API boundary, add a short module comment stating:

1. What browser-side responsibility it owns.
2. Which service/API supplies authoritative data.
3. Which decisions or calculations must remain server-side.

Keep comments factual and update them when API contracts change.
