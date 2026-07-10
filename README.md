# ReqSmell Frontend

Version 2.8 of the ReqSmell frontend.

This repository contains the web client for the ReqSmell requirements smell detection
prototype. It is built with React, TypeScript, Vite, Redux Toolkit, Tailwind CSS,
Recharts, jsPDF, and Vitest.

`v2.0.0` is the frozen major baseline (first complete interface). `v2.1.0`-`v2.8.0`
are interface design changes built on top of it. Read [docs/VERSIONING.md](docs/VERSIONING.md)
to understand the three-tier version model.

## Related Repositories

| Repository | Purpose |
|---|---|
| [ReqSmell Backend](https://github.com/Mikun07/LLM_Prototype_Backend) | FastAPI API for CSV upload, analysis orchestration, provider calls, and report generation |
| [ReqSmell Frontend](https://github.com/Mikun07/LLM_Prototype_Frontend) | This React client |

## Start Here

If you are new to this project, read these documents in order:

| Document | Use it for |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Component structure, state design, wizard flow, design decisions |
| [docs/SETUP.md](docs/SETUP.md) | Installing tools, cloning the repo, installing dependencies, and running the app |
| [docs/COMMANDS.md](docs/COMMANDS.md) | Understanding every npm, Git, test, build, and version command |
| [docs/TESTING.md](docs/TESTING.md) | Running checks and understanding what each test command proves |
| [docs/VERSIONING.md](docs/VERSIONING.md) | The three-tier version model, folder structure, and release process |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) | Frontend user stories, UI requirements, NFRs, and acceptance criteria |
| [docs/RISK_ASSESSMENT.md](docs/RISK_ASSESSMENT.md) | Frontend-specific risks with probability, impact, and mitigation |
| [docs/SECURITY.md](docs/SECURITY.md) | Frontend security scope, attack surface, secure coding requirements |
| [docs/DEVOPS.md](docs/DEVOPS.md) | Frontend build pipeline, configuration, observability, incident management |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Fixing common setup, npm, Git, Vite, and Windows issues |
| [docs/versions/index.md](docs/versions/index.md) | Full version history table |
| [docs/versions/v2/v2.8.0.md](docs/versions/v2/v2.8.0.md) | Full documentation for version 2.8 (current) |
| [docs/versions/v2/v2.7.0.md](docs/versions/v2/v2.7.0.md) | Full documentation for version 2.7 |
| [docs/versions/v2/v2.6.0.md](docs/versions/v2/v2.6.0.md) | Full documentation for version 2.6 |
| [docs/versions/v2/v2.5.0.md](docs/versions/v2/v2.5.0.md) | Full documentation for version 2.5 |
| [docs/versions/v2/v2.4.0.md](docs/versions/v2/v2.4.0.md) | Full documentation for version 2.4 |
| [docs/versions/v2/v2.0.0.md](docs/versions/v2/v2.0.0.md) | Full documentation for the v2 baseline |
| [docs/versions/v1/v1.0.0.md](docs/versions/v1/v1.0.0.md) | Full documentation for version 1 |

## Quick Setup

Use this when Node.js, npm, and Git are already installed.

```powershell
git clone https://github.com/Mikun07/LLM_Prototype_Frontend.git
cd LLM_Prototype_Frontend
npm ci
npm run dev
```

Open the app at:

```text
http://127.0.0.1:5173/
```

Stop the dev server with `Ctrl+C` in the terminal where it is running.

You can test the interface with:

```text
examples/sample-requirements.csv
```

## Verify The Project

Run these commands before making a pull request or creating a new version:

```powershell
npm run type-check
npm run lint
npm run test -- --run
npm audit
npm run build
```

All five should pass for a clean version-2 interface.

## Version Commands

List available versions:

```powershell
npm run version:list
```

Show the current version or commit:

```powershell
npm run version:current
```

Restore the current version-2.8 clean slate after the `v2.8.0` tag exists:

```powershell
npm run version:use -- -Version v2.8 -CleanIgnored -Install
```

Rollback to version 1:

```powershell
npm run version:use -- -Version v1.0.0 -CleanIgnored -Install
```

Return to the latest `main` branch:

```powershell
npm run version:use -- -Latest -Install
```

## Version Summary

| Field | Value |
|---|---|
| Current version | `2.8.0` |
| Active major baseline | `v2.0.0` |
| Next expected release | `v2.9.0` (interface design change) or `v2.8.1` (patch, if needed) |

Version 2 now uses the backend for CSV upload and analysis run status. No LLM API key is
stored in the browser; provider calls stay behind the backend API boundary.

## Three-Tier Version Model

| Tier | Pattern | When to use |
|---|---|---|
| Major baseline | `vX.0.0` | System architecture changes - new major component, backend integration, or complete rebuild |
| Interface design change | `vX.Y.0` | Visible design or flow change - layout, colours, a new step, a reworked component |
| Patch | `vX.Y.Z` | Minimal, barely-noticeable - package update, typo fix, config tweak |

Full explanation and release process: [docs/VERSIONING.md](docs/VERSIONING.md)

## Project Structure

| Path | Purpose |
|---|---|
| `src/` | Frontend source code |
| `src/api/` | Backend API client boundary |
| `src/components/` | Custom reusable UI, chart, wizard, and dashboard components |
| `src/constants/` | Shared application constants |
| `src/hooks/` | Custom reusable hooks |
| `src/store/` | Redux Toolkit store and slices |
| `src/types/` | Shared TypeScript domain types |
| `src/utils/` | CSV parsing, formatting, and report-preview utilities |
| `__tests__/` | Vitest test files |
| `docs/` | Setup, testing, command, troubleshooting, and versioning guides |
| `scripts/` | Local helper scripts, including version switching |
| `dist/` | Generated production build output, ignored by Git |
| `node_modules/` | Installed dependencies, ignored by Git |

## Key Types

All shared types live in `src/types/index.ts` and mirror the backend Pydantic models.
Changes to the backend API contract must be reflected here.

**Union types:**

| Type | Values |
|---|---|
| `ModelName` | `claude` \| `chatgpt` |
| `SmellType` | `ambiguity` \| `inconsistency` |
| `SmellLabel` | `SMELL` \| `CLEAN` |
| `ConfidenceLevel` | `HIGH` \| `MEDIUM` \| `LOW` |
| `AmbiguityType` | `lexical` \| `syntactic` \| `referential` \| `semantic` \| `none` |
| `AgreementStatus` | `AGREE` \| `DISAGREE` |
| `PipelineStatus` | `queued` \| `running` \| `complete` \| `error` |

**Key interfaces**: `RequirementRow`, `RunConfig`, `AmbiguityResult` (includes `ambiguityType`),
`InconsistencyResult`, `ModelReport`, `ComparisonReport`, `RunStatusResponse`.

## API Contract

All HTTP calls go through `src/api/client.ts`. The frontend talks to three backend endpoints:

| Method | Path | When |
|---|---|---|
| `POST` | `/api/upload` | User drops a CSV file |
| `POST` | `/api/analyse` | User starts the run |
| `GET` | `/api/status/{runId}` | Polled every 1 200 ms during the Run step |

`client.ts` normalises error messages before they reach the Redux store. No provider API keys
are used or stored in the browser.

## Backend Assumption

The frontend API boundary expects the backend API to be available at:

```text
http://localhost:8000
```

During local development, Vite forwards frontend `/api/*` requests to the backend through
the proxy configured in `vite.config.ts`.

## Deployment

The repository includes `netlify.toml` for frontend deployment.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Backend connection | `/api/*` is proxied locally by Vite; production must point to the deployed backend API |

No production frontend URL is documented in this repository yet.

## License

This project uses the MIT License. See [LICENSE](LICENSE).
