# DevOps and Deployment (Frontend)

This document defines the environment strategy, build pipeline, configuration management,
and operational approach for the ReqSmell frontend. Backend DevOps is in
`Backend/docs/DEVOPS.md`.

## Operational Scope

The frontend is a Vite-built React application served in the browser during development.
No production build is deployed in this version.

| Operational requirement | Target |
|---|---|
| Availability | During active research sessions in the browser |
| Recoverability | Reload the page; completed reports should be exported before closing |
| Scalability | Single user, single browser tab |
| Automation | Quality checks automated via npm scripts |
| Observability | Toast notifications for API errors; no logging to console |

## Environment Strategy

### Development Environment

| Component | Technology | How to start |
|---|---|---|
| Frontend | React + Vite dev server | `npm run dev` |
| API proxy | Vite `server.proxy` | Configured in `vite.config.ts`; forwards `/api/*` to `http://localhost:8000` |

The backend must be running before the frontend can complete any analysis. See
`Backend/docs/DEVOPS.md` for the backend start command.

### Staging and Production Environments

Not in scope for this version.

When a deployment is added in a future version, it should address:

| Area | Consideration |
|---|---|
| Frontend serving | Serve the `dist/` build via a CDN or static file host |
| API base URL | Make the backend URL configurable via `VITE_API_URL` instead of the dev proxy |
| Content Security Policy | Add CSP headers appropriate for the hosting environment |

## Build Pipeline

No CI/CD pipeline is configured. All checks run locally before commits.

### Frontend Quality Gate

All five commands must pass before committing or releasing:

| Command | What it checks |
|---|---|
| `npm run type-check` | TypeScript strict mode |
| `npm run lint` | ESLint rules |
| `npm run test -- --run` | Vitest unit tests |
| `npm audit` | Dependency vulnerabilities |
| `npm run build` | Production build success |

If a future CI/CD pipeline is added (such as GitHub Actions), these same commands
should form the pipeline steps.

## Configuration Management

The frontend has no runtime environment variables in this version. The backend API
URL is fixed to `http://localhost:8000` via the Vite proxy in `vite.config.ts`.

No secrets are managed by the frontend. API keys for LLM providers are backend-only;
see `Backend/docs/DEVOPS.md`.

If a deployed environment is added, the API base URL should be made configurable:

```text
VITE_API_URL=https://your-backend-host.example.com
```

## Observability

| Signal | Where | How to access |
|---|---|---|
| Pipeline progress | Run step in the browser | Visible in the UI |
| API errors | Toast notifications | Visible in the browser |

The frontend does not write to the browser console in production. All API errors are
normalised in `src/api/client.ts` and dispatched to the Redux toast slice for display.

## Incident Management

| Situation | First action |
|---|---|
| Frontend shows no progress after starting analysis | Confirm the backend is running at `http://localhost:8000/health` |
| Toast notification shows a network error | Check that the backend process is still running and has not crashed |
| Export CSV produces an empty file | Check that the results table has data before exporting |
| Export PDF produces a blank document | Confirm the report step rendered results before exporting |
| Page is blank after loading | Check the browser console for a JavaScript error; check that `npm run build` succeeds |

## Backup and Recovery

The frontend holds no persistent state. All run data lives in the backend in-memory
store.

| What could be lost | Recovery |
|---|---|
| Completed report | Export CSV or PDF before closing the browser tab or restarting the backend |
| Analysis configuration | Re-enter configuration in the wizard; settings are not saved between sessions |

## Version Management

The versioning strategy is defined in `VERSIONING.md`. The three-tier model is:

| Tier | Pattern | What triggers it |
|---|---|---|
| Major baseline | `vX.0.0` | Architecture change, API contract break, major new component |
| Feature change | `vX.Y.0` | New UI step, analysis behaviour, or significant component |
| Patch | `vX.Y.Z` | Bug fix, dependency update, documentation correction |

Every released version requires a version document, an index entry, and a passing
quality gate before the tag is created.

## Operational Readiness

| Check | Status |
|---|---|
| Local development environment documented | SETUP.md, COMMANDS.md |
| Quality gates defined and enforced | COMMANDS.md, VERSIONING.md |
| Configuration management defined | This document, `vite.config.ts` |
| No secrets in frontend code or environment | Confirmed; no `VITE_*` key variables |
| API errors produce plain-language messages | Implemented in `src/api/client.ts` and `toastSlice.ts` |
| Known limitations documented | This document, version docs, ARCHITECTURE.md |
